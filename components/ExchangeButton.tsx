"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { exchangePlant } from "@/lib/api";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Toast } from "@/components/Toast";

interface ExchangeButtonProps {
  plantId: string;
  onExchanged?: () => void;
}

export function ExchangeButton({ plantId, onExchanged }: ExchangeButtonProps) {
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // 교환 mutation
  const exchangeMutation = useMutation({
    mutationFn: exchangePlant,
    onSuccess: () => {
      // 식물 데이터 쿼리 캐시 무효화하여 최신 데이터 가져오기
      queryClient.invalidateQueries({ queryKey: ["plant"] });
      setShowConfirm(false);
      setToast({ message: "🎉 교환이 완료되었습니다!", type: "success" });
      onExchanged?.();
    },
    onError: (error) => {
      setShowConfirm(false);
      setToast({
        message: error instanceof Error
          ? error.message
          : "교환 처리에 실패했습니다. 다시 시도해주세요.",
        type: "error",
      });
    },
  });

  const handleExchange = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    exchangeMutation.mutate({ plantId });
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

      <ConfirmModal
        isOpen={showConfirm}
        title="교환 확인"
        message="정말로 교환하시겠습니까? 교환 후에는 되돌릴 수 없습니다."
        confirmText="교환하기"
        cancelText="취소"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleExchange}
        disabled={exchangeMutation.isPending}
        className="w-full mt-6 py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span className="text-2xl">🌺</span>
        <span>{exchangeMutation.isPending ? "교환 처리 중..." : "실제 꽃과 교환하기"}</span>
      </motion.button>
    </>
  );
}

