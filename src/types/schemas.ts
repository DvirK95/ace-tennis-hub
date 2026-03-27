import { z } from "zod";

// ─── Courts ──────────────────────────────────────────────
export const surfaceTypeSchema = z.enum(["Hard", "Clay", "Grass"]);
export const courtStatusSchema = z.enum(["Active", "Maintenance"]);

export const courtSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Court name is required"),
  location: z.string().min(1, "Location is required"),
  surfaceType: surfaceTypeSchema,
  status: courtStatusSchema,
});

export const courtFormSchema = courtSchema.omit({ id: true });

export type Court = z.infer<typeof courtSchema>;
export type CourtFormValues = z.infer<typeof courtFormSchema>;
export type SurfaceType = z.infer<typeof surfaceTypeSchema>;
export type CourtStatus = z.infer<typeof courtStatusSchema>;

// ─── User Roles ──────────────────────────────────────────
export const userRoleSchema = z.enum(["ADMIN", "COACH", "TRAINEE"]);
export type UserRole = z.infer<typeof userRoleSchema>;
export const USER_ROLES: UserRole[] = ["ADMIN", "COACH", "TRAINEE"];

// ─── Club Users (Unified Entity) ─────────────────────────
export const clubUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  birthdate: z.string().optional(),
  roles: z.array(userRoleSchema).min(1, "At least one role is required"),
  membershipStartDate: z.string().optional(),
  membershipEndDate: z.string().optional(),
  notes: z.string().optional(),
  makeupCredits: z.number().int().min(0).default(0),
  specializations: z.string().optional(),
  hourlyRate: z.number().positive().optional(),
});

export const clubUserFormSchema = clubUserSchema.omit({ id: true, makeupCredits: true });

export type ClubUser = z.infer<typeof clubUserSchema>;
export type ClubUserFormValues = z.infer<typeof clubUserFormSchema>;

// ─── Groups ──────────────────────────────────────────────
export const groupSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Group name is required"),
  coachId: z.string().uuid("Select a coach"),
  memberIds: z.array(z.string().uuid()),
  schedule: z.string().min(1, "Schedule is required"),
  courtId: z.string().uuid("Select a court"),
});

export const groupFormSchema = groupSchema.omit({ id: true });

export type Group = z.infer<typeof groupSchema>;
export type GroupFormValues = z.infer<typeof groupFormSchema>;

// ─── Calendar Events ────────────────────────────────────
export const eventTypeSchema = z.enum(["SESSION", "PRIVATE", "BLOCKOUT"]);
export const recurrenceTypeSchema = z.enum(["NONE", "DAILY", "WEEKLY", "MONTHLY"]);
export const eventStatusSchema = z.enum(["PENDING_APPROVAL", "APPROVED", "REJECTED", "CANCELLED"]);

export const calendarEventSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  eventType: eventTypeSchema,
  courtId: z.string().uuid().optional(),
  allCourts: z.boolean().default(false),
  assigneeId: z.string().uuid().optional(),
  groupId: z.string().uuid().optional(),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  recurrence: recurrenceTypeSchema.default("NONE"),
  status: eventStatusSchema.default("APPROVED"),
});

export const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  eventType: eventTypeSchema,
  courtId: z.string().optional(),
  allCourts: z.boolean().default(false),
  assigneeId: z.string().optional(),
  groupId: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  recurrence: recurrenceTypeSchema.default("NONE"),
});

export type CalendarEvent = z.infer<typeof calendarEventSchema>;
export type EventFormValues = z.infer<typeof eventFormSchema>;
export type EventType = z.infer<typeof eventTypeSchema>;
export type RecurrenceType = z.infer<typeof recurrenceTypeSchema>;
export type EventStatus = z.infer<typeof eventStatusSchema>;

// ─── User Tasks ─────────────────────────────────────────
export const userTaskSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  taskText: z.string().min(1, "Task text is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  isComplete: z.boolean().default(false),
});

export const taskFormSchema = z.object({
  userId: z.string().uuid("Select a user"),
  taskText: z.string().min(1, "Task text is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

export type UserTask = z.infer<typeof userTaskSchema>;
export type TaskFormValues = z.infer<typeof taskFormSchema>;

// ─── Attendance ──────────────────────────────────────────
export const attendanceStatusSchema = z.enum(["Present", "Absent", "Cancelled_Eligible"]);

export const attendanceRecordSchema = z.object({
  id: z.string().uuid(),
  groupId: z.string().uuid(),
  sessionDate: z.string(),
  userId: z.string().uuid(),
  status: attendanceStatusSchema,
});

export type AttendanceRecord = z.infer<typeof attendanceRecordSchema>;
export type AttendanceStatus = z.infer<typeof attendanceStatusSchema>;
