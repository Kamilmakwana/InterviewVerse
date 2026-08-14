"use client";

import { useAppStore } from "@/store/useAppStore";

/** True once the persisted store has rehydrated on the client. */
export function useHydrated(): boolean {
  return useAppStore((s) => s.hydrated);
}
