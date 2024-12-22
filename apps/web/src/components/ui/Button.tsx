import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  cosmic?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', cosmic = false, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:pointer-events-none disabled:opacity-50',
          
          // Variants with cosmic effects
          variant === 'default' && [
            cosmic ? 'primary-gradient hover:glow' : 'bg-primary text-primary-foreground hover:opacity-90'
          ],
          variant === 'destructive' && [
            cosmic ? 'bg-gradient-to-r from-destructive to-destructive/80 hover:glow text-destructive-foreground' 
                  : 'bg-destructive text-destructive-foreground hover:opacity-90'
          ],
          variant === 'outline' && [
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
            cosmic && 'hover:glow'
          ],
          variant === 'secondary' && [
            cosmic ? 'bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground hover:glow' 
                  : 'bg-secondary text-secondary-foreground hover:opacity-90'
          ],
          variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
          variant === 'link' && 'text-primary underline-offset-4 hover:underline',
          
          // Sizes
          size === 'default' && 'h-10 px-4 py-2',
          size === 'sm' && 'h-9 rounded-md px-3',
          size === 'lg' && 'h-11 rounded-md px-8',
          size === 'icon' && 'h-10 w-10',
          
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, type ButtonProps };
