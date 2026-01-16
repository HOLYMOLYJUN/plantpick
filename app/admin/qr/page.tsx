"use client";

import { useEffect, useState } from "react";
import { QRCode } from "@/components/QRCode";
import { motion } from "framer-motion";

export default function AdminQRPage() {
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    // 기본 URL 가져오기 (환경변수 또는 현재 도메인)
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
    setQrUrl(baseUrl);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            QR 코드
          </h1>
          <p className="text-gray-600">
            하나의 QR 코드로 모든 사용자가 접속할 수 있습니다.
            접속 시 자동으로 세션 ID가 생성됩니다.
          </p>
        </motion.div>

        {/* QR 코드 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-8 print:shadow-none"
        >
          <div className="flex flex-col items-center">
            {qrUrl && (
              <>
                <QRCode value={qrUrl} size={300} className="mb-6" />
                <div className="text-center w-full">
                  <p className="text-sm text-gray-500 mb-2">접속 URL</p>
                  <p className="text-sm font-mono text-gray-700 break-all mb-6">
                    {qrUrl}
                  </p>
                  <button
                    onClick={handlePrint}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors print:hidden"
                  >
                    인쇄
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>


        {/* 안내 문구 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            사용 방법
          </h2>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 이 QR 코드를 인쇄하여 현장에 배치하세요</li>
            <li>• 사용자가 QR 코드를 스캔하면 자동으로 세션 ID가 생성됩니다</li>
            <li>• 모든 사용자가 동일한 QR 코드를 사용할 수 있습니다</li>
            <li>• 통계는 <a href="/admin/stats" className="underline text-blue-600 hover:text-blue-800">통계 페이지</a>에서 확인할 수 있습니다</li>
          </ul>
        </motion.div>
      </div>

      {/* 인쇄용 스타일 */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          @page {
            margin: 2cm;
            size: A4;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </main>
  );
}

