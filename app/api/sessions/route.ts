import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabase } from "@/lib/supabase";

/**
 * 세션 ID 생성 및 저장
 */
export async function POST() {
  try {
    const sessionId = randomUUID();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("sessions")
      .insert({
        id: randomUUID(),
        session_id: sessionId,
        created_at: now,
        last_accessed_at: now,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase 세션 생성 오류:", error);
      return NextResponse.json(
        { success: false, error: "세션 생성에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId,
    });
  } catch (error) {
    console.error("세션 생성 오류:", error);
    return NextResponse.json(
      { success: false, error: "세션 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 세션 ID 등록 (기존 세션 ID를 서버에 등록)
 */
export async function PUT(request: Request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { success: false, error: "세션 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // 이미 존재하는 세션인지 확인
    const { data: existingSession, error: selectError } = await supabase
      .from("sessions")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      // PGRST116은 "not found" 에러 코드
      console.error("Supabase 세션 조회 오류:", selectError);
      return NextResponse.json(
        { success: false, error: "세션 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    if (existingSession) {
      // 마지막 접속 시간만 업데이트
      const { error: updateError } = await supabase
        .from("sessions")
        .update({ last_accessed_at: new Date().toISOString() })
        .eq("session_id", sessionId);

      if (updateError) {
        console.error("Supabase 세션 업데이트 오류:", updateError);
        return NextResponse.json(
          { success: false, error: "세션 업데이트에 실패했습니다." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        sessionId,
        isNew: false,
      });
    }

    // 새 세션 생성
    const now = new Date().toISOString();
    const { error: insertError } = await supabase
      .from("sessions")
      .insert({
        id: randomUUID(),
        session_id: sessionId,
        created_at: now,
        last_accessed_at: now,
      });

    if (insertError) {
      console.error("Supabase 세션 생성 오류:", insertError);
      return NextResponse.json(
        { success: false, error: "세션 등록에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId,
      isNew: true,
    });
  } catch (error) {
    console.error("세션 등록 오류:", error);
    return NextResponse.json(
      { success: false, error: "세션 등록에 실패했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 세션 목록 조회 (관리자용)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const countOnly = searchParams.get("count") === "true";

    // 세션 목록 조회 (최신순 정렬)
    const { data: sessions, error, count } = await supabase
      .from("sessions")
      .select("*", { count: countOnly ? "exact" : undefined })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase 세션 조회 오류:", error);
      return NextResponse.json(
        { success: false, error: "세션 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    if (countOnly) {
      return NextResponse.json({
        success: true,
        count: count || 0,
      });
    }

    // 모든 세션 목록 반환
    const sessionList = (sessions || []).map((session) => ({
      sessionId: session.session_id,
      createdAt: session.created_at,
      lastAccessedAt: session.last_accessed_at,
    }));

    return NextResponse.json({
      success: true,
      count: sessions?.length || 0,
      sessions: sessionList,
    });
  } catch (error) {
    console.error("세션 조회 오류:", error);
    return NextResponse.json(
      { success: false, error: "세션 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}

