import EscalationButton from '@/components/EscalationButton';
import CaseDetailPanel from '@/components/CaseDetailPanel';
import AdjournmentHotspots from '@/components/AdjournmentHotspots';
import { useCasesStore } from '@/store/casesStore';

export default function EscalationPage() {
  const cases = useCasesStore((s) => s.cases);
  const selectCase = useCasesStore((s) => s.selectCase);
  const critical = cases.filter((c) => c.escalation_level === 'critical');
  const high = cases.filter((c) => c.escalation_level === 'high');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Escalation Watch</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor and trigger proactive escalation analysis</p>
        </div>
        <EscalationButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border/50 shadow-sm">
          <h3 className="text-sm font-semibold text-destructive mb-3">Critical Cases ({critical.length})</h3>
          <div className="space-y-2">
            {critical.map((c) => (
              <div
                key={c.case_id}
                onClick={() => selectCase(c)}
                className="flex items-center justify-between bg-background rounded-lg px-4 py-3 border border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{c.case_id}</p>
                  <p className="text-xs text-muted-foreground">{c.case_type} · {c.age_days} days</p>
                </div>
                <span className="text-sm font-bold text-destructive">{c.priority_score}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 border border-border/50 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-3">High Priority ({high.length})</h3>
          <div className="space-y-2">
            {high.map((c) => (
              <div
                key={c.case_id}
                onClick={() => selectCase(c)}
                className="flex items-center justify-between bg-background rounded-lg px-4 py-3 border border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{c.case_id}</p>
                  <p className="text-xs text-muted-foreground">{c.case_type} · {c.age_days} days</p>
                </div>
                <span className="text-sm font-bold text-foreground">{c.priority_score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEW: Adjournment Hotspots Section */}
      {cases && cases.length > 0 && (
        <div className="border-t border-border pt-6 mt-6">
          <AdjournmentHotspots />
        </div>
      )}

      {/* Case Detail Panel */}
      <CaseDetailPanel />
    </div>
  );
}
