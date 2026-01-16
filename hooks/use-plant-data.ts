"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePlantStore } from "@/stores/plant-store";
import { getSessionId } from "@/lib/session";
import { fetchPlant } from "@/lib/api";
import type { PlantType, CareType } from "@/types/plant";

/**
 * 전역 식물 데이터 로드 훅
 * 앱 전체에서 한 번만 로드하고 스토어에 저장
 */
export function usePlantData() {
  const { addPlant, setSelectedPlant } = usePlantStore();
  const queryClient = useQueryClient();
  const sessionId = getSessionId();

  // 세션 등록 상태 확인
  const sessionMutation = queryClient.getMutationCache().find({
    mutationKey: undefined,
    status: "success",
  });

  // 식물 데이터 조회 query
  const { data: plantData, isLoading, error } = useQuery({
    queryKey: ["plant", sessionId],
    queryFn: () => fetchPlant(sessionId!),
    enabled: !!sessionId,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });

  useEffect(() => {
    // 식물 데이터가 로드되면 스토어에 저장
    if (plantData?.plant) {
      const plant = {
        id: plantData.plant.id,
        type: plantData.plant.type as PlantType,
        name: plantData.plant.name,
        createdAt: new Date(plantData.plant.createdAt),
        lastCaredAt: plantData.plant.lastCaredAt
          ? new Date(plantData.plant.lastCaredAt)
          : null,
        careHistory: plantData.plant.careHistory.map((record) => ({
          type: record.type as CareType,
          timestamp: new Date(record.timestamp),
        })),
        isMature: plantData.plant.isMature,
        isExchanged: plantData.plant.isExchanged,
      };
      setSelectedPlant(plant.type);
      addPlant(plant);
    }
  }, [plantData, addPlant, setSelectedPlant]);

  return { isLoading, error, hasPlant: !!plantData?.plant };
}

