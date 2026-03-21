"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface EnhancedStatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const EnhancedStatCard = forwardRef<HTMLDivElement, EnhancedStatCardProps>(
  ({ className, title, value, icon: Icon, description, trend, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden glass-morphism rounded-2xl p-6 transition-all duration-300 ease-in-out hover:translate-y-[-4px] hover:scale-[1.02]",
          className
        )}
        {...props}
        >
          <div className="absolute inset-0 -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-radial from-purple-500/10 to-transparent opacity-0 transition-opacity duration-300 pointer-events-none hover:opacity-100" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">{value}</p>
                {trend && (
                  <div className={cn(
                    "flex items-center text-xs font-medium",
                    trend.isPositive ? "text-green-500" : "text-red-500"
                  )}>
                    {trend.isPositive ? "+" : "-"}{trend.value}%
                  </div>
                )}
              </div>
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </div>
            
            <div className="glass-morphism p-3 rounded-xl transition-all duration-300 ease-in-out hover:rotate-[5deg] hover:scale-110">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
    );
  }
);

EnhancedStatCard.displayName = "EnhancedStatCard";

export { EnhancedStatCard };
