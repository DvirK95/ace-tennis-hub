import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { ChevronDown } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type IOption = {
  id: string;
  name: string | ReactElement;
  extraRender?: string | ReactElement;
};

function normalizeMultiValue(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string');
  }
  return [];
}

type FormFieldMultiSelectProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>;
  options: IOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  formItemId: string;
  formDescriptionId: string;
  formMessageId: string;
  error?: boolean;
};

function FormFieldMultiSelect<T extends FieldValues>({
  field,
  options,
  placeholder = 'Select…',
  disabled,
  className,
  formItemId,
  formDescriptionId,
  formMessageId,
  error,
}: FormFieldMultiSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const selected = useMemo(() => normalizeMultiValue(field.value), [field.value]);

  const labelById = useMemo(() => {
    const map = new Map<string, string | ReactElement>();
    for (const o of options) {
      map.set(o.id, o.name);
    }
    return map;
  }, [options]);

  const summary = useMemo(() => {
    if (selected.length === 0) {
      return placeholder;
    }
    if (selected.length === 1) {
      const one = labelById.get(selected[0]);
      return one ?? selected[0];
    }
    return `${selected.length} selected`;
  }, [selected, labelById, placeholder]);

  function toggle(id: string, checked: boolean) {
    const next = new Set(selected);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    field.onChange([...next]);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={formItemId}
          ref={field.ref}
          disabled={disabled}
          aria-describedby={
            !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`
          }
          aria-invalid={!!error}
          aria-expanded={open}
          onBlur={field.onBlur}
          className={cn(
            'peer flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
            selected.length === 0 && 'text-muted-foreground',
            className
          )}
        >
          <span className="truncate text-left">{summary}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <div
          role="group"
          aria-label="Options"
          className="max-h-60 overflow-y-auto p-2"
        >
          {options.map((opt) => {
            const checked = selected.includes(opt.id);
            return (
              <label
                key={opt.id}
                className="flex cursor-pointer items-start gap-2 rounded-sm px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(v) => toggle(opt.id, v === true)}
                  className="mt-0.5"
                  aria-labelledby={`${formItemId}-opt-${opt.id}`}
                />
                <span id={`${formItemId}-opt-${opt.id}`} className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span>{opt.name}</span>
                  {opt.extraRender != null && (
                    <span className="text-xs text-muted-foreground">{opt.extraRender}</span>
                  )}
                </span>
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { FormFieldMultiSelect };
