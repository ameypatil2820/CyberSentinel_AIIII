import React from 'react';
import { cn } from './Card';

export function Button({ className, variant = 'primary', children, ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "btn-primary",
    cyan: "btn-cyan",
    outline: "btn-outline",
    ghost: "hover:bg-slate-800 text-brand-text",
  };
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10",
  };

  return (
    <button className={cn(baseStyles, variants[variant], sizes.default, className)} {...props}>
      {children}
    </button>
  );
}
