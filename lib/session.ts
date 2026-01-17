"use client";

/**
 * 세션 ID 관리 유틸리티
 * 쿠키를 사용하여 세션 ID 저장 (30일 만료)
 */

const SESSION_COOKIE_KEY = "plantpick-session-id";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30일 (초 단위)

/**
 * 쿠키 읽기 헬퍼
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

  return null;
}

/**
 * 쿠키 저장 헬퍼
 */
function setCookie(name: string, value: string, maxAge: number): void {
  if (typeof document === "undefined") {
    return;
  }

  const expires = new Date();
  expires.setTime(expires.getTime() + maxAge * 1000);

  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * 쿠키 삭제 헬퍼
 */
function deleteCookie(name: string): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * 세션 ID 가져오기 (없으면 생성 후 저장)
 */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    // SSR 환경에서는 빈 문자열 반환
    return "";
  }

  // 쿠키에서 기존 세션 ID 확인
  let sessionId = getCookie(SESSION_COOKIE_KEY);

  // 없으면 새로 생성하고 쿠키에 저장
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    setCookie(SESSION_COOKIE_KEY, sessionId, COOKIE_MAX_AGE);
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

  return getCookie(SESSION_COOKIE_KEY);
}

/**
 * 세션 ID 저장
 */
export function setSessionId(sessionId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  setCookie(SESSION_COOKIE_KEY, sessionId, COOKIE_MAX_AGE);
}

/**
 * 세션 ID 초기화
 */
export function clearSessionId(): void {
  if (typeof window === "undefined") {
    return;
  }

  deleteCookie(SESSION_COOKIE_KEY);
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

