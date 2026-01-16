/**
 * API 함수들 - TanStack Query에서 사용
 */

// 세션 등록
export const registerSession = async (sessionId: string) => {
  const response = await fetch("/api/sessions", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "세션 등록에 실패했습니다.");
  }
  return data;
};

// 식물 조회
export interface PlantData {
  id: string;
  type: string;
  name: string;
  createdAt: string;
  lastCaredAt: string | null;
  isMature: boolean;
  isExchanged: boolean;
  exchangedAt: string | null;
  careHistory: Array<{
    type: string;
    timestamp: string;
  }>;
}

export const fetchPlant = async (sessionId: string): Promise<{ plant: PlantData | null }> => {
  const response = await fetch(`/api/plants?sessionId=${sessionId}`);
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "식물 조회에 실패했습니다.");
  }
  return { plant: data.plant || null };
};

// 식물 생성
export interface CreatePlantParams {
  sessionId: string;
  type: string;
  name: string;
}

export const createPlant = async (params: CreatePlantParams): Promise<{ plant: PlantData }> => {
  const response = await fetch("/api/plants", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "식물 생성에 실패했습니다.");
  }
  return { plant: data.plant };
};

