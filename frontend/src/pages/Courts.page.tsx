import { useCourtList } from '@/hooks/useCourtList';
import DataTable from '@/components/DataTable';
import CourtFormDialog from '@/components/Courts/CourtFormDialog';
import PageHeader from '@/components/Layout/PageHeader';
import { Button } from '@/components/ui/Button/Button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Court } from '@/types/schemas';

export default function CourtsPage() {
  const {
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
  } = useCourtList();

  return (
    <div>
      <PageHeader
        title="Courts"
        description="Manage your tennis courts"
        action={
          <Button onClick={openCreate} icon={<Plus className="h-4 w-4" />}>
            Add Court
          </Button>
        }
      />
      <DataTable
        table={table}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        onRowClick={openEdit}
        actionColumn={(court: Court) => (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEdit(court)}
              icon={<Pencil className="h-3.5 w-3.5" />}
              aria-label="Edit court"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(court.id)}
              icon={<Trash2 className="h-3.5 w-3.5 text-destructive" />}
              aria-label="Delete court"
            />
          </div>
        )}
      />
      <CourtFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        editingCourt={editingCourt}
      />
    </div>
  );
}
