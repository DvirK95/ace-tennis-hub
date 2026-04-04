import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';

import { composeButtonClasses, type ButtonComposeSize } from './buttonClasses';
import ButtonTooltipWrapper from './ButtonTooltipWrapper';
import { hasVisibleContent } from '@/helpers/hasVisibleContent';

export interface ButtonProps extends Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className' | 'onClick' | 'disabled' | 'type'
> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm';
  icon?: ReactElement;
  children?: ReactNode;
  tooltip?: ReactElement;
}

function Button(props: ButtonProps) {
  const {
    className,
    variant = 'default',
    size = 'default',
    icon,
    children,
    tooltip,
    ...rest
  } = props;
  const iconOnly = Boolean(icon) && !hasVisibleContent(children);
  const composedSize: ButtonComposeSize = iconOnly ? (size === 'sm' ? 'iconSm' : 'icon') : size;

  return (
    <ButtonTooltipWrapper tooltip={tooltip}>
      <button
        className={composeButtonClasses({ variant, size: composedSize, className })}
        {...rest}
      >
        {icon}
        {children}
      </button>
    </ButtonTooltipWrapper>
  );
}

export { Button };
export default Button;
