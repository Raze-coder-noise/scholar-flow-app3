import * as React from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'default', size = 'default', isLoading, disabled, ...props }, ref) => (
  <button
    ref={ref}
    disabled={disabled || isLoading}
    className={cn(
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      variant === 'default' && 'bg-slate-900 text-white hover:bg-slate-800',
      variant === 'secondary' && 'bg-slate-100 text-slate-900 hover:bg-slate-200',
      variant === 'destructive' && 'bg-red-600 text-white hover:bg-red-700',
      variant === 'outline' && 'border border-slate-200 hover:bg-slate-50',
      variant === 'ghost' && 'hover:bg-slate-100',
      size === 'default' && 'h-10 px-4 py-2',
      size === 'sm' && 'h-9 rounded-md px-3 text-sm',
      size === 'lg' && 'h-11 rounded-md px-8',
      className
    )}
    {...props}
  />
));
Button.displayName = 'Button';

export { Button, type ButtonProps };
