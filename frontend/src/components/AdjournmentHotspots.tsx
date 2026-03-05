import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Users2, Clock } from 'lucide-react';
import { CourtCase, useCasesStore } from '@/store/casesStore';
import { getAdjournmentHotspots, getAdjournmentStats } from '@/utils/adjournmentRisk';

export default function AdjournmentHotspots() {
  const cases = useCasesStore((s) => s.cases);
  const selectCase = useCasesStore((s) => s.selectCase);

  if (cases.length === 0) {
    return null;
  }

  const hotspots = getAdjournmentHotspots(cases, 20);
  const stats = getAdjournmentStats(cases);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 judicial-shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase">High Risk Cases</span>
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.highRiskCases}</p>
          <p className="text-xs text-muted-foreground mt-1">{stats.highRiskPercentage}% of backlog</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 judicial-shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase">Avg Adjournments</span>
            <TrendingUp className="w-4 h-4 text-secondary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.averageAdjournments}</p>
          <p className="text-xs text-muted-foreground mt-1">per case overall</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 judicial-shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase">Exceeding Threshold</span>
            <Users2 className="w-4 h-4 text-lavender" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.casesExceedingThreshold}</p>
          <p className="text-xs text-muted-foreground mt-1">{stats.thresholdExceedanceRate}% over 8 adjourns</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 judicial-shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase">Max Adjournments</span>
            <Clock className="w-4 h-4 text-secondary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.maxAdjournments}</p>
          <p className="text-xs text-muted-foreground mt-1">highest in dataset</p>
        </div>
      </div>

      {/* Hotspots Table */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">🔥 Adjournment Hotspots (Top 20)</h3>
          <p className="text-sm text-muted-foreground">Cases at highest risk of further delays due to adjournment patterns</p>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden judicial-shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Case ID</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Age (days)</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Adj Count</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Risk %</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Level</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {hotspots.map((spot, i) => {
                  const riskColor =
                    spot.adjRisk.riskLevel === 'critical'
                      ? 'bg-destructive/10 hover:bg-destructive/15'
                      : spot.adjRisk.riskLevel === 'high'
                        ? 'bg-secondary/10 hover:bg-secondary/15'
                        : 'hover:bg-muted/30';

                  const riskBadge =
                    spot.adjRisk.riskLevel === 'critical'
                      ? 'bg-destructive text-destructive-foreground'
                      : spot.adjRisk.riskLevel === 'high'
                        ? 'bg-secondary text-secondary-foreground'
                        : spot.adjRisk.riskLevel === 'medium'
                          ? 'bg-lavender text-foreground'
                          : 'bg-primary text-primary-foreground';

                  return (
                    <motion.tr
                      key={spot.case_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`border-b border-border/50 cursor-pointer transition-colors ${riskColor}`}
                      onClick={() => selectCase(spot)}
                    >
                      <td className="px-4 py-3 font-semibold text-foreground">{spot.case_id}</td>
                      <td className="px-4 py-3 text-muted-foreground">{spot.case_type}</td>
                      <td className="px-4 py-3 text-muted-foreground">{spot.age_days}</td>
                      <td className="px-4 py-3 text-center font-semibold">{spot.adjournments_count}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${riskBadge}`}>
                          {spot.adjRisk.riskPercentage}%
                        </span>
                      </td>
                      <td className="px-4 py-3 capitalize">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          spot.adjRisk.riskLevel === 'critical' ? 'bg-destructive/15 text-destructive' :
                          spot.adjRisk.riskLevel === 'high' ? 'bg-secondary/15 text-secondary' :
                          spot.adjRisk.riskLevel === 'medium' ? 'bg-lavender/20 text-foreground' :
                          'bg-primary/10 text-primary'
                        }`}>
                          {spot.adjRisk.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectCase(spot);
                          }}
                          className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
                        >
                          View
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-foreground">📊 Key Insights</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-primary font-bold min-w-fit">1.</span>
            <p className="text-muted-foreground">
              <strong>{stats.casesExceedingThreshold}</strong> cases ({stats.thresholdExceedanceRate}%) exceed the 8-adjournment threshold, indicating systematic abuse of adjournment provisions.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary font-bold min-w-fit">2.</span>
            <p className="text-muted-foreground">
              Average case age for high-risk cases suggests older cases accumulate more adjournments. Recommend intensive hearing schedules for these 20 cases.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary font-bold min-w-fit">3.</span>
            <p className="text-muted-foreground">
              Critical-level cases need immediate strict listing orders. Consider contempt proceedings for counsel/party non-compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-primary" />
          Immediate Actions for Registrar
        </h4>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>✓ Pre-screen all hotspot cases; verify counsel readiness before hearing</li>
          <li>✓ Issue notices under court rules: counsel must appear or face costs</li>
          <li>✓ Auto-schedule witness summons via e-Courts integration</li>
          <li>✓ Flag critical cases (>12 adjourns) for judge review & possible dismissal</li>
          <li>✓ Generate compliance checklists for filing parties 7 days pre-hearing</li>
        </ul>
      </div>
    </motion.div>
  );
}
