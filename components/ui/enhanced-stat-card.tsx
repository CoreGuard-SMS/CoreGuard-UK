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
      <>
        <style jsx>{`
          .enhanced-stat-card {
            position: relative;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 
              0 8px 32px 0 rgba(31, 38, 135, 0.2),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .enhanced-stat-card:hover {
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 
              0 16px 64px 0 rgba(31, 38, 135, 0.3),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
            transform: translateY(-4px) scale(1.02);
          }
          
          .dark .enhanced-stat-card {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.05);
            box-shadow: 
              0 8px 32px 0 rgba(0, 0, 0, 0.4),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
          }
          
          .dark .enhanced-stat-card:hover {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 
              0 16px 64px 0 rgba(0, 0, 0, 0.5),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
          }
          
          .stat-icon {
            background: linear-gradient(135deg, rgba(120, 119, 198, 0.2), rgba(120, 119, 198, 0.1));
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
          }
          
          .enhanced-stat-card:hover .stat-icon {
            background: linear-gradient(135deg, rgba(120, 119, 198, 0.3), rgba(120, 119, 198, 0.2));
            transform: rotate(5deg) scale(1.1);
          }
          
          .dark .stat-icon {
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.1));
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
          
          .dark .enhanced-stat-card:hover .stat-icon {
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.2));
          }
          
          .stat-value {
            background: linear-gradient(135deg, #ffffff, #e2e8f0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .dark .stat-value {
            background: linear-gradient(135deg, #f8fafc, #e2e8f0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .trend-positive {
            color: #10b981;
            text-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
          }
          
          .trend-negative {
            color: #ef4444;
            text-shadow: 0 0 8px rgba(239, 68, 68, 0.3);
          }
          
          .glow-effect {
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(
              circle,
              rgba(120, 119, 198, 0.1) 0%,
              transparent 70%
            );
            opacity: 0;
            transition: opacity 0.4s ease;
            pointer-events: none;
          }
          
          .enhanced-stat-card:hover .glow-effect {
            opacity: 1;
          }
          
          .dark .glow-effect {
            background: radial-gradient(
              circle,
              rgba(168, 85, 247, 0.1) 0%,
              transparent 70%
            );
          }
        `}</style>
        
        <div
          ref={ref}
          className={cn("enhanced-stat-card rounded-2xl p-6", className)}
          {...props}
        >
          <div className="glow-effect" />
          
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold stat-value">{value}</p>
                {trend && (
                  <div className={cn(
                    "flex items-center text-xs font-medium",
                    trend.isPositive ? "trend-positive" : "trend-negative"
                  )}>
                    {trend.isPositive ? "+" : "-"}{trend.value}%
                  </div>
                )}
              </div>
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </div>
            
            <div className="stat-icon p-3 rounded-xl">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </>
    );
  }
);

EnhancedStatCard.displayName = "EnhancedStatCard";

export { EnhancedStatCard };
