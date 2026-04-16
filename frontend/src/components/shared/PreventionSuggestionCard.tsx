import { LucideIcon, Lightbulb } from 'lucide-react';

interface Suggestion {
  title: string;
  detail: string;
  icon?: string;
}

interface PreventionSuggestionCardProps {
  suggestion: Suggestion;
  iconMap: Record<string, LucideIcon>;
}

export default function PreventionSuggestionCard({ suggestion, iconMap }: PreventionSuggestionCardProps) {
  const Icon = iconMap[suggestion.icon || ''] || Lightbulb;
  
  return (
    <div className="judicial-card p-6 flex gap-6 group hover:translate-x-1 transition-all duration-300 border border-outline-variant/10">
      <div className="p-3 bg-surface-container-low rounded-sm group-hover:bg-primary transition-colors">
        <Icon className="w-6 h-6 text-primary group-hover:text-secondary-fixed transition-colors" />
      </div>
      <div className="space-y-1">
        <h4 className="font-sans font-black uppercase text-[11px] tracking-widest text-primary/80">{suggestion.title}</h4>
        <p className="font-sans text-sm text-on-surface/60 leading-relaxed">{suggestion.detail}</p>
      </div>
    </div>
  );
}
