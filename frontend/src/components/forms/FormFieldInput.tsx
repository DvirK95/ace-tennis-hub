import { useState } from 'react';
import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

import { composeButtonClasses } from '@/components/ui/Button/buttonClasses';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { FormFieldControl } from './FormFieldControl';

type FormFieldInputProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  formItemId: string;
  formDescriptionId: string;
  formMessageId: string;
  error?: boolean;
};

function FormFieldInput<T extends FieldValues>({
  field,
  type,
  placeholder,
  disabled,
  className,
  formItemId,
  formDescriptionId,
  formMessageId,
  error,
}: FormFieldInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  if (isPassword) {
    const PasswordIcon = showPassword ? EyeOff : Eye;
    return (
      <div className="relative">
        <FormFieldControl
          formItemId={formItemId}
          formDescriptionId={formDescriptionId}
          formMessageId={formMessageId}
          error={error}
        >
          <Input
            {...field}
            type={inputType}
            placeholder={placeholder}
            disabled={disabled}
            className={cn('peer', isPassword && 'pr-10', className)}
            value={field.value ?? ''}
            autoComplete={isPassword ? 'current-password' : undefined}
          />
        </FormFieldControl>
        <button
          type="button"
          className={cn(
            composeButtonClasses({
              variant: 'ghost',
              size: 'icon',
              className:
                'absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:text-foreground',
            })
          )}
          disabled={disabled}
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <PasswordIcon className="h-4 w-4" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <FormFieldControl
      formItemId={formItemId}
      formDescriptionId={formDescriptionId}
      formMessageId={formMessageId}
      error={error}
    >
      <Input
        {...field}
        type={inputType}
        placeholder={placeholder}
        disabled={disabled}
        className={cn('peer', isPassword && 'pr-10', className)}
        value={field.value ?? ''}
      />
    </FormFieldControl>
  );
}

export { FormFieldInput };
