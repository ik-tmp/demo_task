"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  BrowsePersonalization,
  CreatePersonalization,
  MatchPersonalization,
  NameMode,
} from "@/types/session";

export type Branch = "browse" | "match" | "create";

type FunnelState = {
  hasHydrated: boolean;
  branch: Branch | null;
  selections: string[];
  displayName: string | null;
  nameMode: NameMode | null;
  helloContext: string | null;
  match: MatchPersonalization | null;
  create: CreatePersonalization | null;
  browse: BrowsePersonalization | null;
  setHasHydrated: (hasHydrated: boolean) => void;
  setBranch: (branch: Branch) => void;
  addSelection: (selection: string) => void;
  setDisplayName: (displayName: string, mode?: NameMode) => void;
  setHelloContext: (helloContext: string) => void;
  setMatchPersonalization: (match: MatchPersonalization) => void;
  setCreatePersonalization: (create: CreatePersonalization) => void;
  setBrowsePersonalization: (browse: BrowsePersonalization) => void;
  reset: () => void;
};

export const useFunnelStore = create<FunnelState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      branch: null,
      selections: [],
      displayName: null,
      nameMode: null,
      helloContext: null,
      match: null,
      create: null,
      browse: null,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setBranch: (branch) => set({ branch }),
      addSelection: (selection) =>
        set((state) => ({
          selections: [...new Set([...state.selections, selection])],
        })),
      setDisplayName: (displayName, mode = "given") =>
        set({ displayName, nameMode: mode }),
      setHelloContext: (helloContext) => set({ helloContext }),
      setMatchPersonalization: (match) => set({ branch: "match", match }),
      setCreatePersonalization: (create) => set({ branch: "create", create }),
      setBrowsePersonalization: (browse) => set({ branch: "browse", browse }),
      reset: () =>
        set({
          branch: null,
          selections: [],
          displayName: null,
          nameMode: null,
          helloContext: null,
          match: null,
          create: null,
          browse: null,
        }),
    }),
    {
      name: "ai-companion:funnel",
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
