"use client";

import { useEffect, useState } from "react";
import { QRCode } from "@/components/QRCode";
import { motion } from "framer-motion";

interface SessionStats {
  count: number;
  sessions?: Array<{
    sessionId: string;
    createdAt: string;
    lastAccessedAt?: string;
  }>;
}

export default function AdminQRPage() {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // 기본 URL 가져오기 (환경변수 또는 현재 도메인)
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
    setQrUrl(baseUrl);

    // 세션 통계 로드
    loadSessionStats();
  }, []);

  const loadSessionStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/sessions");
      const data = await response.json();
      if (data.success) {
        setSessionStats(data);
      }
    } catch (error) {
      console.error("세션 통계 로드 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* 세션 통계 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              세션 통계
            </h2>
            <button
              onClick={loadSessionStats}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
            >
              {isLoading ? "새로고침 중..." : "새로고침"}
            </button>
          </div>

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
            <li>• 위 통계에서 발급된 세션 ID 개수를 확인할 수 있습니다</li>
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

