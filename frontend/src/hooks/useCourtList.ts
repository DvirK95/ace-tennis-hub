import { useState } from 'react';
import { useCourtStore } from '@/stores/useCourtStore';
import type { Court, CourtFormValues } from '@/types/schemas';

export function useCourtList() {
  const { courts, addCourt, updateCourt, deleteCourt } = useCourtStore();
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
    courts,
    isFormOpen,
    setIsFormOpen,
    editingCourt,
    openCreate,
    openEdit,
    handleSubmit,
    handleDelete,
  };
}
