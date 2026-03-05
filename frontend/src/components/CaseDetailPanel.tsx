import { useCasesStore } from '@/store/casesStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, User, AlertTriangle, FileText } from 'lucide-react';

export default function CaseDetailPanel() {
  const selectedCase = useCasesStore((s) => s.selectedCase);
  const selectCase = useCasesStore((s) => s.selectCase);

  return (
    <AnimatePresence>
      {selectedCase && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 z-40"
            onClick={() => selectCase(null)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-card border-l border-border z-50 overflow-y-auto judicial-shadow-lg"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-foreground">{selectedCase.case_id}</h2>
                <button
                  onClick={() => selectCase(null)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="bg-background rounded-lg p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Case Summary
                  </h3>
                  <p className="text-sm text-foreground font-medium">{selectedCase.case_title}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground">Type:</span> <span className="text-foreground">{selectedCase.case_type}</span></div>
                    <div><span className="text-muted-foreground">Status:</span> <span className="text-foreground">{selectedCase.status}</span></div>
                    <div><span className="text-muted-foreground">Petitioner:</span> <span className="text-foreground">{selectedCase.petitioner}</span></div>
                    <div><span className="text-muted-foreground">Respondent:</span> <span className="text-foreground">{selectedCase.respondent}</span></div>
                  </div>
                </div>

                <div className="bg-background rounded-lg p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Timeline
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground">Filed:</span> <span className="text-foreground">{selectedCase.filing_date}</span></div>
                    <div><span className="text-muted-foreground">Last Hearing:</span> <span className="text-foreground">{selectedCase.last_hearing}</span></div>
                    <div><span className="text-muted-foreground">Next Hearing:</span> <span className="text-foreground">{selectedCase.next_hearing}</span></div>
                    <div><span className="text-muted-foreground">Age:</span> <span className="text-foreground">{selectedCase.age_days} days</span></div>
                  </div>
                </div>

                <div className="bg-background rounded-lg p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Court Details
                  </h3>
                  <div className="text-sm space-y-1">
                    <div><span className="text-muted-foreground">Court:</span> <span className="text-foreground">{selectedCase.court_name}</span></div>
                    <div><span className="text-muted-foreground">District:</span> <span className="text-foreground">{selectedCase.district}</span></div>
                    <div><span className="text-muted-foreground">Judge:</span> <span className="text-foreground">{selectedCase.judge_assigned}</span></div>
                  </div>
                </div>

                <div className="bg-background rounded-lg p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Priority & Escalation
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-foreground">{selectedCase.priority_score}</p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                    <div className="text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        selectedCase.escalation_level === 'critical' ? 'bg-destructive/15 text-destructive' :
                        selectedCase.escalation_level === 'high' ? 'bg-secondary/15 text-secondary' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {selectedCase.escalation_level}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-foreground">{selectedCase.adjournments_count}</p>
                      <p className="text-xs text-muted-foreground">Adjournments</p>
                    </div>
                  </div>
                </div>

                <div className="bg-background rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" /> AI Memo (Mock)
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This case has been pending for {selectedCase.age_days} days with {selectedCase.adjournments_count} adjournments.
                    Given the case type ({selectedCase.case_type}) and current status ({selectedCase.status}),
                    proactive judicial intervention is recommended to prevent further delay.
                    Priority score of {selectedCase.priority_score}/100 suggests {selectedCase.escalation_level} urgency classification.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
