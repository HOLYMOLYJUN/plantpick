"use client";

import { useRouter } from "next/navigation";
import { usePlantStore } from "@/stores/plant-store";
import { useEffect, useState } from "react";
import { getSessionId } from "@/lib/session";
import { CareButtons } from "@/components/CareButtons";
import { CareProgress } from "@/components/CareProgress";
import { ExchangeButton } from "@/components/ExchangeButton";
import { PlantEmoji } from "@/components/PlantEmoji";
import { PLANT_CONFIGS } from "@/lib/constants";

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
  const plantConfig = plant
    ? PLANT_CONFIGS.find((config) => config.type === plant.type)
    : null;

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
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          {/* 식물 정보 */}
          <div className="text-center mb-8">
            <PlantEmoji plant={plant} size="large" />
            <h2 className="text-2xl font-bold mb-2">{plantConfig?.displayName || plant.name}</h2>
            <p className="text-gray-600 text-sm">
              {plant.isExchanged
                ? "🎉 교환이 완료되었습니다!"
                : plant.isMature
                ? "✨ 성체가 되었습니다! 교환할 수 있습니다."
                : "열심히 키워주세요!"}
            </p>
          </div>

          {/* 케어 진행도 */}
          <CareProgress plant={plant} />

          {/* 케어 버튼 - 교환하지 않은 경우에만 표시 */}
          {!plant.isExchanged && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                케어하기
              </h3>
              <CareButtons plantId={plant.id} />
            </div>
          )}

          {/* 교환 버튼 - 성체이고 아직 교환하지 않은 경우에만 표시 */}
          {plant.isMature && !plant.isExchanged && (
            <ExchangeButton plantId={plant.id} />
          )}

          {/* 교환 완료 메시지 */}
          {plant.isExchanged && (
            <div className="mt-8 p-6 bg-green-50 border-2 border-green-300 rounded-xl text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                교환이 완료되었습니다!
              </h3>
              <p className="text-green-600">
                현장에서 실제 꽃을 받으셨나요?
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
