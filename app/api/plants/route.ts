import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * 세션 ID로 식물 조회 또는 통계 조회
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stats = searchParams.get("stats");
    const sessionId = searchParams.get("sessionId");

    // 통계 조회 (관리자용)
    if (stats === "true") {
      const { count, error } = await supabase
        .from("plants")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Supabase 식물 통계 조회 오류:", error);
        return NextResponse.json(
          { success: false, error: "식물 통계 조회에 실패했습니다." },
          { status: 500 }
        );
      }

      // 식물 타입별 통계
      const { data: plantsByType, error: typeError } = await supabase
        .from("plants")
        .select("type");

      if (typeError) {
        console.error("Supabase 식물 타입별 통계 조회 오류:", typeError);
      }

      const typeStats = (plantsByType || []).reduce(
        (acc, plant) => {
          acc[plant.type] = (acc[plant.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      return NextResponse.json({
        success: true,
        count: count || 0,
        typeStats,
      });
    }

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "sessionId가 필요합니다." },
        { status: 400 }
      );
    }

    // 세션 ID로 식물 조회
    const { data: plant, error } = await supabase
      .from("plants")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116은 "not found" 에러 코드
      console.error("Supabase 식물 조회 오류:", error);
      return NextResponse.json(
        { success: false, error: "식물 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    if (!plant) {
      return NextResponse.json({
        success: true,
        plant: null,
      });
    }

    // 케어 기록 조회
    const { data: careRecords, error: careError } = await supabase
      .from("care_records")
      .select("*")
      .eq("plant_id", plant.id)
      .order("timestamp", { ascending: false });

    if (careError) {
      console.error("Supabase 케어 기록 조회 오류:", careError);
    }

    return NextResponse.json({
      success: true,
      plant: {
        id: plant.id,
        type: plant.type,
        name: plant.name,
        createdAt: plant.created_at,
        lastCaredAt: plant.last_cared_at,
        isMature: plant.is_mature,
        isExchanged: plant.is_exchanged,
        exchangedAt: plant.exchanged_at,
        careHistory: (careRecords || []).map((record) => ({
          type: record.type,
          timestamp: record.timestamp,
        })),
      },
    });
  } catch (error) {
    console.error("식물 조회 오류:", error);
    return NextResponse.json(
      { success: false, error: "식물 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 식물 생성
 */
export async function POST(request: Request) {
  try {
    const { sessionId, type, name } = await request.json();

    if (!sessionId || !type || !name) {
      return NextResponse.json(
        { success: false, error: "sessionId, type, name이 필요합니다." },
        { status: 400 }
      );
    }

    // 세션 ID로 이미 식물이 있는지 확인
    const { data: existingPlant } = await supabase
      .from("plants")
      .select("id")
      .eq("session_id", sessionId)
      .single();

    if (existingPlant) {
      return NextResponse.json(
        { success: false, error: "이미 식물이 존재합니다." },
        { status: 400 }
      );
    }

    // 식물 생성
    const { data: plant, error } = await supabase
      .from("plants")
      .insert({
        session_id: sessionId,
        type,
        name,
        created_at: new Date().toISOString(),
        is_mature: false,
        is_exchanged: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase 식물 생성 오류:", error);
      return NextResponse.json(
        { success: false, error: "식물 생성에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      plant: {
        id: plant.id,
        type: plant.type,
        name: plant.name,
        createdAt: plant.created_at,
        lastCaredAt: plant.last_cared_at,
        isMature: plant.is_mature,
        isExchanged: plant.is_exchanged,
        exchangedAt: plant.exchanged_at,
        careHistory: [],
      },
    });
  } catch (error) {
    console.error("식물 생성 오류:", error);
    return NextResponse.json(
      { success: false, error: "식물 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}

