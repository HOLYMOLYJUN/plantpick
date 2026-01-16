"use client";

import { useRouter } from "next/navigation";
import { usePlantStore } from "@/stores/plant-store";
import { useEffect, useState } from "react";
import { getSessionId } from "@/lib/session";

export default function GrowPage() {
  const router = useRouter();
  const { selectedPlant, getCurrentPlant, addPlant, setSelectedPlant } =
    usePlantStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 식물 데이터 로드
    const loadPlant = async () => {
      const sessionId = getSessionId();
      if (!sessionId) {
        router.push("/select");
        return;
      }

      try {
        const response = await fetch(`/api/plants?sessionId=${sessionId}`);
        const data = await response.json();

        if (data.success && data.plant) {
          // 서버에서 받은 식물 데이터를 스토어에 저장
          const plant = {
            id: data.plant.id,
            type: data.plant.type,
            name: data.plant.name,
            createdAt: new Date(data.plant.createdAt),
            lastCaredAt: data.plant.lastCaredAt
              ? new Date(data.plant.lastCaredAt)
              : null,
            careHistory: data.plant.careHistory.map((record: any) => ({
              type: record.type,
              timestamp: new Date(record.timestamp),
            })),
            isMature: data.plant.isMature,
            isExchanged: data.plant.isExchanged,
          };
          setSelectedPlant(plant.type);
          addPlant(plant);
        } else {
          // 식물이 없으면 선택 페이지로 리다이렉트
          router.push("/select");
        }
      } catch (error) {
        console.error("식물 데이터 로드 오류:", error);
        router.push("/select");
      } finally {
        setIsLoading(false);
      }
    };

    loadPlant();
  }, [router, addPlant, setSelectedPlant]);

  useEffect(() => {
    // 식물이 선택되지 않은 경우 선택 페이지로 리다이렉트
    if (!isLoading && (!selectedPlant || !getCurrentPlant())) {
      router.push("/select");
    }
  }, [selectedPlant, getCurrentPlant, router, isLoading]);

  const plant = getCurrentPlant();

  if (isLoading || !plant) {
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
