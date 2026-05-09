import React from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function GlassCard({ children, className, as: Component = "div", ...props }: GlassCardProps) {
  return (
    <Component className={cn("glass-card p-6 md:p-8", className)} {...props}>
      {children}
    </Component>
  );
}
