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
import { motion, AnimatePresence } from "framer-motion";

export default function GrowPage() {
  const router = useRouter();
  const { selectedPlant, getCurrentPlant } = usePlantStore();
  const [isMounted, setIsMounted] = useState(false);
  const [showManagePanel, setShowManagePanel] = useState(false);

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
      <main className="flex h-[100dvh] items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-[100dvh] relative bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
      <div className="h-full flex flex-col items-center justify-center p-4">
        {/* 식물 정보 - 중앙 배치 */}
        <div className="text-center mb-8">
          <PlantEmoji plant={plant} size="large" />
          <h2 className="text-2xl text-gray-800 font-bold mb-2">{plantConfig?.displayName || plant.name}</h2>
          <p className="text-gray-600 text-sm mb-6">
            {plant.isExchanged
              ? "🎉 교환이 완료되었습니다!"
              : plant.isMature
                ? "✨ 성체가 되었습니다! 교환할 수 있습니다."
                : "열심히 키워주세요!"}
          </p>

          {/* 케어 진행도 */}
          <div className="max-w-md mx-auto">
            <CareProgress plant={plant} />
          </div>
        </div>

        {/* 교환 완료 메시지 - 식물 위에 표시 */}
        {plant.isExchanged && (
          <div className="mt-4 max-w-md mx-auto p-6 bg-green-50 border-2 border-green-300 rounded-xl text-center">
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

      {/* 플로팅 관리 버튼 - 하단 고정 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pointer-events-none">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-3 pointer-events-auto">
          {/* 관리 패널 토글 버튼 - 성체가 아니고 교환 안됨일 때만 표시 */}
          {!plant.isExchanged && !plant.isMature && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowManagePanel(!showManagePanel)}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-colors flex items-center gap-2"
            >
              <span className="text-xl">{showManagePanel ? "✕" : "🌿"}</span>
              <span>{showManagePanel ? "닫기" : "식물 돌보기"}</span>
            </motion.button>
          )}

          {/* 관리 패널 - 애니메이션과 함께 표시/숨김 */}
          <AnimatePresence>
            {showManagePanel && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="w-full bg-white rounded-t-2xl p-4 pb-6"
              >
                {/* 케어 버튼 */}
                {!plant.isExchanged && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                      케어하기
                    </h3>
                    <CareButtons
                      plantId={plant.id}
                      onCareAdded={() => setShowManagePanel(false)}
                    />
                  </div>
                )}

                {/* 교환 버튼 - 성체이고 아직 교환하지 않은 경우에만 표시 */}
                {plant.isMature && !plant.isExchanged && (
                  <ExchangeButton plantId={plant.id} />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 교환 버튼만 별도로 표시 (성체이고 교환 안됨) */}
          {plant.isMature && !plant.isExchanged && !showManagePanel && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <ExchangeButton plantId={plant.id} />
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
