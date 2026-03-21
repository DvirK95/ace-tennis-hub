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
import { useCoachStore } from "@/stores/useCoachStore";
import type { Coach, CoachFormValues } from "@/types/schemas";

const columnHelper = createColumnHelper<Coach>();

export function useCoachList() {
  const { coaches, addCoach, updateCoach, deleteCoach } = useCoachStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", { header: "Name", enableSorting: true }),
      columnHelper.accessor("email", { header: "Email" }),
      columnHelper.accessor("phone", { header: "Phone" }),
      columnHelper.accessor("specializations", { header: "Specializations" }),
      columnHelper.accessor("hourlyRate", {
        header: "Rate ($/hr)",
        cell: (info) => `$${info.getValue()}`,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: coaches,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  function openCreate() {
    setEditingCoach(null);
    setIsFormOpen(true);
  }

  function openEdit(coach: Coach) {
    setEditingCoach(coach);
    setIsFormOpen(true);
  }

  function handleSubmit(values: CoachFormValues) {
    if (editingCoach) {
      updateCoach(editingCoach.id, values);
    } else {
      addCoach({ ...values, id: crypto.randomUUID() });
    }
    setIsFormOpen(false);
    setEditingCoach(null);
  }

  function handleDelete(id: string) {
    deleteCoach(id);
  }

  return {
    table,
    globalFilter,
    setGlobalFilter,
    isFormOpen,
    setIsFormOpen,
    editingCoach,
    openCreate,
    openEdit,
    handleSubmit,
    handleDelete,
    coaches,
  };
}
