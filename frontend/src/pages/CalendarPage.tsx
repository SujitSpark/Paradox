import { useCasesStore } from '@/store/casesStore';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarPage() {
  const cases = useCasesStore((s) => s.cases);
  const upcoming = cases
    .filter((c) => c.next_hearing)
    .sort((a, b) => new Date(a.next_hearing!).getTime() - new Date(b.next_hearing!).getTime())
    .slice(0, 15);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Calendar / Schedule</h1>
        <p className="text-sm text-muted-foreground mt-1">Upcoming hearings and scheduled events</p>
      </div>

      <div className="bg-card rounded-xl border border-border/50 shadow-sm divide-y divide-border">
        {upcoming.length === 0 && (
          <p className="p-6 text-sm text-muted-foreground text-center">No upcoming hearings scheduled.</p>
        )}
        {upcoming.map((c) => (
          <div key={c.case_id} className="flex items-center gap-4 px-5 py-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <CalendarIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{c.case_id}</p>
              <p className="text-xs text-muted-foreground">{c.case_type} · {c.court_name}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-medium text-foreground">{c.next_hearing}</p>
              <p className="text-xs text-muted-foreground">Next Hearing</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
