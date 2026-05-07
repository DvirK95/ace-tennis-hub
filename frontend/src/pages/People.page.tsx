import { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { usePeopleList } from '@/hooks/usePeopleList';
import DataTable from '@/components/DataTable';
import PersonFormDialog from '@/components/People/PersonFormDialog';
import PageHeader from '@/components/Layout/PageHeader';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ClubUser, UserRole } from '@/types/schemas';
import { useNavigate } from 'react-router-dom';

const columnHelper = createColumnHelper<ClubUser>();

export default function PeoplePage() {
  const {
    people,
    isFormOpen,
    setIsFormOpen,
    editingPerson,
    openCreate,
    openEdit,
    handleSubmit,
    handleDelete,
  } = usePeopleList();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');

  const filteredPeople = useMemo(() => {
    const q = search.trim().toLowerCase();
    return people.filter((p) => {
      if (roleFilter !== 'ALL' && !p.roles.includes(roleFilter)) return false;
      if (!q) return true;
      return [p.name, p.email, p.phone, p.roles.join(' ')].some((v) =>
        v.toLowerCase().includes(q)
      );
    });
  }, [people, roleFilter, search]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', { header: 'Name', enableSorting: true }),
      columnHelper.accessor('email', { header: 'Email' }),
      columnHelper.accessor('phone', { header: 'Phone' }),
      columnHelper.accessor('roles', {
        header: 'Roles',
        cell: (info) => info.getValue().join(', '),
        enableSorting: false,
      }),
      columnHelper.accessor('makeupCredits', {
        header: 'Credits',
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div
            className="flex justify-end gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEdit(row.original)}
              icon={<Pencil className="h-3.5 w-3.5" />}
              aria-label="Edit person"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(row.original.id)}
              icon={<Trash2 className="h-3.5 w-3.5 text-destructive" />}
              aria-label="Delete person"
            />
          </div>
        ),
      }),
    ],
    [openEdit, handleDelete]
  );

  return (
    <div>
      <PageHeader
        title="People"
        description="Manage all users — admins, coaches, and trainees"
        action={
          <Button onClick={openCreate} icon={<Plus className="h-4 w-4" />}>
            Add Person
          </Button>
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search people…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as typeof roleFilter)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="COACH">Coach</SelectItem>
            <SelectItem value="TRAINEE">Trainee</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable
        data={filteredPeople}
        columns={columns}
        pagination
        onRowClick={(person) => navigate(`/people/${person.id}`)}
      />
      <PersonFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        editingPerson={editingPerson}
      />
    </div>
  );
}
