import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  isCritical?: boolean;
}

export default function StatCard({ label, value, icon: Icon, trend, isCritical }: StatCardProps) {
  return (
    <div className="judicial-card p-6 flex flex-col gap-4 group hover:bg-surface-container-low transition-all duration-500 hover:-translate-y-1 border border-outline-variant/10">
      <div className="flex items-center justify-between">
        <div className="p-2.5 bg-surface-container-neutral rounded-sm group-hover:bg-primary transition-colors duration-500">
          <Icon className="w-5 h-5 text-primary group-hover:text-secondary-fixed transition-colors" />
        </div>
        {trend && (
          <span className={clsx(
            "text-[10px] font-sans font-black uppercase tracking-widest",
            isCritical ? "text-red-600 animate-pulse" : "text-on-surface/30"
          )}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-sans font-black tracking-[0.2em] uppercase text-on-surface/40 mb-1">{label}</p>
        <h3 className="text-3xl font-serif font-bold text-primary">{value}</h3>
      </div>
    </div>
  );
}
