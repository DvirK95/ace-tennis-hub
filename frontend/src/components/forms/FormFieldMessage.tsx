import * as React from 'react';

import { cn } from '@/lib/utils';

const FormFieldMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    messageId: string;
    message?: string;
  }
>(({ className, messageId, message, ...props }, ref) => {
  if (!message) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={messageId}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {message}
    </p>
  );
});
FormFieldMessage.displayName = 'FormFieldMessage';

export { FormFieldMessage };
