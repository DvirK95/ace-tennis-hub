import { create } from 'zustand';
import type { Group } from '@/types/schemas';

interface GroupState {
  groups: Group[];
  addGroup: (g: Group) => void;
  updateGroup: (id: string, data: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
}

const SEED: Group[] = [
  {
    id: 'g1000000-0000-0000-0000-000000000001',
    name: 'Beginner Mondays',
    coachId: 'co100000-0000-0000-0000-000000000002',
    memberIds: ['t1000000-0000-0000-0000-000000000001', 't1000000-0000-0000-0000-000000000003'],
    schedule: 'Mon & Wed 9:00–10:30',
    courtId: 'c1000000-0000-0000-0000-000000000001',
  },
];

export const useGroupStore = create<GroupState>((set) => ({
  groups: SEED,
  addGroup: (g) => set((s) => ({ groups: [...s.groups, g] })),
  updateGroup: (id, data) =>
    set((s) => ({ groups: s.groups.map((g) => (g.id === id ? { ...g, ...data } : g)) })),
  deleteGroup: (id) => set((s) => ({ groups: s.groups.filter((g) => g.id !== id) })),
}));
