import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Zap, TrendingDown, Copy, Download } from 'lucide-react';
import { CourtCase } from '@/store/casesStore';
import { calculateAdjournmentRisk, AdjournmentRiskScore } from '@/utils/adjournmentRisk';
import { toast } from 'sonner';

interface AdjournmentRiskPanelProps {
  caseData: CourtCase;
  allCases: CourtCase[];
}

const getRiskColor = (level: string) => {
  const colors: Record<string, string> = {
    critical: 'text-destructive bg-destructive/10 border-destructive/30',
    high: 'text-secondary bg-secondary/10 border-secondary/30',
    medium: 'text-lavender bg-lavender/10 border-lavender/30',
    low: 'text-primary bg-primary/10 border-primary/30',
  };
  return colors[level] || colors.low;
};

const getRiskBadgeColor = (level: string) => {
  const colors: Record<string, string> = {
    critical: 'bg-destructive text-destructive-foreground',
    high: 'bg-secondary text-secondary-foreground',
    medium: 'bg-lavender text-foreground',
    low: 'bg-primary text-primary-foreground',
  };
  return colors[level] || colors.low;
};

export default function AdjournmentRiskPanel({ caseData, allCases }: AdjournmentRiskPanelProps) {
  const risk = calculateAdjournmentRisk(caseData, allCases);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const generateMemo = () => {
    const memo = `ADJOURNMENT RISK ASSESSMENT MEMO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Case ID: ${caseData.case_id}
Case Type: ${caseData.case_type}
Age: ${caseData.age_days} days (${(caseData.age_days / 365).toFixed(1)} years)
Historical Adjournments: ${caseData.adjournments_count}
Escalation Level: ${caseData.escalation_level.toUpperCase()}

RISK ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Risk Level: ${risk.riskLevel.toUpperCase()}
Risk Score: ${risk.riskPercentage}%

CONTRIBUTING FACTORS
${risk.factors.map((f) => `• ${f}`).join('\n')}

RECOMMENDED PREVENTIVE ACTIONS
${risk.preventiveActions.map((a) => `✓ ${a}`).join('\n')}

COMPLIANCE CHECKLIST
[  ] Verify all counsel contact information
[  ] Confirm witness availability 
[  ] Review case file for missing documents
[  ] Check if adjournment denial memo needed
[  ] Schedule pre-hearing status conference
[  ] Issue strict listing order if applicable

Generated: ${new Date().toLocaleString('en-IN')}
⚠️ For judicial review and action only.`;

    return memo;
  };

  const memo = generateMemo();

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-4"
    >
      {/* Risk Score Card */}
      <div className={`rounded-lg border-2 p-4 ${getRiskColor(risk.riskLevel)}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {risk.riskLevel === 'critical' && <AlertTriangle className="w-6 h-6" />}
            {risk.riskLevel === 'high' && <AlertTriangle className="w-6 h-6" />}
            {risk.riskLevel === 'medium' && <Zap className="w-6 h-6" />}
            {risk.riskLevel === 'low' && <CheckCircle2 className="w-6 h-6" />}
            <div>
              <h3 className="font-semibold">Adjournment Risk Assessment</h3>
              <p className="text-xs opacity-80">Based on historical patterns & case characteristics</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRiskBadgeColor(risk.riskLevel)}`}>
            {risk.riskPercentage}%
          </span>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-2">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-muted-foreground" />
          Risk Factors
        </h4>
        <div className="space-y-2">
          {risk.factors.map((factor, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary/60 mt-1">•</span>
              <span>{factor}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Preventive Actions */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          Recommended Preventive Actions
        </h4>
        <div className="space-y-2">
          {risk.preventiveActions.map((action, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-muted/30 p-2 rounded text-sm text-foreground"
            >
              <span className="text-primary font-bold min-w-fit">{i + 1}.</span>
              <span>{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => copyToClipboard(memo)}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Copy className="w-4 h-4" />
          Copy Memo
        </button>
        <button
          onClick={() => {
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(memo));
            element.setAttribute('download', `Adj_Risk_${caseData.case_id}.txt`);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            toast.success('Memo downloaded');
          }}
          className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      {/* Urgency Alert for Critical Cases */}
      {risk.riskLevel === 'critical' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-destructive/10 border-2 border-destructive rounded-lg p-3"
        >
          <p className="text-sm font-semibold text-destructive flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            CRITICAL: Immediate judicial intervention required
          </p>
          <p className="text-xs text-destructive/80 mt-1">
            This case has demonstrated a pattern of excessive adjournments. Consider issuing a strict listing order or dismissing frivolous applications.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
