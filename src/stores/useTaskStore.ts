import { create } from 'zustand';
import type { UserTask } from '@/types/schemas';

interface TaskState {
  tasks: UserTask[];
  addTask: (t: UserTask) => void;
  updateTask: (id: string, data: Partial<UserTask>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
}

const today = new Date().toISOString().split('T')[0];
const pastDate = '2026-03-20';
const futureDate = '2026-04-15';

const SEED: UserTask[] = [
  {
    id: 'tk100000-0000-0000-0000-000000000001',
    userId: 't1000000-0000-0000-0000-000000000001',
    taskText: 'Submit medical clearance form',
    startDate: '2026-03-01',
    endDate: pastDate,
    isComplete: false,
  },
  {
    id: 'tk100000-0000-0000-0000-000000000002',
    userId: 'co100000-0000-0000-0000-000000000001',
    taskText: 'Prepare summer camp schedule',
    startDate: today,
    endDate: futureDate,
    isComplete: false,
  },
  {
    id: 'tk100000-0000-0000-0000-000000000003',
    userId: 't1000000-0000-0000-0000-000000000002',
    taskText: 'Renew membership',
    startDate: '2026-03-10',
    endDate: '2026-03-25',
    isComplete: false,
  },
];

export const useTaskStore = create<TaskState>((set) => ({
  tasks: SEED,
  addTask: (t) => set((s) => ({ tasks: [...s.tasks, t] })),
  updateTask: (id, data) =>
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)) })),
  deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
  toggleComplete: (id) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, isComplete: !t.isComplete } : t)),
    })),
}));
