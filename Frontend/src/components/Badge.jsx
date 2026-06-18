import React from 'react';
import { cn } from './Card';

export function Badge({ className, variant = 'default', children, ...props }) {
  const variants = {
    default: "bg-slate-800 text-slate-100",
    success: "bg-green-500/10 text-green-400 border border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    destructive: "bg-red-500/10 text-red-400 border border-red-500/20",
    info: "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20",
    purple: "bg-brand-purple/10 text-purple-400 border border-brand-purple/20",
  };

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
