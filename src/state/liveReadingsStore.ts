import { create } from "zustand";
import type { Reading } from "../types";

type Store = {
  readingsByPlantId: Record<string, (Reading & { ts: number }) | undefined>;

  setReading: (plantId: string, reading: Reading & { ts: number }) => void;

  clearReading: (plantId: string) => void;

  /** Remove readings for all plants EXCEPT this one */
  clearOtherReadings: (activePlantId: string) => void;
};

export const useLiveReadingsStore = create<Store>((set) => ({
  readingsByPlantId: {},

  setReading: (plantId, reading) =>
    set((state) => ({
      readingsByPlantId: {
        ...state.readingsByPlantId,
        [plantId]: reading,
      },
    })),

  clearReading: (plantId) =>
    set((state) => {
      const next = { ...state.readingsByPlantId };
      delete next[plantId];
      return { readingsByPlantId: next };
    }),

  clearOtherReadings: (keepPlantId) =>
    set((state) => {
      const filtered: Record<string, any> = {};
      if (state.readingsByPlantId[keepPlantId]) {
        filtered[keepPlantId] = state.readingsByPlantId[keepPlantId];
      }
      return { readingsByPlantId: filtered };
    }),
}));
