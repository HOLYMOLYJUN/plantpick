"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface SessionStats {
  count: number;
  sessions?: Array<{
    sessionId: string;
    createdAt: string;
    lastAccessedAt?: string;
  }>;
}

interface PlantStats {
  count: number;
  typeStats?: {
    sunflower?: number;
    azalea?: number;
    rose?: number;
    tulip?: number;
  };
  matureCount?: number;
  exchangedCount?: number;
}

// 세션 통계 fetch 함수
const fetchSessionStats = async (): Promise<SessionStats> => {
  const response = await fetch("/api/sessions");
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "세션 통계 로드 실패");
  }
  return data;
};

// 식물 통계 fetch 함수
const fetchPlantStats = async (): Promise<PlantStats> => {
  const response = await fetch("/api/plants?stats=true");
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "식물 통계 로드 실패");
  }
  return data;
};

export default function AdminStatsPage() {
  const [showDetails, setShowDetails] = useState(false);
  const queryClient = useQueryClient();

  // 세션 통계 쿼리
  const {
    data: sessionStats,
    isLoading: isLoadingSessions,
    error: sessionError,
  } = useQuery({
    queryKey: ["sessionStats"],
    queryFn: fetchSessionStats,
    refetchInterval: 30000, // 30초마다 자동 새로고침
  });

  // 식물 통계 쿼리
  const {
    data: plantStats,
    isLoading: isLoadingPlants,
    error: plantError,
  } = useQuery({
    queryKey: ["plantStats"],
    queryFn: fetchPlantStats,
    refetchInterval: 30000, // 30초마다 자동 새로고침
  });

  const isLoading = isLoadingSessions || isLoadingPlants;

  // 수동 새로고침 함수
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["sessionStats"] });
    queryClient.invalidateQueries({ queryKey: ["plantStats"] });
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            통계 대시보드
          </h1>
          <p className="text-gray-600">
            세션 및 식물 선택 현황을 확인할 수 있습니다.
          </p>
        </motion.div>

        {/* 통계 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 세션 통계 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                세션 통계
              </h2>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
              >
                {isLoading ? "새로고침 중..." : "새로고침"}
              </button>
            </div>

            {sessionError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                세션 통계를 불러오는 중 오류가 발생했습니다.
              </div>
            )}
            {sessionStats && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-700 mb-1">발급된 세션 수</p>
                      <p className="text-3xl font-bold text-green-900">
                        {sessionStats.count.toLocaleString()}개
                      </p>
                    </div>
                    <div className="text-4xl">📊</div>
                  </div>
                </div>

                {sessionStats.sessions && sessionStats.sessions.length > 0 && (
                  <div>
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium mb-2"
                    >
                      {showDetails ? "상세 목록 숨기기" : "상세 목록 보기"} ↓
                    </button>

                    {showDetails && (
                      <div className="mt-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                세션 ID
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                생성일시
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                최종 접속
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {sessionStats.sessions.map((session) => (
                              <tr key={session.sessionId} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-mono text-xs text-gray-700">
                                  {session.sessionId.slice(0, 8)}...
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                  {new Date(session.createdAt).toLocaleString("ko-KR")}
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                  {session.lastAccessedAt
                                    ? new Date(session.lastAccessedAt).toLocaleString("ko-KR")
                                    : "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* 식물 통계 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              식물 통계
            </h2>

            {plantError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                식물 통계를 불러오는 중 오류가 발생했습니다.
              </div>
            )}
            {plantStats && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-700 mb-1">선택된 식물 수</p>
                      <p className="text-3xl font-bold text-blue-900">
                        {plantStats.count.toLocaleString()}개
                      </p>
                    </div>
                    <div className="text-4xl">🌱</div>
                  </div>
                </div>

                {/* 성체 및 교환 통계 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-purple-700 mb-1">성체</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {plantStats.matureCount || 0}개
                        </p>
                      </div>
                      <div className="text-2xl">✨</div>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-green-700 mb-1">교환 완료</p>
                        <p className="text-2xl font-bold text-green-900">
                          {plantStats.exchangedCount || 0}개
                        </p>
                      </div>
                      <div className="text-2xl">🌸</div>
                    </div>
                  </div>
                </div>

                {plantStats.typeStats && Object.keys(plantStats.typeStats).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">식물 타입별</p>
                    <div className="space-y-2">
                      {plantStats.typeStats.sunflower && (
                        <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                          <span className="text-sm">🌻 해바라기</span>
                          <span className="text-sm font-semibold">
                            {plantStats.typeStats.sunflower}개
                          </span>
                        </div>
                      )}
                      {plantStats.typeStats.azalea && (
                        <div className="flex items-center justify-between p-2 bg-pink-50 rounded">
                          <span className="text-sm">🌺 진달래</span>
                          <span className="text-sm font-semibold">
                            {plantStats.typeStats.azalea}개
                          </span>
                        </div>
                      )}
                      {plantStats.typeStats.rose && (
                        <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                          <span className="text-sm">🌹 장미</span>
                          <span className="text-sm font-semibold">
                            {plantStats.typeStats.rose}개
                          </span>
                        </div>
                      )}
                      {plantStats.typeStats.tulip && (
                        <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                          <span className="text-sm">🌷 튤립</span>
                          <span className="text-sm font-semibold">
                            {plantStats.typeStats.tulip}개
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}

