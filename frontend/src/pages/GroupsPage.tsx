import { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useGroupList } from '@/hooks/useGroupList';
import DataTable from '@/components/DataTable';
import GroupFormDialog from '@/components/Groups/GroupFormDialog';
import AttendancePanel from '@/components/Groups/AttendancePanel';
import PageHeader from '@/components/Layout/PageHeader';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, ClipboardList, Search } from 'lucide-react';
import type { Group } from '@/types/schemas';

const columnHelper = createColumnHelper<Group>();

export default function GroupsPage() {
  const {
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
  } = useGroupList();

  const [search, setSearch] = useState('');
  const [attendanceGroupId, setAttendanceGroupId] = useState<string | null>(null);

  const coachMap = useMemo(() => new Map(coaches.map((c) => [c.id, c.name])), [coaches]);
  const courtMap = useMemo(() => new Map(courts.map((c) => [c.id, c.name])), [courts]);

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter((g) => {
      const coachNames = g.coachIds.map((id) => coachMap.get(id) ?? '').join(' ');
      const courtName = courtMap.get(g.courtId) ?? '';
      return [g.name, g.schedule, coachNames, courtName].some((v) =>
        v.toLowerCase().includes(q)
      );
    });
  }, [groups, search, coachMap, courtMap]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', { header: 'Group Name', enableSorting: true }),
      columnHelper.accessor('coachIds', {
        header: 'Coaches',
        cell: (info) =>
          info
            .getValue()
            .map((id) => coachMap.get(id) ?? '—')
            .join(', '),
        enableSorting: false,
      }),
      columnHelper.accessor('memberIds', {
        header: 'Members',
        cell: (info) => info.getValue().length,
        enableSorting: false,
      }),
      columnHelper.accessor('schedule', { header: 'Schedule' }),
      columnHelper.accessor('courtId', {
        header: 'Court',
        cell: (info) => courtMap.get(info.getValue()) ?? '—',
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
              onClick={() => setAttendanceGroupId(row.original.id)}
              icon={<ClipboardList className="h-3.5 w-3.5" />}
              aria-label="Attendance"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEdit(row.original)}
              icon={<Pencil className="h-3.5 w-3.5" />}
              aria-label="Edit group"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(row.original.id)}
              icon={<Trash2 className="h-3.5 w-3.5 text-destructive" />}
              aria-label="Delete group"
            />
          </div>
        ),
      }),
    ],
    [coachMap, courtMap, openEdit, handleDelete]
  );

  return (
    <div>
      <PageHeader
        title="Groups & Classes"
        description="Manage training groups"
        action={
          <Button onClick={openCreate} icon={<Plus className="h-4 w-4" />}>
            Add Group
          </Button>
        }
      />
      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search groups…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <DataTable
        data={filteredGroups}
        columns={columns}
        pagination
        onRowClick={openEdit}
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
