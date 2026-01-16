export type PlantType = "sunflower" | "azalea" | "rose" | "tulip";

export type CareType = "water" | "fertilizer" | "sunlight" | "wind";

export interface Plant {
  id: string;
  type: PlantType;
  name: string;
  createdAt: Date;
  lastCaredAt: Date | null;
  careHistory: CareRecord[];
  isMature: boolean;
  isExchanged: boolean;
}

export interface CareRecord {
  type: CareType;
  timestamp: Date;
}

export interface PlantConfig {
  type: PlantType;
  name: string;
  displayName: string;
  requiredCares: {
    water: number;
    fertilizer: number;
    sunlight: number;
    wind: number;
  };
  daysToMature: number;
}
