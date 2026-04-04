import type { ReactElement } from 'react';
import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type IOption = {
  id: string;
  name: string | ReactElement;
  extraRender?: string | ReactElement;
};

type FormFieldSelectProps<T extends FieldValues> = {
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

function FormFieldSelect<T extends FieldValues>({
  field,
  options,
  placeholder,
  disabled,
  className,
  formItemId,
  formDescriptionId,
  formMessageId,
  error,
}: FormFieldSelectProps<T>) {
  const value = typeof field.value === 'string' ? field.value : '';

  return (
    <Select
      value={value === '' ? undefined : value}
      onValueChange={field.onChange}
      disabled={disabled}
    >
      <SelectTrigger
        id={formItemId}
        ref={field.ref}
        aria-describedby={
          !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`
        }
        aria-invalid={!!error}
        onBlur={field.onBlur}
        className={cn('peer', className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.id} value={opt.id}>
            <span className="flex flex-col gap-0.5 text-left">
              <span>{opt.name}</span>
              {opt.extraRender != null && (
                <span className="text-xs text-muted-foreground">{opt.extraRender}</span>
              )}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { FormFieldSelect };
