import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { PropsWithChildren, ReactElement } from 'react';

type ButtonTooltipWrapperProps = PropsWithChildren<{
  tooltip?: ReactElement;
}>;
function ButtonTooltipWrapper({ tooltip, children }: ButtonTooltipWrapperProps) {
  if (!tooltip) {
    return children;
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export default ButtonTooltipWrapper;
