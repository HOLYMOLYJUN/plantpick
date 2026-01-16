"use client";

import { useRouter } from "next/navigation";
import { usePlantStore } from "@/stores/plant-store";
import { motion } from "framer-motion";
import type { PlantType } from "@/types/plant";
import type { PlantConfig } from "@/types/plant";

interface PlantSelectClientProps {
  plants: PlantConfig[];
}

export function PlantSelectClient({ plants }: PlantSelectClientProps) {
  const router = useRouter();
  const { setSelectedPlant, addPlant } = usePlantStore();

  const handleSelectPlant = (plantType: PlantType) => {
    const config = plants.find((p) => p.type === plantType);
    if (!config) return;

    // 식물 생성
    const newPlant = {
      id: `${plantType}-${crypto.randomUUID()}`,
      type: plantType,
      name: config.name,
      createdAt: new Date(),
      lastCaredAt: null,
      careHistory: [],
      isMature: false,
      isExchanged: false,
    };

    setSelectedPlant(plantType);
    addPlant(newPlant);

    // 키우기 페이지로 이동
    router.push("/grow");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {plants.map((plant, index) => (
        <motion.button
          key={plant.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSelectPlant(plant.type)}
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-left"
        >
          <div className="text-6xl mb-4 text-center">
            {plant.type === "sunflower" && "🌻"}
            {plant.type === "azalea" && "🌺"}
            {plant.type === "rose" && "🌹"}
            {plant.type === "tulip" && "🌷"}
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            {plant.displayName}
          </h2>
          <div className="text-sm text-gray-500 space-y-1">
            <p>💧 물: {plant.requiredCares.water}회</p>
            <p>🌱 비료: {plant.requiredCares.fertilizer}회</p>
            <p>☀️ 햇빛: {plant.requiredCares.sunlight}회</p>
            <p>💨 바람: {plant.requiredCares.wind}회</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
