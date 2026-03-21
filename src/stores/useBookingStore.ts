import { create } from "zustand";
import type { Booking, BookingStatus } from "@/types/schemas";

interface BookingState {
  bookings: Booking[];
  addBooking: (b: Booking) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  addBooking: (b) => set((s) => ({ bookings: [...s.bookings, b] })),
  updateBookingStatus: (id, status) =>
    set((s) => ({ bookings: s.bookings.map((b) => (b.id === id ? { ...b, status } : b)) })),
}));
