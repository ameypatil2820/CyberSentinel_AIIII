import React from 'react';
import { cn } from './Card';

export const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "glass-input w-full",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";
