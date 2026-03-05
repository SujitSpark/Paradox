import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCasesStore } from '@/store/casesStore';
import { AlertTriangle, CheckCircle, Loader2, X, Zap } from 'lucide-react';
import { getAdjournmentHotspots } from '@/utils/adjournmentRisk';

const STEPS = [
  'Scanning case database...',
  'Analyzing delay patterns...',
  'Computing priority scores...',
  'Identifying escalation candidates...',
  'Analyzing adjournment patterns across similar cases...',
  'Generating adjournment risk predictions...',
  'Compiling urgent case report...',
];

export default function EscalationButton() {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const cases = useCasesStore((s) => s.cases);

  const urgentCases = cases.filter((c) => c.escalation_level === 'critical').slice(0, 5);
  const adjournmentHotspots = cases.length > 0 ? getAdjournmentHotspots(cases, 3) : [];

  const run = () => {
    setShowModal(true);
    setRunning(true);
    setDone(false);
    setStep(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= STEPS.length) {
        clearInterval(interval);
        setRunning(false);
        setDone(true);
      } else {
        setStep(current);
      }
    }, 900);
  };

  return (
    <>
      <button
        onClick={run}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity judicial-shadow-md"
      >
        <Zap className="w-4 h-4" />
        Run Proactive Escalation Watch
      </button>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 z-50"
              onClick={() => !running && setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-card rounded-xl judicial-shadow-lg w-full max-w-2xl p-6 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-primary" />
                    Escalation & Adjournment Analysis
                  </h2>
                  {!running && (
                    <button onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-muted">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>

                {running && (
                  <div className="space-y-3">
                    {STEPS.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: i <= step ? 1 : 0.3, x: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.3 }}
                        className="flex items-center gap-3 text-sm"
                      >
                        {i < step ? (
                          <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                        ) : i === step ? (
                          <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-border shrink-0" />
                        )}
                        <span className={i <= step ? 'text-foreground' : 'text-muted-foreground'}>{s}</span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {done && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    {/* Critical Cases */}
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-destructive">
                        🚨 Critical Cases: {urgentCases.length} requiring immediate attention
                      </p>
                      <div className="space-y-2">
                        {urgentCases.map((c) => (
                          <div key={c.case_id} className="flex items-center justify-between bg-background rounded-lg px-4 py-3 border border-border/50">
                            <div>
                              <p className="text-sm font-medium text-foreground">{c.case_id}</p>
                              <p className="text-xs text-muted-foreground">{c.case_type} · {c.age_days} days</p>
                            </div>
                            <span className="text-sm font-bold text-destructive">{c.priority_score}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Adjournment Hotspots */}
                    {adjournmentHotspots.length > 0 && (
                      <div className="space-y-2 border-t border-border pt-4">
                        <p className="text-sm font-semibold text-secondary">
                          🔥 Adjournment Hotspots: {adjournmentHotspots.length} high-risk cases
                        </p>
                        <p className="text-xs text-muted-foreground">
                          These cases show patterns of excessive adjournments and need preventive intervention.
                        </p>
                        <div className="space-y-2">
                          {adjournmentHotspots.map((c) => (
                            <div key={c.case_id} className="flex items-center justify-between bg-background rounded-lg px-4 py-3 border border-border/50">
                              <div>
                                <p className="text-sm font-medium text-foreground">{c.case_id}</p>
                                <p className="text-xs text-muted-foreground">
                                  {c.case_type} · {c.adjournments_count} adjourns · Risk: {c.adjRisk.riskPercentage}%
                                </p>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                c.adjRisk.riskLevel === 'critical' ? 'bg-destructive text-destructive-foreground' :
                                c.adjRisk.riskLevel === 'high' ? 'bg-secondary text-secondary-foreground' :
                                'bg-lavender text-foreground'
                              }`}>
                                {c.adjRisk.riskLevel}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-xs text-foreground">
                      ✓ Analysis complete. View detailed adjournment risk in Priority Table ("Adj Risk %" column) or click any case for full prevention memo.
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
