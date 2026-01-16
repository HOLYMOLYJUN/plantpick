"use client";

import { useRouter } from "next/navigation";
import { usePlantStore } from "@/stores/plant-store";
import { useEffect, useState } from "react";
import { getSessionId } from "@/lib/session";

export default function GrowPage() {
  const router = useRouter();
  const { selectedPlant, getCurrentPlant } = usePlantStore();
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 마운트 확인 (Hydration 오류 방지)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const sessionId = getSessionId();
    
    // 세션 ID가 없거나 식물이 선택되지 않은 경우 선택 페이지로 리다이렉트
    if (!sessionId || !selectedPlant || !getCurrentPlant()) {
      router.push("/select");
    }
  }, [selectedPlant, getCurrentPlant, router, isMounted]);

  const plant = getCurrentPlant();

  // 서버와 클라이언트 렌더링 일치를 위해 항상 같은 구조 유지
  if (!isMounted || !plant) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          식물 키우기
        </h1>
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="text-8xl mb-4">🌱</div>
          <h2 className="text-2xl font-bold mb-4">{plant.name}</h2>
          <p className="text-gray-600">식물 키우기 기능이 곧 추가됩니다!</p>
        </div>
      </div>
    </main>
  );
}
