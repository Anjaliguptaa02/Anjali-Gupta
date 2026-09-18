import React from "react";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
  badge?: string;
  badgeColor?: string;
  onClick?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-indigo-600 dark:text-indigo-400",
  bgColor = "bg-indigo-50 dark:bg-indigo-950/50",
  badge,
  badgeColor = "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
  onClick,
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all dark:border-slate-800 dark:bg-slate-900 ${
        onClick ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {value}
            </span>
            {badge && (
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bgColor} ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};
