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

// 케어 기록 추가
export interface AddCareParams {
  plantId: string;
  type: "water" | "fertilizer" | "sunlight" | "wind";
}

export const addCare = async (params: AddCareParams): Promise<{ careRecord: { type: string; timestamp: string }; becameMature?: boolean }> => {
  const response = await fetch(`/api/plants/${params.plantId}/care`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: params.type }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "케어 기록 추가에 실패했습니다.");
  }
  return { careRecord: data.careRecord, becameMature: data.becameMature };
};

// 식물 교환
export interface ExchangePlantParams {
  plantId: string;
}

export const exchangePlant = async (params: ExchangePlantParams): Promise<{ exchangedAt: string }> => {
  const response = await fetch(`/api/plants/${params.plantId}/exchange`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "교환 처리에 실패했습니다.");
  }
  return { exchangedAt: data.exchangedAt };
};

