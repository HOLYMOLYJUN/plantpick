"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlantStore } from "@/stores/plant-store";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PlantType, CareType } from "@/types/plant";
import type { PlantConfig } from "@/types/plant";
import { getSessionId } from "@/lib/session";
import { createPlant } from "@/lib/api";

interface PlantSelectClientProps {
  plants: PlantConfig[];
}

export function PlantSelectClient({ plants }: PlantSelectClientProps) {
  const router = useRouter();
  const { setSelectedPlant, addPlant, getCurrentPlant } = usePlantStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    // 이미 식물이 선택되어 있으면 키우기 페이지로 리다이렉트
    if (getCurrentPlant()) {
      router.push("/grow");
    }
  }, [getCurrentPlant, router]);

  // 식물 생성 mutation
  const createPlantMutation = useMutation({
    mutationFn: createPlant,
    onSuccess: (data) => {
      // 서버에서 받은 식물 데이터를 스토어에 저장
      const newPlant = {
        id: data.plant.id,
        type: data.plant.type as PlantType,
        name: data.plant.name,
        createdAt: new Date(data.plant.createdAt),
        lastCaredAt: data.plant.lastCaredAt
          ? new Date(data.plant.lastCaredAt)
          : null,
        careHistory: data.plant.careHistory.map((record) => ({
          type: record.type as CareType,
          timestamp: new Date(record.timestamp),
        })),
        isMature: data.plant.isMature,
        isExchanged: data.plant.isExchanged,
      };

      setSelectedPlant(newPlant.type);
      addPlant(newPlant);

      // 식물 쿼리 캐시 무효화
      const sessionId = getSessionId();
      if (sessionId) {
        queryClient.invalidateQueries({ queryKey: ["plant", sessionId] });
      }

      // 키우기 페이지로 이동
      router.push("/grow");
    },
    onError: (error) => {
      console.error("식물 생성 오류:", error);
      alert(
        error instanceof Error
          ? error.message
          : "식물 생성에 실패했습니다. 다시 시도해주세요."
      );
    },
  });

  const handleSelectPlant = (plantType: PlantType) => {
    const config = plants.find((p) => p.type === plantType);
    if (!config) return;

    const sessionId = getSessionId();
    if (!sessionId) {
      alert("세션 ID를 찾을 수 없습니다. 페이지를 새로고침해주세요.");
      return;
    }

    createPlantMutation.mutate({
      sessionId,
      type: plantType,
      name: config.name,
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {plants.map((plant, index) => (
        <motion.button
          key={plant.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSelectPlant(plant.type)}
          disabled={createPlantMutation.isPending}
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-6xl mb-4 text-center">
            {plant.type === "sunflower" && "🌻"}
            {plant.type === "azalea" && "🌺"}
            {plant.type === "rose" && "🌹"}
            {plant.type === "tulip" && "🌷"}
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            {plant.displayName}
          </h2>
          <div className="text-sm text-gray-500 space-y-1">
            <p>💧 물: {plant.requiredCares.water}회</p>
            <p>🌱 비료: {plant.requiredCares.fertilizer}회</p>
            <p>☀️ 햇빛: {plant.requiredCares.sunlight}회</p>
            <p>💨 바람: {plant.requiredCares.wind}회</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
