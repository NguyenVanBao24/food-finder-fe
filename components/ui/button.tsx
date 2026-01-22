import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/30',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30',
        outline:
          'border-2 border-gray-200 bg-white hover:bg-gray-50 hover:text-primary-600 text-gray-700',
        secondary:
          'bg-secondary text-white hover:bg-secondary-dark shadow-lg shadow-secondary/30',
        ghost: 'hover:bg-gray-100 text-gray-700 hover:text-gray-900',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'h-11 w-11',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
