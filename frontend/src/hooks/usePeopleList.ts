import { useState } from 'react';
import { usePersonStore } from '@/stores/usePersonStore';
import type { ClubUser, ClubUserFormValues } from '@/types/schemas';

export function usePeopleList() {
  const { people, addPerson, updatePerson, deletePerson } = usePersonStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<ClubUser | null>(null);

  function openCreate() {
    setEditingPerson(null);
    setIsFormOpen(true);
  }

  function openEdit(person: ClubUser) {
    setEditingPerson(person);
    setIsFormOpen(true);
  }

  function handleSubmit(values: ClubUserFormValues) {
    if (editingPerson) {
      updatePerson(editingPerson.id, values);
    } else {
      addPerson({ ...values, id: crypto.randomUUID(), makeupCredits: 0 });
    }
    setIsFormOpen(false);
    setEditingPerson(null);
  }

  function handleDelete(id: string) {
    deletePerson(id);
  }

  return {
    people,
    isFormOpen,
    setIsFormOpen,
    editingPerson,
    openCreate,
    openEdit,
    handleSubmit,
    handleDelete,
  };
}
