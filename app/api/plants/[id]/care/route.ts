import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * 케어 기록 추가
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const plantId = params.id;
    const { type } = await request.json();

    if (!type || !["water", "fertilizer", "sunlight", "wind"].includes(type)) {
      return NextResponse.json(
        { success: false, error: "유효한 케어 타입이 필요합니다." },
        { status: 400 }
      );
    }

    // 식물 존재 확인
    const { data: plant, error: plantError } = await supabase
      .from("plants")
      .select("id")
      .eq("id", plantId)
      .single();

    if (plantError || !plant) {
      return NextResponse.json(
        { success: false, error: "식물을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 케어 기록 추가
    const now = new Date().toISOString();
    const { data: careRecord, error } = await supabase
      .from("care_records")
      .insert({
        plant_id: plantId,
        type,
        timestamp: now,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase 케어 기록 생성 오류:", error);
      return NextResponse.json(
        { success: false, error: "케어 기록 추가에 실패했습니다." },
        { status: 500 }
      );
    }

    // 식물의 last_cared_at 업데이트
    await supabase
      .from("plants")
      .update({ last_cared_at: now })
      .eq("id", plantId);

    return NextResponse.json({
      success: true,
      careRecord: {
        type: careRecord.type,
        timestamp: careRecord.timestamp,
      },
    });
  } catch (error) {
    console.error("케어 기록 추가 오류:", error);
    return NextResponse.json(
      { success: false, error: "케어 기록 추가에 실패했습니다." },
      { status: 500 }
    );
  }
}

