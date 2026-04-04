import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { FormFieldControl } from './FormFieldControl';

type FormFieldTextareaProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  rows?: number;
  formItemId: string;
  formDescriptionId: string;
  formMessageId: string;
  error?: boolean;
};

function FormFieldTextarea<T extends FieldValues>({
  field,
  placeholder,
  disabled,
  className,
  rows = 4,
  formItemId,
  formDescriptionId,
  formMessageId,
  error,
}: FormFieldTextareaProps<T>) {
  return (
    <FormFieldControl
      formItemId={formItemId}
      formDescriptionId={formDescriptionId}
      formMessageId={formMessageId}
      error={error}
    >
      <textarea
        {...field}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        value={field.value ?? ''}
        className={cn(
          'peer flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
      />
    </FormFieldControl>
  );
}

export { FormFieldTextarea };
