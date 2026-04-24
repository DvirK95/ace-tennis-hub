import { useState } from 'react';
import type { CalendarEvent } from '@/types/schemas';
import { AlertTriangle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/Button/Button';

interface ConflictWarningProps {
  conflicts: CalendarEvent[];
  onCancelConflicts: (ids: string[], addCredits: boolean) => void;
}

export default function ConflictWarning({ conflicts, onCancelConflicts }: ConflictWarningProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(conflicts.map((c) => c.id)));
  const [addCredits, setAddCredits] = useState(true);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function handleConfirm() {
    onCancelConflicts([...selected], addCredits);
  }

  return (
    <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3">
      <div className="mb-2 flex items-center gap-2 text-destructive">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <p className="text-sm font-semibold">
          {conflicts.length} conflicting event{conflicts.length !== 1 ? 's' : ''} detected
        </p>
      </div>

      <div className="mb-3 space-y-1.5">
        {conflicts.map((ev) => (
          <label
            key={ev.id}
            className="flex cursor-pointer items-start gap-2 rounded-sm px-1 py-1 text-sm hover:bg-destructive/10"
          >
            <Checkbox
              checked={selected.has(ev.id)}
              onCheckedChange={() => toggle(ev.id)}
              className="mt-0.5"
            />
            <span>
              <span className="font-medium">{ev.title}</span>
              <span className="ml-1.5 text-xs text-muted-foreground">
                {ev.date} {ev.startTime}–{ev.endTime}
              </span>
            </span>
          </label>
        ))}
      </div>

      <label className="mb-3 flex cursor-pointer items-center gap-2 text-sm">
        <Checkbox
          checked={addCredits}
          onCheckedChange={(c) => setAddCredits(c === true)}
        />
        Add makeup credits to affected trainees
      </label>

      <Button
        size="sm"
        variant="destructive"
        onClick={handleConfirm}
        disabled={selected.size === 0}
      >
        Cancel {selected.size} event{selected.size !== 1 ? 's' : ''}
      </Button>
    </div>
  );
}
