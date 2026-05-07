import { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useCourtList } from '@/hooks/useCourtList';
import DataTable from '@/components/DataTable';
import CourtFormDialog from '@/components/Courts/CourtFormDialog';
import PageHeader from '@/components/Layout/PageHeader';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import type { Court } from '@/types/schemas';

const columnHelper = createColumnHelper<Court>();

export default function CourtsPage() {
  const {
    courts,
    isFormOpen,
    setIsFormOpen,
    editingCourt,
    openCreate,
    openEdit,
    handleSubmit,
    handleDelete,
  } = useCourtList();

  const [search, setSearch] = useState('');

  const filteredCourts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courts;
    return courts.filter((c) =>
      [c.name, c.location, c.surfaceType, c.status].some((v) =>
        v.toLowerCase().includes(q)
      )
    );
  }, [courts, search]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', { header: 'Name', enableSorting: true }),
      columnHelper.accessor('location', { header: 'Location' }),
      columnHelper.accessor('surfaceType', { header: 'Surface' }),
      columnHelper.accessor('status', { header: 'Status' }),
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
              aria-label="Edit court"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(row.original.id)}
              icon={<Trash2 className="h-3.5 w-3.5 text-destructive" />}
              aria-label="Delete court"
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
        title="Courts"
        description="Manage your tennis courts"
        action={
          <Button onClick={openCreate} icon={<Plus className="h-4 w-4" />}>
            Add Court
          </Button>
        }
      />
      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <DataTable
        data={filteredCourts}
        columns={columns}
        pagination
        onRowClick={openEdit}
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
