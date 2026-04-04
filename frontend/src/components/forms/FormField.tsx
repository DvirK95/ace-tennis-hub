import type { ComponentProps, ReactElement } from 'react';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { useFormFieldControl } from '@/hooks/useFormFieldControl';

import FormLabel from './FormLabel';
import { FormFieldInput } from './FormFieldInput';
import { FormFieldMessage } from './FormFieldMessage';
import { FormFieldMultiSelect } from './FormFieldMultiSelect';
import { FormFieldSelect } from './FormFieldSelect';
import { FormFieldTextarea } from './FormFieldTextarea';

type InputPrimitiveProps = Pick<ComponentProps<'input'>, 'type' | 'placeholder' | 'className'>;

type IOption = {
  id: string;
  name: string | ReactElement;
  extraRender?: string | ReactElement;
};

type FormFieldProps<T extends FieldValues> = InputPrimitiveProps & {
  form: UseFormReturn<T>;
  name: Path<T>;
  field?: 'input' | 'textarea' | 'select' | 'multiSelect';
  isDisabled?: boolean;
  isRequired?: boolean;
  label?: string;
  options?: IOption[];
  /** Applied to the control (input, textarea, select trigger, multi-select trigger). */
  controlClassName?: string;
  /** Applied to the label text (same as previous FormLabel `className`). */
  className?: string;
  rows?: number;
};

function FormField<T extends FieldValues>(props: FormFieldProps<T>) {
  const {
    form,
    name,
    field: fieldKind = 'input',
    isDisabled = false,
    isRequired = false,
    label,
    options = [],
    type,
    placeholder,
    className,
    controlClassName,
    rows,
  } = props;

  const { field, fieldState, formItemId, formDescriptionId, formMessageId } = useFormFieldControl({
    form,
    name,
  });

  const error = fieldState.error;
  const errorMessage = error?.message != null ? String(error.message) : undefined;

  return (
    <div className={cn('space-y-2')}>
      <span id={formDescriptionId} className="sr-only" aria-hidden />
      {label && (
        <FormLabel
          label={label}
          isRequired={isRequired}
          htmlFor={formItemId}
          error={!!error}
          isDisabled={isDisabled}
          className={className}
        />
      )}
      {fieldKind === 'textarea' && (
        <FormFieldTextarea
          field={field}
          placeholder={placeholder}
          disabled={isDisabled}
          className={controlClassName}
          rows={rows}
          formItemId={formItemId}
          formDescriptionId={formDescriptionId}
          formMessageId={formMessageId}
          error={!!error}
        />
      )}
      {fieldKind === 'select' && (
        <FormFieldSelect
          field={field}
          options={options}
          placeholder={placeholder}
          disabled={isDisabled}
          className={controlClassName}
          formItemId={formItemId}
          formDescriptionId={formDescriptionId}
          formMessageId={formMessageId}
          error={!!error}
        />
      )}
      {fieldKind === 'multiSelect' && (
        <FormFieldMultiSelect
          field={field}
          options={options}
          placeholder={placeholder}
          disabled={isDisabled}
          className={controlClassName}
          formItemId={formItemId}
          formDescriptionId={formDescriptionId}
          formMessageId={formMessageId}
          error={!!error}
        />
      )}
      {fieldKind === 'input' && (
        <FormFieldInput
          field={field}
          type={type}
          placeholder={placeholder}
          disabled={isDisabled}
          className={controlClassName}
          formItemId={formItemId}
          formDescriptionId={formDescriptionId}
          formMessageId={formMessageId}
          error={!!error}
        />
      )}
      <FormFieldMessage messageId={formMessageId} message={errorMessage} />
    </div>
  );
}

export default FormField;
export type { FormFieldProps, IOption };
