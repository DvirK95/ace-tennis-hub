import { create } from "zustand";
import type { ClubUser } from "@/types/schemas";

interface PersonState {
  people: ClubUser[];
  addPerson: (p: ClubUser) => void;
  updatePerson: (id: string, data: Partial<ClubUser>) => void;
  deletePerson: (id: string) => void;
  incrementMakeupCredits: (id: string) => void;
  decrementMakeupCredits: (id: string) => void;
}

const SEED: ClubUser[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Club Admin",
    email: "admin@aceclub.com",
    phone: "+1-555-0100",
    roles: ["ADMIN"],
    membershipStartDate: "2020-01-01",
    makeupCredits: 0,
    notes: "Primary administrator",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Front Desk",
    email: "desk@aceclub.com",
    phone: "+1-555-0110",
    roles: ["ADMIN"],
    membershipStartDate: "2021-03-15",
    makeupCredits: 0,
  },
  {
    id: "co100000-0000-0000-0000-000000000001",
    name: "Rafael Duarte",
    email: "rafael@aceclub.com",
    phone: "+1-555-0201",
    roles: ["COACH"],
    specializations: "Serve & Volley, Singles Strategy",
    hourlyRate: 85,
    membershipStartDate: "2019-06-01",
    makeupCredits: 0,
  },
  {
    id: "co100000-0000-0000-0000-000000000002",
    name: "Yuki Tanaka",
    email: "yuki@aceclub.com",
    phone: "+1-555-0202",
    roles: ["COACH"],
    specializations: "Junior Development, Footwork",
    hourlyRate: 70,
    membershipStartDate: "2020-09-01",
    makeupCredits: 0,
  },
  {
    id: "t1000000-0000-0000-0000-000000000001",
    name: "Sophia Martinez",
    email: "sophia@email.com",
    phone: "+1-555-0101",
    birthdate: "2001-04-12",
    roles: ["TRAINEE"],
    membershipStartDate: "2023-01-15",
    membershipEndDate: "2026-01-15",
    makeupCredits: 2,
  },
  {
    id: "t1000000-0000-0000-0000-000000000002",
    name: "Liam Chen",
    email: "liam@email.com",
    phone: "+1-555-0102",
    birthdate: "1998-09-23",
    roles: ["TRAINEE"],
    membershipStartDate: "2022-06-01",
    makeupCredits: 0,
  },
  {
    id: "t1000000-0000-0000-0000-000000000003",
    name: "Amara Okafor",
    email: "amara@email.com",
    phone: "+1-555-0103",
    birthdate: "2005-01-15",
    roles: ["TRAINEE"],
    membershipStartDate: "2024-03-01",
    membershipEndDate: "2025-03-01",
    makeupCredits: 1,
    notes: "Beginner level, prefers morning sessions",
  },
];

export const usePersonStore = create<PersonState>((set) => ({
  people: SEED,
  addPerson: (p) => set((s) => ({ people: [...s.people, p] })),
  updatePerson: (id, data) =>
    set((s) => ({ people: s.people.map((p) => (p.id === id ? { ...p, ...data } : p)) })),
  deletePerson: (id) => set((s) => ({ people: s.people.filter((p) => p.id !== id) })),
  incrementMakeupCredits: (id) =>
    set((s) => ({
      people: s.people.map((p) =>
        p.id === id ? { ...p, makeupCredits: p.makeupCredits + 1 } : p
      ),
    })),
  decrementMakeupCredits: (id) =>
    set((s) => ({
      people: s.people.map((p) =>
        p.id === id ? { ...p, makeupCredits: Math.max(0, p.makeupCredits - 1) } : p
      ),
    })),
}));
