"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Branch = "browse" | "match" | "create";

type FunnelState = {
  branch: Branch | null;
  selections: string[];
  setBranch: (branch: Branch) => void;
  addSelection: (selection: string) => void;
  reset: () => void;
};

export const useFunnelStore = create<FunnelState>()(
  persist(
    (set) => ({
      branch: null,
      selections: [],
      setBranch: (branch) => set({ branch }),
      addSelection: (selection) =>
        set((state) => ({
          selections: [...new Set([...state.selections, selection])],
        })),
      reset: () => set({ branch: null, selections: [] }),
    }),
    {
      name: "ai-companion:funnel",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
