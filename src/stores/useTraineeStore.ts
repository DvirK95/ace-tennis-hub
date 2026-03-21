import { create } from "zustand";
import type { Trainee } from "@/types/schemas";

interface TraineeState {
  trainees: Trainee[];
  addTrainee: (t: Trainee) => void;
  updateTrainee: (id: string, data: Partial<Trainee>) => void;
  deleteTrainee: (id: string) => void;
  incrementMakeupCredits: (id: string) => void;
  decrementMakeupCredits: (id: string) => void;
}

const SEED: Trainee[] = [
  { id: "t1000000-0000-0000-0000-000000000001", name: "Sophia Martinez", email: "sophia@email.com", phone: "+1-555-0101", birthdate: "2001-04-12", membershipStatus: "Active", skillLevel: "Intermediate", makeupCredits: 2 },
  { id: "t1000000-0000-0000-0000-000000000002", name: "Liam Chen", email: "liam@email.com", phone: "+1-555-0102", birthdate: "1998-09-23", membershipStatus: "Active", skillLevel: "Advanced", makeupCredits: 0 },
  { id: "t1000000-0000-0000-0000-000000000003", name: "Amara Okafor", email: "amara@email.com", phone: "+1-555-0103", birthdate: "2005-01-15", membershipStatus: "Inactive", skillLevel: "Beginner", makeupCredits: 1 },
];

export const useTraineeStore = create<TraineeState>((set) => ({
  trainees: SEED,
  addTrainee: (t) => set((s) => ({ trainees: [...s.trainees, t] })),
  updateTrainee: (id, data) =>
    set((s) => ({ trainees: s.trainees.map((t) => (t.id === id ? { ...t, ...data } : t)) })),
  deleteTrainee: (id) => set((s) => ({ trainees: s.trainees.filter((t) => t.id !== id) })),
  incrementMakeupCredits: (id) =>
    set((s) => ({
      trainees: s.trainees.map((t) => (t.id === id ? { ...t, makeupCredits: t.makeupCredits + 1 } : t)),
    })),
  decrementMakeupCredits: (id) =>
    set((s) => ({
      trainees: s.trainees.map((t) =>
        t.id === id ? { ...t, makeupCredits: Math.max(0, t.makeupCredits - 1) } : t
      ),
    })),
}));
