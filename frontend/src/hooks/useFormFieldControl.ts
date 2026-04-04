import { useId } from 'react';
import {
  useController,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from 'react-hook-form';

export function useFormFieldControl<T extends FieldValues>({
  form,
  name,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
}) {
  const baseId = useId();
  const formItemId = `${baseId}-form-item`;
  const formDescriptionId = `${baseId}-form-item-description`;
  const formMessageId = `${baseId}-form-item-message`;

  const { field, fieldState } = useController({
    name,
    control: form.control,
  });

  return {
    field,
    fieldState,
    formItemId,
    formDescriptionId,
    formMessageId,
  };
}
