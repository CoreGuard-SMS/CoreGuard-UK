"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const GlassCard = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "glass-morphism rounded-xl transition-all duration-300 ease-in-out hover:translate-y-[-2px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

GlassCard.displayName = "GlassCard";

export { GlassCard };
