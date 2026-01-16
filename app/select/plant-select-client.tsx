"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlantStore } from "@/stores/plant-store";
import { motion } from "framer-motion";
import type { PlantType } from "@/types/plant";
import type { PlantConfig } from "@/types/plant";
import { getSessionId } from "@/lib/session";

interface PlantSelectClientProps {
  plants: PlantConfig[];
}

export function PlantSelectClient({ plants }: PlantSelectClientProps) {
  const router = useRouter();
  const { setSelectedPlant, addPlant } = usePlantStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPlant = async (plantType: PlantType) => {
    const config = plants.find((p) => p.type === plantType);
    if (!config) return;

    const sessionId = getSessionId();
    if (!sessionId) {
      alert("세션 ID를 찾을 수 없습니다. 페이지를 새로고침해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // 서버에 식물 생성
      const response = await fetch("/api/plants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          type: plantType,
          name: config.name,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "식물 생성에 실패했습니다.");
      }

      // 서버에서 받은 식물 데이터를 스토어에 저장
      const newPlant = {
        id: data.plant.id,
        type: data.plant.type as PlantType,
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

      setSelectedPlant(plantType);
      addPlant(newPlant);

      // 키우기 페이지로 이동
      router.push("/grow");
    } catch (error) {
      console.error("식물 생성 오류:", error);
      alert(
        error instanceof Error
          ? error.message
          : "식물 생성에 실패했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
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
