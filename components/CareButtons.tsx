"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCare } from "@/lib/api";
import { CARE_TYPES } from "@/lib/constants";
import { Toast } from "@/components/Toast";
import type { CareType } from "@/types/plant";

interface CareButtonsProps {
  plantId: string;
  onCareAdded?: () => void;
}

export function CareButtons({ plantId, onCareAdded }: CareButtonsProps) {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // 케어 추가 mutation
  const careMutation = useMutation({
    mutationFn: addCare,
    onSuccess: (data) => {
      // 식물 데이터 쿼리 캐시 무효화하여 최신 데이터 가져오기
      queryClient.invalidateQueries({ queryKey: ["plant"] });

      // 성체가 되었는지 확인
      if (data.becameMature) {
        setToast({ message: "🎉 축하합니다! 식물이 성체가 되었습니다!", type: "success" });
      } else {
        setToast({ message: "케어가 완료되었습니다! 💚", type: "success" });
      }

      onCareAdded?.();
    },
    onError: (error) => {
      setToast({
        message: error instanceof Error ? error.message : "케어 추가에 실패했습니다.",
        type: "error",
      });
    },
  });

  const handleCare = (type: CareType) => {
    careMutation.mutate({ plantId, type });
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {CARE_TYPES.map((careType, index) => (
          <motion.button
            key={careType.type}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCare(careType.type)}
            disabled={careMutation.isPending}
            className="relative flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent hover:border-green-300"
          >
            <motion.div
              className="text-3xl mb-2"
              animate={{
                scale: careMutation.isPending ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.5, repeat: careMutation.isPending ? Infinity : 0 }}
            >
              {careType.emoji}
            </motion.div>
            <div className="text-lg font-semibold text-gray-800">
              {careType.label}
            </div>
            {careMutation.isPending && (
              <div className="text-sm text-gray-500 mt-1">처리 중...</div>
            )}
          </motion.button>
        ))}
      </div>
    </>
  );
}

