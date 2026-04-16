import { clsx } from 'clsx';

interface Insight {
  title: string;
  detail: string;
  type: string;
}

interface InsightCardProps {
  insight: Insight;
}

export default function InsightCard({ insight }: InsightCardProps) {
  return (
    <div className="space-y-1 group/item cursor-default">
      <h4 className={clsx(
        "text-[10px] font-sans font-black uppercase tracking-widest transition-colors",
        insight.type === 'critical' ? 'text-secondary-fixed' : 'text-white/40 group-hover/item:text-white/60'
      )}>
        {insight.title}
      </h4>
      <p className="text-sm font-sans text-white/70 leading-relaxed group-hover/item:text-white transition-colors">
        {insight.detail}
      </p>
    </div>
  );
}
