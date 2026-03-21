import { useCoachList } from "@/hooks/useCoachList";
import DataTable from "@/components/DataTable";
import CoachFormDialog from "@/components/Coaches/CoachFormDialog";
import PageHeader from "@/components/Layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Coach } from "@/types/schemas";

export default function CoachesPage() {
  const {
    table, globalFilter, setGlobalFilter,
    isFormOpen, setIsFormOpen, editingCoach,
    openCreate, openEdit, handleSubmit, handleDelete,
  } = useCoachList();

  return (
    <div>
      <PageHeader
        title="Coaches"
        description="Manage coaching staff"
        action={<Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add Coach</Button>}
      />
      <DataTable
        table={table}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        onRowClick={openEdit}
        actionColumn={(coach: Coach) => (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => openEdit(coach)}><Pencil className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(coach.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
          </div>
        )}
      />
      <CoachFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} onSubmit={handleSubmit} editingCoach={editingCoach} />
    </div>
  );
}
