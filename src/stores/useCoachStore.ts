import { create } from "zustand";
import type { Coach } from "@/types/schemas";

interface CoachState {
  coaches: Coach[];
  addCoach: (c: Coach) => void;
  updateCoach: (id: string, data: Partial<Coach>) => void;
  deleteCoach: (id: string) => void;
}

const SEED: Coach[] = [
  { id: "co100000-0000-0000-0000-000000000001", name: "Rafael Duarte", email: "rafael@aceclub.com", phone: "+1-555-0201", specializations: "Serve & Volley, Singles Strategy", hourlyRate: 85 },
  { id: "co100000-0000-0000-0000-000000000002", name: "Yuki Tanaka", email: "yuki@aceclub.com", phone: "+1-555-0202", specializations: "Junior Development, Footwork", hourlyRate: 70 },
];

export const useCoachStore = create<CoachState>((set) => ({
  coaches: SEED,
  addCoach: (c) => set((s) => ({ coaches: [...s.coaches, c] })),
  updateCoach: (id, data) =>
    set((s) => ({ coaches: s.coaches.map((c) => (c.id === id ? { ...c, ...data } : c)) })),
  deleteCoach: (id) => set((s) => ({ coaches: s.coaches.filter((c) => c.id !== id) })),
}));
