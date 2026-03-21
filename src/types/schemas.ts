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

// ─── Trainees ────────────────────────────────────────────
export const skillLevelSchema = z.enum(["Beginner", "Intermediate", "Advanced"]);
export const membershipStatusSchema = z.enum(["Active", "Inactive"]);

export const traineeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  birthdate: z.string().min(1, "Birthdate is required"),
  membershipStatus: membershipStatusSchema,
  skillLevel: skillLevelSchema,
  makeupCredits: z.number().int().min(0),
});

export const traineeFormSchema = traineeSchema.omit({ id: true, makeupCredits: true });

export type Trainee = z.infer<typeof traineeSchema>;
export type TraineeFormValues = z.infer<typeof traineeFormSchema>;

// ─── Coaches ─────────────────────────────────────────────
export const coachSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  specializations: z.string().min(1, "Specializations required"),
  hourlyRate: z.number().positive("Rate must be positive"),
});

export const coachFormSchema = coachSchema.omit({ id: true });

export type Coach = z.infer<typeof coachSchema>;
export type CoachFormValues = z.infer<typeof coachFormSchema>;

// ─── Groups ──────────────────────────────────────────────
export const groupSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Group name is required"),
  coachId: z.string().uuid("Select a coach"),
  traineeIds: z.array(z.string().uuid()),
  schedule: z.string().min(1, "Schedule is required"),
  courtId: z.string().uuid("Select a court"),
});

export const groupFormSchema = groupSchema.omit({ id: true });

export type Group = z.infer<typeof groupSchema>;
export type GroupFormValues = z.infer<typeof groupFormSchema>;

// ─── Bookings ────────────────────────────────────────────
export const bookingStatusSchema = z.enum(["PENDING_APPROVAL", "APPROVED", "REJECTED"]);

export const bookingSchema = z.object({
  id: z.string().uuid(),
  requesterId: z.string().uuid(),
  requesterName: z.string(),
  date: z.string().min(1, "Date is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
  courtId: z.string().uuid("Select a court"),
  status: bookingStatusSchema,
  useMakeupCredit: z.boolean().default(false),
  traineeId: z.string().uuid().optional(),
});

export const bookingFormSchema = z.object({
  requesterId: z.string().uuid(),
  requesterName: z.string().min(1),
  date: z.string().min(1, "Date is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
  courtId: z.string().uuid("Select a court"),
  useMakeupCredit: z.boolean().default(false),
  traineeId: z.string().uuid().optional(),
});

export type Booking = z.infer<typeof bookingSchema>;
export type BookingFormValues = z.infer<typeof bookingFormSchema>;
export type BookingStatus = z.infer<typeof bookingStatusSchema>;

// ─── Attendance ──────────────────────────────────────────
export const attendanceStatusSchema = z.enum(["Present", "Absent", "Cancelled_Eligible"]);

export const attendanceRecordSchema = z.object({
  id: z.string().uuid(),
  groupId: z.string().uuid(),
  sessionDate: z.string(),
  traineeId: z.string().uuid(),
  status: attendanceStatusSchema,
});

export type AttendanceRecord = z.infer<typeof attendanceRecordSchema>;
export type AttendanceStatus = z.infer<typeof attendanceStatusSchema>;
