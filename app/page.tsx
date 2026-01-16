"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlantStore } from "@/stores/plant-store";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();
  const { selectedPlant, getCurrentPlant } = usePlantStore();

  useEffect(() => {
    // 이미 식물을 선택한 경우 키우기 페이지로 리다이렉트
    if (selectedPlant && getCurrentPlant()) {
      router.push("/grow");
    }
  }, [selectedPlant, getCurrentPlant, router]);

  const handleStart = () => {
    router.push("/select");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md w-full"
      >
        {/* 로고/아이콘 영역 */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="text-8xl mb-4">🌱</div>
        </motion.div>

        {/* 타이틀 */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-bold mb-4 text-gray-800"
        >
          PlantPick
        </motion.h1>

        {/* 설명 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 mb-2"
        >
          나만의 식물을 키워보세요!
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-base text-gray-500 mb-8"
        >
          며칠간 정성스럽게 키운 식물을 현장에서 실제 꽃으로 교환할 수 있어요
        </motion.p>

        {/* 시작 버튼 */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-full text-lg shadow-lg transition-colors"
        >
          식물 선택하기
        </motion.button>

        {/* 안내 문구 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm text-gray-400 mt-6"
        >
          QR 코드로 접속하셨나요? 위 버튼을 눌러 시작하세요!
        </motion.p>
      </motion.div>
    </main>
  );
}
