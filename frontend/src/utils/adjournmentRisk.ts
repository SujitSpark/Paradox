import { CourtCase } from '@/store/casesStore';

export interface AdjournmentRiskScore {
  riskPercentage: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  preventiveActions: string[];
  score: number;
}

/**
 * Calculate adjournment risk for a single case
 * Based on: adjournments_count, age_days, case_type, escalation_level
 */
export const calculateAdjournmentRisk = (caseData: CourtCase, allCases: CourtCase[]): AdjournmentRiskScore => {
  const factors: string[] = [];
  let score = 0;

  // Factor 1: Historical adjournments (0-40 points)
  // Rules: >8 adjourns = high risk; >12 = very high
  if (caseData.adjournments_count > 12) {
    score += 40;
    factors.push(`${caseData.adjournments_count} adjournments (well above threshold)`);
  } else if (caseData.adjournments_count > 8) {
    score += 30;
    factors.push(`${caseData.adjournments_count} adjournments (above threshold)`);
  } else if (caseData.adjournments_count > 5) {
    score += 15;
    factors.push(`${caseData.adjournments_count} adjournments (elevated)`);
  }

  // Factor 2: Case age (0-30 points)
  // Older cases tend to accumulate more adjourns
  if (caseData.age_days > 1825) {
    // >5 years
    score += 30;
    factors.push(`Case age ${caseData.age_days} days (5+ years)`);
  } else if (caseData.age_days > 1095) {
    // >3 years
    score += 20;
    factors.push(`Case age ${caseData.age_days} days (3+ years)`);
  } else if (caseData.age_days > 365) {
    score += 10;
    factors.push(`Case age ${caseData.age_days} days (1+ year)`);
  }

  // Factor 3: Case type patterns (0-20 points)
  // Analyze case type from all cases to find high-risk types
  const caseTypeStats = allCases.reduce((acc, c) => {
    if (!acc[c.case_type]) {
      acc[c.case_type] = { total: 0, adjCount: 0, avgAdj: 0 };
    }
    acc[c.case_type].total += 1;
    acc[c.case_type].adjCount += c.adjournments_count;
    return acc;
  }, {} as Record<string, { total: number; adjCount: number; avgAdj: number }>);

  Object.keys(caseTypeStats).forEach((type) => {
    caseTypeStats[type].avgAdj = caseTypeStats[type].adjCount / caseTypeStats[type].total;
  });

  const caseTypeAvg = caseTypeStats[caseData.case_type]?.avgAdj || 5;
  if (caseData.adjournments_count > caseTypeAvg * 1.8) {
    score += 20;
    factors.push(`${caseData.case_type} cases avg ${caseTypeAvg.toFixed(1)} adjourns; this has ${caseData.adjournments_count}`);
  } else if (caseData.adjournments_count > caseTypeAvg * 1.3) {
    score += 10;
    factors.push(`Above average adjournments for ${caseData.case_type} type`);
  }

  // Factor 4: Escalation level (0-10 points)
  // Critical/high escalation + many adjourns = compounding risk
  if (caseData.escalation_level === 'critical' && caseData.adjournments_count > 5) {
    score += 10;
    factors.push('Critical escalation level with repeated adjournments');
  } else if (caseData.escalation_level === 'high' && caseData.adjournments_count > 8) {
    score += 5;
    factors.push('High escalation level with multiple adjournments');
  }

  // Normalize to 0-100
  const riskPercentage = Math.min(100, score);

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (riskPercentage >= 80) riskLevel = 'critical';
  else if (riskPercentage >= 60) riskLevel = 'high';
  else if (riskPercentage >= 40) riskLevel = 'medium';

  // Generate preventive actions based on risk factors
  const preventiveActions: string[] = [];

  if (caseData.adjournments_count > 12) {
    preventiveActions.push('🚨 ESCALATE: Notify senior judge. Case exceeds 12-adjournment threshold.');
    preventiveActions.push('📋 Issue strict listing order: Counsel must appear or face contempt proceedings.');
  } else if (caseData.adjournments_count > 8) {
    preventiveActions.push('⚠️ Flag for compliance review: Issue notice to counsel and parties.');
    preventiveActions.push('📞 Pre-hearing: Contact counsel 48h before to confirm readiness.');
  }

  if (caseData.age_days > 1825) {
    preventiveActions.push('⏰ Schedule intensive hearing schedule: Weekly/fortnightly sittings.');
  } else if (caseData.age_days > 1095) {
    preventiveActions.push('📅 Increase listing frequency: Move to fast-track docket.');
  }

  if (caseData.adjournments_count > 5 && caseData.escalation_level === 'critical') {
    preventiveActions.push('🔴 URGENT: Pre-schedule all required witnesses and documents now.');
    preventiveActions.push('✅ Draft adjournment denial memo (ready for judge signature).');
  }

  preventiveActions.push('📊 Generate compliance checklist: Ensure all parties have submitted required records.');

  return {
    riskPercentage,
    riskLevel,
    factors,
    preventiveActions: preventiveActions.slice(0, 4), // Top 4 actions
    score,
  };
};

/**
 * Identify top adjournment-risk cases in the dataset
 */
export const getAdjournmentHotspots = (cases: CourtCase[], limit = 20): Array<CourtCase & { adjRisk: AdjournmentRiskScore }> => {
  return cases
    .map((c) => ({
      ...c,
      adjRisk: calculateAdjournmentRisk(c, cases),
    }))
    .sort((a, b) => b.adjRisk.riskPercentage - a.adjRisk.riskPercentage)
    .slice(0, limit);
};

/**
 * Generate statistics about adjournment patterns
 */
export const getAdjournmentStats = (cases: CourtCase[]) => {
  const total = cases.length;
  const highRiskCount = cases.filter((c) => {
    const risk = calculateAdjournmentRisk(c, cases);
    return risk.riskLevel === 'high' || risk.riskLevel === 'critical';
  }).length;

  const avgAdjourns = cases.reduce((sum, c) => sum + c.adjournments_count, 0) / total;
  const maxAdjourns = Math.max(...cases.map((c) => c.adjournments_count));
  const casesOver8Adjourns = cases.filter((c) => c.adjournments_count > 8).length;

  return {
    totalCases: total,
    highRiskCases: highRiskCount,
    highRiskPercentage: Math.round((highRiskCount / total) * 100),
    averageAdjournments: avgAdjourns.toFixed(2),
    maxAdjournments: maxAdjourns,
    casesExceedingThreshold: casesOver8Adjourns,
    thresholdExceedanceRate: Math.round((casesOver8Adjourns / total) * 100),
  };
};
