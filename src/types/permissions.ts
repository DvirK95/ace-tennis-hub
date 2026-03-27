export const PERMISSIONS = [
  "MANAGE_COURTS",
  "MANAGE_USERS",
  "MANAGE_CALENDAR",
  "MANAGE_GROUPS",
  "APPROVE_BOOKINGS",
  "CREATE_BOOKING",
  "VIEW_ALL_SCHEDULES",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const PERMISSION_LABELS: Record<Permission, string> = {
  MANAGE_COURTS: "Manage Courts",
  MANAGE_USERS: "Manage Users & Permissions",
  MANAGE_CALENDAR: "Manage Calendar & Events",
  MANAGE_GROUPS: "Manage Groups & Classes",
  APPROVE_BOOKINGS: "Approve Bookings",
  CREATE_BOOKING: "Create Bookings",
  VIEW_ALL_SCHEDULES: "View All Schedules",
};
