import { useMemo } from "react";
import { useBookingStore } from "@/stores/useBookingStore";
import { useCourtStore } from "@/stores/useCourtStore";
import PageHeader from "@/components/Layout/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import type { Booking } from "@/types/schemas";

interface ApprovalRowProps {
  booking: Booking;
  courtName: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

function ApprovalRow({ booking, courtName, onApprove, onReject }: ApprovalRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0 px-4">
      <div className="flex items-center gap-6">
        <div>
          <p className="text-sm font-medium">{booking.requesterName}</p>
          <p className="text-xs text-muted-foreground">{booking.date} · {booking.timeSlot}</p>
        </div>
        <span className="text-sm text-muted-foreground">{courtName}</span>
        <StatusBadge status={booking.status} />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onApprove(booking.id)} className="gap-1">
          <Check className="h-3.5 w-3.5" /> Approve
        </Button>
        <Button size="sm" variant="outline" onClick={() => onReject(booking.id)} className="gap-1 text-destructive">
          <X className="h-3.5 w-3.5" /> Reject
        </Button>
      </div>
    </div>
  );
}

export default function ApprovalsPage() {
  const { bookings, updateBookingStatus } = useBookingStore();
  const { courts } = useCourtStore();
  const courtMap = useMemo(() => new Map(courts.map((c) => [c.id, c.name])), [courts]);

  const pending = bookings.filter((b) => b.status === "PENDING_APPROVAL");

  return (
    <div>
      <PageHeader title="Booking Approvals" description="Review and approve pending booking requests" />
      <div className="bg-card rounded-lg border shadow-card animate-fade-in">
        {pending.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground text-sm">No pending bookings to review</p>
        ) : (
          pending.map((b) => (
            <ApprovalRow
              key={b.id}
              booking={b}
              courtName={courtMap.get(b.courtId) ?? "—"}
              onApprove={(id) => updateBookingStatus(id, "APPROVED")}
              onReject={(id) => updateBookingStatus(id, "REJECTED")}
            />
          ))
        )}
      </div>
    </div>
  );
}
