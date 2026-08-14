"use client";

import { create } from "zustand";

interface PaletteState {
  open: boolean;
  setOpen: (o: boolean) => void;
}

/** Tiny open-state store, kept separate so the nav can toggle the palette
 *  without importing the palette's heavy search/data dependencies. */
export const usePalette = create<PaletteState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
