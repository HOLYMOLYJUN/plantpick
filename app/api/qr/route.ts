import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST() {
  try {
    // 세션 ID 생성
    const sessionId = randomUUID();
    
    // 현재 도메인 URL 생성 (환경변수 또는 기본값 사용)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const qrUrl = `${baseUrl}?sessionId=${sessionId}`;
    
    return NextResponse.json({
      success: true,
      sessionId,
      qrUrl,
    });
  } catch (error) {
    console.error("QR 생성 오류:", error);
    return NextResponse.json(
      { success: false, error: "QR 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}

