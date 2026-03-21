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
import { useTraineeStore } from "@/stores/useTraineeStore";
import type { Trainee, TraineeFormValues } from "@/types/schemas";

const columnHelper = createColumnHelper<Trainee>();

export function useTraineeList() {
  const { trainees, addTrainee, updateTrainee, deleteTrainee } = useTraineeStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [editingTrainee, setEditingTrainee] = useState<Trainee | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", { header: "Name", enableSorting: true }),
      columnHelper.accessor("email", { header: "Email" }),
      columnHelper.accessor("phone", { header: "Phone" }),
      columnHelper.accessor("skillLevel", { header: "Skill Level" }),
      columnHelper.accessor("membershipStatus", { header: "Status" }),
      columnHelper.accessor("makeupCredits", { header: "Makeup Credits" }),
    ],
    []
  );

  const table = useReactTable({
    data: trainees,
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
    setEditingTrainee(null);
    setIsFormOpen(true);
  }

  function openEdit(trainee: Trainee) {
    setEditingTrainee(trainee);
    setIsFormOpen(true);
  }

  function handleSubmit(values: TraineeFormValues) {
    if (editingTrainee) {
      updateTrainee(editingTrainee.id, values);
    } else {
      addTrainee({ ...values, id: crypto.randomUUID(), makeupCredits: 0 });
    }
    setIsFormOpen(false);
    setEditingTrainee(null);
  }

  function handleDelete(id: string) {
    deleteTrainee(id);
  }

  return {
    table,
    globalFilter,
    setGlobalFilter,
    isFormOpen,
    setIsFormOpen,
    editingTrainee,
    openCreate,
    openEdit,
    handleSubmit,
    handleDelete,
    trainees,
  };
}
