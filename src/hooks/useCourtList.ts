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
import { useCourtStore } from "@/stores/useCourtStore";
import type { Court, CourtFormValues } from "@/types/schemas";

const columnHelper = createColumnHelper<Court>();

export function useCourtList() {
  const { courts, addCourt, updateCourt, deleteCourt } = useCourtStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", { header: "Name", enableSorting: true }),
      columnHelper.accessor("location", { header: "Location" }),
      columnHelper.accessor("surfaceType", { header: "Surface" }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => info.getValue(),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: courts,
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
    setEditingCourt(null);
    setIsFormOpen(true);
  }

  function openEdit(court: Court) {
    setEditingCourt(court);
    setIsFormOpen(true);
  }

  function handleSubmit(values: CourtFormValues) {
    if (editingCourt) {
      updateCourt(editingCourt.id, values);
    } else {
      addCourt({ ...values, id: crypto.randomUUID() });
    }
    setIsFormOpen(false);
    setEditingCourt(null);
  }

  function handleDelete(id: string) {
    deleteCourt(id);
  }

  return {
    table,
    globalFilter,
    setGlobalFilter,
    isFormOpen,
    setIsFormOpen,
    editingCourt,
    openCreate,
    openEdit,
    handleSubmit,
    handleDelete,
    courts,
  };
}
