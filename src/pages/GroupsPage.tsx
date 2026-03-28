import { useState } from 'react';
import { useGroupList } from '@/hooks/useGroupList';
import DataTable from '@/components/DataTable';
import GroupFormDialog from '@/components/Groups/GroupFormDialog';
import AttendancePanel from '@/components/Groups/AttendancePanel';
import PageHeader from '@/components/Layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, ClipboardList } from 'lucide-react';
import type { Group } from '@/types/schemas';

export default function GroupsPage() {
  const {
    table,
    globalFilter,
    setGlobalFilter,
    isFormOpen,
    setIsFormOpen,
    editingGroup,
    openCreate,
    openEdit,
    handleSubmit,
    handleDelete,
    coaches,
    courts,
  } = useGroupList();

  const [attendanceGroupId, setAttendanceGroupId] = useState<string | null>(null);

  return (
    <div>
      <PageHeader
        title="Groups & Classes"
        description="Manage training groups"
        action={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Group
          </Button>
        }
      />
      <DataTable
        table={table}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        onRowClick={openEdit}
        actionColumn={(group: Group) => (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAttendanceGroupId(group.id)}
              title="Attendance"
            >
              <ClipboardList className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => openEdit(group)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(group.id)}>
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        )}
      />
      <GroupFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        editingGroup={editingGroup}
        coaches={coaches}
        courts={courts}
      />
      {attendanceGroupId && (
        <AttendancePanel
          groupId={attendanceGroupId}
          open={!!attendanceGroupId}
          onOpenChange={(open) => {
            if (!open) setAttendanceGroupId(null);
          }}
        />
      )}
    </div>
  );
}
