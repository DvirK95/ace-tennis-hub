import { cn } from '@/lib/utils';

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

const VARIANT_CLASSES = {
  default:
    'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 active:scale-[0.98]',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80 active:scale-[0.98]',
  outline:
    'border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/90 active:text-accent-foreground active:scale-[0.98]',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70 active:scale-[0.98]',
  ghost:
    'hover:bg-accent hover:text-accent-foreground active:bg-accent/90 active:text-accent-foreground active:scale-[0.98]',
  link: 'text-primary underline-offset-4 hover:underline active:text-primary/80 active:underline',
} as const;

const SIZE_CLASSES = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'aspect-square h-10 w-10 shrink-0 p-0',
  iconSm: 'aspect-square h-9 w-9 shrink-0 p-0',
} as const;

export type ButtonComposeVariant = keyof typeof VARIANT_CLASSES;
export type ButtonComposeSize = keyof typeof SIZE_CLASSES;

export function composeButtonClasses(options?: {
  variant?: ButtonComposeVariant;
  size?: ButtonComposeSize;
  className?: string;
}) {
  const variant = options?.variant ?? 'default';
  const size = options?.size ?? 'default';
  return cn(BUTTON_BASE, VARIANT_CLASSES[variant], SIZE_CLASSES[size], options?.className);
}
