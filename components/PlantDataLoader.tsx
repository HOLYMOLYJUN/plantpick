"use client";

import { useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getOrCreateSessionId, getSessionId, getSessionIdFromUrl } from "@/lib/session";
import { registerSession, fetchPlant } from "@/lib/api";
import { usePlantStore } from "@/stores/plant-store";
import type { PlantType, CareType } from "@/types/plant";

/**
 * 전역 식물 데이터 로더
 * 앱 초기화 시 세션 등록 및 식물 데이터 로드
 */
export function PlantDataLoader() {
  const { addPlant, setSelectedPlant, updatePlant, getCurrentPlant } = usePlantStore();

  // 세션 ID 결정
  const sessionId = useMemo(() => {
    // 1순위: localStorage에 저장된 기존 세션 ID 사용
    let id = getSessionId();
    
    // 2순위: URL 파라미터에서 sessionId 확인 (QR 코드로 접속한 경우)
    const urlSessionId = getSessionIdFromUrl();
    if (urlSessionId) {
      id = urlSessionId;
      // URL의 sessionId를 localStorage에 저장하여 다음 방문 시 재사용
      localStorage.setItem("plantpick-session-id", id);
    }
    
    // 3순위: 없으면 새로 생성
    if (!id) {
      id = getOrCreateSessionId();
    }

    return id;
  }, []);

  // 세션 등록 mutation
  const sessionMutation = useMutation({
    mutationFn: registerSession,
  });

  // 식물 데이터 조회 query (세션 등록 성공 후)
  const { data: plantData } = useQuery({
    queryKey: ["plant", sessionId],
    queryFn: () => fetchPlant(sessionId),
    enabled: !!sessionId && sessionMutation.isSuccess,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });

  useEffect(() => {
    // 세션 등록
    if (sessionId) {
      sessionMutation.mutate(sessionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  useEffect(() => {
    // 식물 데이터가 로드되면 스토어에 저장 또는 업데이트
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
      
      // 이미 같은 ID의 식물이 있으면 업데이트, 없으면 추가
      const existingPlant = getCurrentPlant();
      if (existingPlant && existingPlant.id === plant.id) {
        updatePlant(plant.id, plant);
      } else {
        addPlant(plant);
      }
    }
  }, [plantData, addPlant, setSelectedPlant, updatePlant, getCurrentPlant]);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
}

