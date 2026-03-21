import { create } from "zustand";
import type { Court } from "@/types/schemas";

interface CourtState {
  courts: Court[];
  addCourt: (court: Court) => void;
  updateCourt: (id: string, data: Partial<Court>) => void;
  deleteCourt: (id: string) => void;
}

const SEED_COURTS: Court[] = [
  { id: "c1000000-0000-0000-0000-000000000001", name: "Center Court", location: "Main Building, Floor 1", surfaceType: "Hard", status: "Active" },
  { id: "c1000000-0000-0000-0000-000000000002", name: "Court 2", location: "Outdoor East Wing", surfaceType: "Clay", status: "Active" },
  { id: "c1000000-0000-0000-0000-000000000003", name: "Court 3", location: "Outdoor West Wing", surfaceType: "Grass", status: "Maintenance" },
];

export const useCourtStore = create<CourtState>((set) => ({
  courts: SEED_COURTS,
  addCourt: (court) => set((s) => ({ courts: [...s.courts, court] })),
  updateCourt: (id, data) =>
    set((s) => ({ courts: s.courts.map((c) => (c.id === id ? { ...c, ...data } : c)) })),
  deleteCourt: (id) => set((s) => ({ courts: s.courts.filter((c) => c.id !== id) })),
}));
