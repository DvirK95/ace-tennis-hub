import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormLabelProps {
  label?: string;
  isRequired?: boolean;
  className?: string;
  isDisabled?: boolean;
  htmlFor?: string;
  error?: boolean;
}

function FormLabel(props: FormLabelProps) {
  const { label, isRequired, className, isDisabled, htmlFor, error } = props;
  if (!label) {
    return null;
  }

  return (
    <Label
      htmlFor={htmlFor}
      className={cn(error && 'text-destructive', isDisabled && 'opacity-70', className)}
    >
      {label}
      {isRequired && <span className="text-destructive ml-1">*</span>}
    </Label>
  );
}

export default FormLabel;
