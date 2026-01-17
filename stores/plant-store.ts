"use client";

import { create } from "zustand";
import type { Plant, PlantType } from "@/types/plant";

interface PlantState {
  selectedPlant: PlantType | null;
  plants: Plant[];
  setSelectedPlant: (plantType: PlantType) => void;
  addPlant: (plant: Plant) => void;
  updatePlant: (plantId: string, updates: Partial<Plant>) => void;
  getCurrentPlant: () => Plant | null;
  reset: () => void;
}

const initialState = {
  selectedPlant: null,
  plants: [],
};

// Supabase에서 데이터를 가져오므로 localStorage persist 제거
export const usePlantStore = create<PlantState>((set, get) => ({
  ...initialState,
  setSelectedPlant: (plantType) => set({ selectedPlant: plantType }),
  addPlant: (plant) =>
    set((state) => ({
      plants: [...state.plants, plant],
    })),
  updatePlant: (plantId, updates) =>
    set((state) => ({
      plants: state.plants.map((plant) =>
        plant.id === plantId ? { ...plant, ...updates } : plant
      ),
    })),
  getCurrentPlant: () => {
    const state = get();
    if (!state.selectedPlant) return null;
    return (
      state.plants.find((p) => p.type === state.selectedPlant) || null
    );
  },
  reset: () => set(initialState),
}));
