"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Plant } from "@/types/plant";
import { PLANT_CONFIGS } from "@/lib/constants";

interface PlantEmojiProps {
  plant: Plant;
  size?: "small" | "medium" | "large";
}

const EMOJI_SIZE = {
  small: "text-6xl",
  medium: "text-8xl",
  large: "text-9xl",
};

/**
 * 식물 상태에 따른 이모지 표시
 * 새싹 → 성장 → 성체 순서로 변경
 */
export function PlantEmoji({ plant, size = "large" }: PlantEmojiProps) {
  const plantConfig = PLANT_CONFIGS.find((config) => config.type === plant.type);
  
  // 케어 진행도 계산
  const totalCareCount = plant.careHistory.length;
  const totalRequired = plantConfig
    ? Object.values(plantConfig.requiredCares).reduce((a, b) => a + b, 0)
    : 0;
  const progressPercentage = totalRequired > 0 ? (totalCareCount / totalRequired) * 100 : 0;

  // 상태별 이모지 결정
  let emoji: string;
  if (plant.isExchanged) {
    // 교환 완료: 꽃다발
    emoji = "🌸";
  } else if (plant.isMature) {
    // 성체: 꽃
    emoji = getMatureEmoji(plant.type);
  } else if (progressPercentage >= 70) {
    // 거의 완료: 큰 새싹
    emoji = "🌿";
  } else if (progressPercentage >= 40) {
    // 중간 진행: 성장 중
    emoji = "🌱";
  } else {
    // 초기: 작은 새싹
    emoji = "🌱";
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${plant.id}-${plant.isMature}-${plant.isExchanged}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`${EMOJI_SIZE[size]} mb-4`}
      >
        {emoji}
      </motion.div>
    </AnimatePresence>
  );
}

function getMatureEmoji(plantType: string): string {
  switch (plantType) {
    case "sunflower":
      return "🌻";
    case "azalea":
      return "🌺";
    case "rose":
      return "🌹";
    case "tulip":
      return "🌷";
    default:
      return "🌺";
  }
}

