import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

// 임시 저장소 (실제로는 Supabase DB 사용 예정)
// TODO: Supabase 연결 후 데이터베이스로 이동
interface Session {
  id: string;
  sessionId: string;
  createdAt: Date;
  lastAccessedAt?: Date;
}

// 개발용 인메모리 저장소 (프로덕션에서는 Supabase 사용)
let sessions: Map<string, Session> = new Map();

/**
 * 세션 ID 생성 및 저장
 */
export async function POST() {
  try {
    const sessionId = randomUUID();
    const now = new Date();

    const session: Session = {
      id: randomUUID(),
      sessionId,
      createdAt: now,
      lastAccessedAt: now,
    };

    sessions.set(sessionId, session);

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
    const existingSession = sessions.get(sessionId);

    if (existingSession) {
      // 마지막 접속 시간만 업데이트
      existingSession.lastAccessedAt = new Date();
      return NextResponse.json({
        success: true,
        sessionId,
        isNew: false,
      });
    }

    // 새 세션 생성
    const session: Session = {
      id: randomUUID(),
      sessionId,
      createdAt: new Date(),
      lastAccessedAt: new Date(),
    };

    sessions.set(sessionId, session);

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

    if (countOnly) {
      return NextResponse.json({
        success: true,
        count: sessions.size,
      });
    }

    // 모든 세션 목록 반환
    const sessionList = Array.from(sessions.values())
      .sort((a, b) => {
        const timeA = a.createdAt.getTime();
        const timeB = b.createdAt.getTime();
        return timeB - timeA; // 최신순 정렬
      })
      .map((session) => ({
        sessionId: session.sessionId,
        createdAt: session.createdAt.toISOString(),
        lastAccessedAt: session.lastAccessedAt?.toISOString(),
      }));

    return NextResponse.json({
      success: true,
      count: sessions.size,
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

