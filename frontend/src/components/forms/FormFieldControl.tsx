import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

const FormFieldControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot> & {
    formItemId: string;
    formDescriptionId: string;
    formMessageId: string;
    error?: boolean;
  }
>(({ formItemId, formDescriptionId, formMessageId, error, ...props }, ref) => (
  <Slot
    ref={ref}
    id={formItemId}
    aria-describedby={
      !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`
    }
    aria-invalid={!!error}
    {...props}
  />
));
FormFieldControl.displayName = 'FormFieldControl';

export { FormFieldControl };
