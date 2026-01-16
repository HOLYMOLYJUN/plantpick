"use client";

/**
 * 세션 ID 관리 유틸리티
 */

const SESSION_STORAGE_KEY = "plantpick-session-id";

/**
 * 세션 ID 가져오기 (없으면 생성)
 */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    // SSR 환경에서는 빈 문자열 반환
    return "";
  }

  // localStorage에서 기존 세션 ID 확인
  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);

  // 없으면 새로 생성
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }

  return sessionId;
}

/**
 * 현재 세션 ID 가져오기
 */
export function getSessionId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(SESSION_STORAGE_KEY);
}

/**
 * 세션 ID 초기화
 */
export function clearSessionId(): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

/**
 * URL 파라미터에서 sessionId 추출 (있는 경우)
 */
export function getSessionIdFromUrl(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const params = new URLSearchParams(window.location.search);
  return params.get("sessionId");
}

