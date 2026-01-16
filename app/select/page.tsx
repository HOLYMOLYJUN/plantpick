import { PLANT_CONFIGS } from "@/lib/constants";
import { PlantSelectClient } from "./plant-select-client";

export default function SelectPage() {
  return (
    <main className="min-h-screen p-4 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            식물을 선택해주세요
          </h1>
          <p className="text-lg text-gray-600">
            키우고 싶은 식물을 선택하세요
          </p>
        </div>

        {/* 클라이언트 컴포넌트로 인터랙티브 부분 분리 */}
        <PlantSelectClient plants={PLANT_CONFIGS} />
      </div>
    </main>
  );
}
