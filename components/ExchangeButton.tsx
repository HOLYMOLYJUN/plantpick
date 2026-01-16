"use client";

import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { exchangePlant } from "@/lib/api";

interface ExchangeButtonProps {
  plantId: string;
  onExchanged?: () => void;
}

export function ExchangeButton({ plantId, onExchanged }: ExchangeButtonProps) {
  const queryClient = useQueryClient();

  // 교환 mutation
  const exchangeMutation = useMutation({
    mutationFn: exchangePlant,
    onSuccess: () => {
      // 식물 데이터 쿼리 캐시 무효화하여 최신 데이터 가져오기
      queryClient.invalidateQueries({ queryKey: ["plant"] });
      onExchanged?.();
    },
    onError: (error) => {
      alert(
        error instanceof Error
          ? error.message
          : "교환 처리에 실패했습니다. 다시 시도해주세요."
      );
    },
  });

  const handleExchange = () => {
    if (confirm("정말로 교환하시겠습니까? 교환 후에는 되돌릴 수 없습니다.")) {
      exchangeMutation.mutate({ plantId });
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleExchange}
      disabled={exchangeMutation.isPending}
      className="w-full mt-6 py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      <span className="text-2xl">🌺</span>
      <span>{exchangeMutation.isPending ? "교환 처리 중..." : "실제 꽃과 교환하기"}</span>
    </motion.button>
  );
}

