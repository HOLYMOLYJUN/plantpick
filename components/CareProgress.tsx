"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Plant, CareType } from "@/types/plant";
import { PLANT_CONFIGS, CARE_TYPES } from "@/lib/constants";

interface CareProgressProps {
  plant: Plant;
}

export function CareProgress({ plant }: CareProgressProps) {
  const plantConfig = PLANT_CONFIGS.find((config) => config.type === plant.type);

  // 각 케어 타입별 완료 횟수 계산
  const careCounts = useMemo(() => {
    const counts: Record<CareType, number> = {
      water: 0,
      fertilizer: 0,
      sunlight: 0,
      wind: 0,
    };

    plant.careHistory.forEach((record) => {
      counts[record.type] = (counts[record.type] || 0) + 1;
    });

    return counts;
  }, [plant.careHistory]);

  if (!plantConfig) return null;

  // 모든 케어 완료 여부 확인
  const allCaresCompleted = Object.entries(careCounts).every(
    ([type, count]) => count >= plantConfig.requiredCares[type as CareType]
  );

  return (
    <div className="space-y-4 mt-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">케어 진행도</h3>
        {allCaresCompleted && !plant.isMature && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full"
          >
            거의 완료! 🎯
          </motion.span>
        )}
        {plant.isMature && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-sm font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full"
          >
            완료! ✨
          </motion.span>
        )}
      </div>
      {CARE_TYPES.map((careType) => {
        const completed = careCounts[careType.type];
        const required = plantConfig.requiredCares[careType.type];
        const percentage = required > 0 ? Math.min((completed / required) * 100, 100) : 0;
        const isCompleted = completed >= required;

        return (
          <div key={careType.type} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{careType.emoji}</span>
                <span className={`text-sm font-medium ${isCompleted ? "text-green-600" : "text-gray-700"}`}>
                  {careType.label}
                </span>
                {isCompleted && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-500"
                  >
                    ✓
                  </motion.span>
                )}
              </div>
              <span className={`text-sm font-medium ${isCompleted ? "text-green-600" : "text-gray-600"}`}>
                {completed} / {required}회
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`h-full rounded-full ${percentage === 100
                  ? "bg-green-500"
                  : percentage >= 50
                    ? "bg-blue-500"
                    : "bg-yellow-500"
                  }`}
              />
              {isCompleted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-green-400 opacity-30"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

