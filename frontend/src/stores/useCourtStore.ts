import { create } from 'zustand';
import type { Court } from '@/types/schemas';

interface CourtState {
  courts: Court[];
  addCourt: (court: Court) => void;
  updateCourt: (id: string, data: Partial<Court>) => void;
  deleteCourt: (id: string) => void;
}

const SEED_COURTS: Court[] = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'מגרש מרכזי',
    location: 'בניין ראשי, קומה 1',
    surfaceType: 'Hard',
    status: 'Active',
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    name: 'מגרש 2',
    location: 'חצר מזרחית חיצונית',
    surfaceType: 'Clay',
    status: 'Active',
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    name: 'מגרש 3',
    location: 'חצר מערבית חיצונית',
    surfaceType: 'Grass',
    status: 'Maintenance',
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    name: 'מגרש 4',
    location: 'אולם מקורה',
    surfaceType: 'Hard',
    status: 'Active',
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    name: 'מגרש 5',
    location: 'גג בניין ב׳',
    surfaceType: 'Hard',
    status: 'Active',
  },
  {
    id: 'c1000000-0000-0000-0000-000000000006',
    name: 'מגרש אדמה 6',
    location: 'פינה דרומית',
    surfaceType: 'Clay',
    status: 'Active',
  },
];

export const useCourtStore = create<CourtState>((set) => ({
  courts: SEED_COURTS,
  addCourt: (court) => set((s) => ({ courts: [...s.courts, court] })),
  updateCourt: (id, data) =>
    set((s) => ({ courts: s.courts.map((c) => (c.id === id ? { ...c, ...data } : c)) })),
  deleteCourt: (id) => set((s) => ({ courts: s.courts.filter((c) => c.id !== id) })),
}));
