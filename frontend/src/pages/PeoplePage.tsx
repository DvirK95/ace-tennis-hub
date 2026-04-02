import { usePeopleList } from '@/hooks/usePeopleList';
import DataTable from '@/components/DataTable';
import PersonFormDialog from '@/components/People/PersonFormDialog';
import PageHeader from '@/components/Layout/PageHeader';
import { Button } from '@/components/ui/Button/Button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ClubUser } from '@/types/schemas';
import { useNavigate } from 'react-router-dom';

export default function PeoplePage() {
  const {
    table,
    globalFilter,
    setGlobalFilter,
    roleFilter,
    setRoleFilter,
    isFormOpen,
    setIsFormOpen,
    editingPerson,
    openCreate,
    openEdit,
    handleSubmit,
    handleDelete,
  } = usePeopleList();
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="People"
        description="Manage all users — admins, coaches, and trainees"
        action={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Person
          </Button>
        }
      />
      <div className="mb-4">
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
        table={table}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        onRowClick={(person: ClubUser) => navigate(`/people/${person.id}`)}
        actionColumn={(person: ClubUser) => (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => openEdit(person)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(person.id)}>
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        )}
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
