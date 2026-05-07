import { useState, useMemo } from 'react';
import { useGroupStore } from '@/stores/useGroupStore';
import { usePersonStore } from '@/stores/usePersonStore';
import { useCourtStore } from '@/stores/useCourtStore';
import type { Group, GroupFormValues } from '@/types/schemas';

export function useGroupList() {
  const { groups, addGroup, updateGroup, deleteGroup } = useGroupStore();
  const people = usePersonStore((s) => s.people);
  const { courts } = useCourtStore();
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const coaches = useMemo(() => people.filter((p) => p.roles.includes('COACH')), [people]);

  function openCreate() {
    setEditingGroup(null);
    setIsFormOpen(true);
  }

  function openEdit(group: Group) {
    setEditingGroup(group);
    setIsFormOpen(true);
  }

  function handleSubmit(values: GroupFormValues) {
    if (editingGroup) {
      updateGroup(editingGroup.id, values);
    } else {
      addGroup({ ...values, id: crypto.randomUUID() });
    }
    setIsFormOpen(false);
    setEditingGroup(null);
  }

  function handleDelete(id: string) {
    deleteGroup(id);
  }

  return {
    groups,
    coaches,
    courts,
    isFormOpen,
    setIsFormOpen,
    editingGroup,
    openCreate,
    openEdit,
    handleSubmit,
    handleDelete,
  };
}
