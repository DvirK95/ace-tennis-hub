import { useTraineeList } from "@/hooks/useTraineeList";
import DataTable from "@/components/DataTable";
import TraineeFormDialog from "@/components/Trainees/TraineeFormDialog";
import PageHeader from "@/components/Layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Trainee } from "@/types/schemas";

export default function TraineesPage() {
  const {
    table, globalFilter, setGlobalFilter,
    isFormOpen, setIsFormOpen, editingTrainee,
    openCreate, openEdit, handleSubmit, handleDelete,
  } = useTraineeList();

  return (
    <div>
      <PageHeader
        title="Trainees"
        description="Manage club members"
        action={<Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add Trainee</Button>}
      />
      <DataTable
        table={table}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        onRowClick={openEdit}
        actionColumn={(trainee: Trainee) => (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => openEdit(trainee)}><Pencil className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(trainee.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
          </div>
        )}
      />
      <TraineeFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} onSubmit={handleSubmit} editingTrainee={editingTrainee} />
    </div>
  );
}
