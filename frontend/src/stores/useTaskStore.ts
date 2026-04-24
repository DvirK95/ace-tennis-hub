import { create } from 'zustand';
import { format, addDays } from 'date-fns';
import type { UserTask } from '@/types/schemas';

function d(offset: number) {
  return format(addDays(new Date(), offset), 'yyyy-MM-dd');
}

const SEED: UserTask[] = [
  // יוסי אברהם
  {
    id: 'tk100000-0000-0000-0000-000000000001',
    userId: 't1000000-0000-0000-0000-000000000001',
    creatorId: '00000000-0000-0000-0000-000000000001',
    assigneeId: 'co100000-0000-0000-0000-000000000001',
    taskText: 'הגשת אישור רפואי',
    startDate: d(-20),
    endDate: d(-5),
    isComplete: false,
  },
  {
    id: 'tk100000-0000-0000-0000-000000000002',
    userId: 't1000000-0000-0000-0000-000000000001',
    creatorId: '00000000-0000-0000-0000-000000000001',
    taskText: 'רכישת מחבט ווילסון ירוק',
    startDate: d(-3),
    endDate: d(7),
    isComplete: false,
  },
  // מיכל דוד
  {
    id: 'tk100000-0000-0000-0000-000000000003',
    userId: 't1000000-0000-0000-0000-000000000002',
    creatorId: '00000000-0000-0000-0000-000000000001',
    assigneeId: '00000000-0000-0000-0000-000000000002',
    taskText: 'חידוש מנוי חודשי',
    startDate: d(-10),
    endDate: d(3),
    isComplete: false,
  },
  {
    id: 'tk100000-0000-0000-0000-000000000004',
    userId: 't1000000-0000-0000-0000-000000000002',
    creatorId: '00000000-0000-0000-0000-000000000002',
    taskText: 'תשלום עבור רכישת אוברגריפ',
    startDate: d(-2),
    endDate: d(5),
    isComplete: false,
  },
  // רון בן-דוד
  {
    id: 'tk100000-0000-0000-0000-000000000005',
    userId: 't1000000-0000-0000-0000-000000000003',
    creatorId: 'co100000-0000-0000-0000-000000000002',
    taskText: 'הזמנת קופסת כדורים (Wilson)',
    startDate: d(0),
    endDate: d(10),
    isComplete: false,
  },
  // שירה מזרחי
  {
    id: 'tk100000-0000-0000-0000-000000000006',
    userId: 't1000000-0000-0000-0000-000000000004',
    creatorId: '00000000-0000-0000-0000-000000000001',
    assigneeId: 'co100000-0000-0000-0000-000000000001',
    taskText: 'שיזור גידים — ווילסון ירוק',
    startDate: d(-1),
    endDate: d(6),
    isComplete: false,
  },
  {
    id: 'tk100000-0000-0000-0000-000000000007',
    userId: 't1000000-0000-0000-0000-000000000004',
    creatorId: '00000000-0000-0000-0000-000000000002',
    taskText: 'הכנת ציוד לאליפות',
    startDate: d(2),
    endDate: d(14),
    isComplete: false,
  },
  // דני פרידמן
  {
    id: 'tk100000-0000-0000-0000-000000000008',
    userId: 't1000000-0000-0000-0000-000000000005',
    creatorId: '00000000-0000-0000-0000-000000000002',
    assigneeId: '00000000-0000-0000-0000-000000000002',
    taskText: 'גביית חוב עבור שיעורים',
    startDate: d(-15),
    endDate: d(-1),
    isComplete: false,
  },
  // גיל לוי (מאמן)
  {
    id: 'tk100000-0000-0000-0000-000000000009',
    userId: 'co100000-0000-0000-0000-000000000001',
    creatorId: '00000000-0000-0000-0000-000000000001',
    taskText: 'הכנת תוכנית אימון קיץ',
    startDate: d(0),
    endDate: d(15),
    isComplete: false,
  },
  {
    id: 'tk100000-0000-0000-0000-000000000010',
    userId: 'co100000-0000-0000-0000-000000000001',
    creatorId: '00000000-0000-0000-0000-000000000001',
    taskText: 'דוח נוכחות חודשי',
    startDate: d(-5),
    endDate: d(2),
    isComplete: true,
  },
  // נועה כהן (מאמנת)
  {
    id: 'tk100000-0000-0000-0000-000000000011',
    userId: 'co100000-0000-0000-0000-000000000002',
    creatorId: '00000000-0000-0000-0000-000000000001',
    taskText: 'הגשת תוכנית אימון ג׳וניורים',
    startDate: d(-7),
    endDate: d(7),
    isComplete: false,
  },
  // אורן גולן
  {
    id: 'tk100000-0000-0000-0000-000000000012',
    userId: 't1000000-0000-0000-0000-000000000006',
    creatorId: '00000000-0000-0000-0000-000000000002',
    taskText: 'הרשמה לשיעורי בסיס',
    startDate: d(0),
    endDate: d(5),
    isComplete: false,
  },
  // לירון רוזן
  {
    id: 'tk100000-0000-0000-0000-000000000013',
    userId: 't1000000-0000-0000-0000-000000000007',
    creatorId: 'co100000-0000-0000-0000-000000000003',
    assigneeId: 'co100000-0000-0000-0000-000000000003',
    taskText: 'הכנה לאליפות ארצית — שיזור מחבט',
    startDate: d(-2),
    endDate: d(10),
    isComplete: false,
  },
  // עמית שפירא (מאמן)
  {
    id: 'tk100000-0000-0000-0000-000000000014',
    userId: 'co100000-0000-0000-0000-000000000003',
    creatorId: '00000000-0000-0000-0000-000000000001',
    taskText: 'עדכון לוח אימונים שבועי',
    startDate: d(-3),
    endDate: d(4),
    isComplete: false,
  },
  // מאיה ברק
  {
    id: 'tk100000-0000-0000-0000-000000000015',
    userId: 't1000000-0000-0000-0000-000000000012',
    creatorId: 'co100000-0000-0000-0000-000000000002',
    taskText: 'מעבר לקבוצת מתקדמים — שיחת הערכה',
    startDate: d(1),
    endDate: d(14),
    isComplete: false,
  },
];

interface TaskState {
  tasks: UserTask[];
  addTask: (t: UserTask) => void;
  updateTask: (id: string, data: Partial<UserTask>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
}

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
