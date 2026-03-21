import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { useBookingStore } from "@/stores/useBookingStore";
import { useCourtStore } from "@/stores/useCourtStore";
import { useTraineeStore } from "@/stores/useTraineeStore";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Booking, BookingFormValues } from "@/types/schemas";

const columnHelper = createColumnHelper<Booking>();

export function useBookingList() {
  const { bookings, addBooking, updateBookingStatus } = useBookingStore();
  const { courts } = useCourtStore();
  const { trainees, decrementMakeupCredits } = useTraineeStore();
  const { currentUser } = useAuthStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const courtMap = useMemo(() => new Map(courts.map((c) => [c.id, c.name])), [courts]);

  const pendingBookings = useMemo(
    () => bookings.filter((b) => b.status === "PENDING_APPROVAL"),
    [bookings]
  );

  const approvedBookings = useMemo(
    () => bookings.filter((b) => b.status === "APPROVED"),
    [bookings]
  );

  const allColumns = useMemo(
    () => [
      columnHelper.accessor("requesterName", { header: "Requester" }),
      columnHelper.accessor("date", { header: "Date", enableSorting: true }),
      columnHelper.accessor("timeSlot", { header: "Time Slot" }),
      columnHelper.accessor("courtId", {
        header: "Court",
        cell: (info) => courtMap.get(info.getValue()) ?? "—",
      }),
      columnHelper.accessor("status", { header: "Status" }),
    ],
    [courtMap]
  );

  const table = useReactTable({
    data: bookings,
    columns: allColumns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  function handleSubmit(values: BookingFormValues) {
    const booking: Booking = {
      ...values,
      id: crypto.randomUUID(),
      status: "PENDING_APPROVAL",
    };
    addBooking(booking);
    if (values.useMakeupCredit && values.traineeId) {
      decrementMakeupCredits(values.traineeId);
    }
    setIsFormOpen(false);
  }

  function approve(id: string) {
    updateBookingStatus(id, "APPROVED");
  }

  function reject(id: string) {
    updateBookingStatus(id, "REJECTED");
  }

  return {
    table,
    globalFilter,
    setGlobalFilter,
    isFormOpen,
    setIsFormOpen,
    handleSubmit,
    approve,
    reject,
    pendingBookings,
    approvedBookings,
    bookings,
    courts,
    trainees,
    currentUser,
    courtMap,
  };
}
