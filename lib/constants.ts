import type { PlantConfig } from "@/types/plant";

export const PLANT_CONFIGS: PlantConfig[] = [
  {
    type: "sunflower",
    name: "sunflower",
    displayName: "해바라기",
    requiredCares: {
      water: 5,
      fertilizer: 3,
      sunlight: 7,
      wind: 2,
    },
    daysToMature: 7,
  },
  {
    type: "azalea",
    name: "azalea",
    displayName: "진달래",
    requiredCares: {
      water: 4,
      fertilizer: 4,
      sunlight: 5,
      wind: 3,
    },
    daysToMature: 7,
  },
  {
    type: "rose",
    name: "rose",
    displayName: "장미",
    requiredCares: {
      water: 6,
      fertilizer: 4,
      sunlight: 6,
      wind: 3,
    },
    daysToMature: 7,
  },
  {
    type: "tulip",
    name: "tulip",
    displayName: "튤립",
    requiredCares: {
      water: 5,
      fertilizer: 3,
      sunlight: 5,
      wind: 4,
    },
    daysToMature: 7,
  },
];

export const CARE_TYPES = [
  { type: "water" as const, label: "물", emoji: "💧" },
  { type: "fertilizer" as const, label: "비료", emoji: "🌱" },
  { type: "sunlight" as const, label: "햇빛", emoji: "☀️" },
  { type: "wind" as const, label: "바람", emoji: "💨" },
] as const;
