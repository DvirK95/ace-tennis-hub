import { useBookingList } from "@/hooks/useBookingList";
import DataTable from "@/components/DataTable";
import BookingFormDialog from "@/components/Bookings/BookingFormDialog";
import PageHeader from "@/components/Layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function BookingsPage() {
  const {
    table, globalFilter, setGlobalFilter,
    isFormOpen, setIsFormOpen, handleSubmit,
    courts, trainees, currentUser,
  } = useBookingList();

  return (
    <div>
      <PageHeader
        title="Bookings"
        description="Request and track court bookings"
        action={<Button onClick={() => setIsFormOpen(true)}><Plus className="h-4 w-4 mr-2" />New Booking</Button>}
      />
      <DataTable
        table={table}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
      />
      <BookingFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        courts={courts}
        trainees={trainees}
        currentUser={currentUser}
      />
    </div>
  );
}
