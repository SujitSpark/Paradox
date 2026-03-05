import { create } from 'zustand';

export interface CourtCase {
  case_id: string;
  case_title: string;
  case_type: string;
  filing_date: string;
  last_hearing: string;
  next_hearing: string;
  adjournments_count: number;
  court_name: string;
  district: string;
  judge_assigned: string;
  status: string;
  petitioner: string;
  respondent: string;
  age_days: number;
  priority_score: number;
  escalation_level: 'critical' | 'high' | 'medium' | 'low';
}

const CASE_TYPES = ['Criminal', 'Civil', 'Family', 'Revenue', 'Motor Accident', 'Labour', 'Writ Petition', 'Land Dispute'];
const COURTS = ['District Court, Delhi', 'Sessions Court, Mumbai', 'Civil Court, Bengaluru', 'Magistrate Court, Chennai', 'District Court, Kolkata', 'High Court Bench, Lucknow'];
const DISTRICTS = ['Central Delhi', 'South Mumbai', 'Bengaluru Urban', 'Chennai Central', 'Kolkata North', 'Lucknow'];
const JUDGES = ['Hon. Justice Sharma', 'Hon. Justice Reddy', 'Hon. Justice Patel', 'Hon. Justice Iyer', 'Hon. Justice Banerjee', 'Hon. Justice Singh'];
const STATUSES = ['Pending', 'Adjourned', 'Reserved', 'Part-Heard', 'Under Review'];

const TYPE_URGENCY: Record<string, number> = {
  Criminal: 90, 'Writ Petition': 85, Family: 75, 'Motor Accident': 70,
  Labour: 65, 'Land Dispute': 60, Civil: 50, Revenue: 40,
};

function randomDate(startYear: number, endYear: number): string {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  const d = new Date(start + Math.random() * (end - start));
  return d.toISOString().split('T')[0];
}

function generateCases(): CourtCase[] {
  const today = new Date();
  const cases: CourtCase[] = [];
  for (let i = 1; i <= 25; i++) {
    const caseType = CASE_TYPES[Math.floor(Math.random() * CASE_TYPES.length)];
    const filingDate = randomDate(2018, 2024);
    const lastHearing = randomDate(2024, 2025);
    const adjournments = Math.floor(Math.random() * 20) + 1;
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const ageDays = Math.floor((today.getTime() - new Date(filingDate).getTime()) / 86400000);

    const ageScore = Math.min((ageDays / 2500) * 100, 100);
    const typeScore = TYPE_URGENCY[caseType] || 50;
    const adjScore = Math.min((adjournments / 15) * 100, 100);
    const statusScore = status === 'Adjourned' ? 80 : status === 'Part-Heard' ? 60 : status === 'Reserved' ? 40 : 30;
    const priorityScore = Math.round(ageScore * 0.4 + typeScore * 0.3 + adjScore * 0.2 + statusScore * 0.1);

    const escalationLevel: CourtCase['escalation_level'] =
      priorityScore >= 80 ? 'critical' : priorityScore >= 60 ? 'high' : priorityScore >= 40 ? 'medium' : 'low';

    const idx = Math.floor(Math.random() * COURTS.length);
    cases.push({
      case_id: `IND/${2020 + (i % 5)}/C-${String(i).padStart(4, '0')}`,
      case_title: `State vs. Party ${String.fromCharCode(65 + (i % 26))}${i}`,
      case_type: caseType,
      filing_date: filingDate,
      last_hearing: lastHearing,
      next_hearing: randomDate(2025, 2026),
      adjournments_count: adjournments,
      court_name: COURTS[idx],
      district: DISTRICTS[idx],
      judge_assigned: JUDGES[Math.floor(Math.random() * JUDGES.length)],
      status,
      petitioner: `Petitioner ${String.fromCharCode(65 + (i % 26))}`,
      respondent: `Respondent ${String.fromCharCode(90 - (i % 26))}`,
      age_days: ageDays,
      priority_score: priorityScore,
      escalation_level: escalationLevel,
    });
  }
  return cases.sort((a, b) => b.priority_score - a.priority_score);
}

interface CasesState {
  cases: CourtCase[];
  selectedCase: CourtCase | null;
  selectCase: (c: CourtCase | null) => void;
}

export const useCasesStore = create<CasesState>((set) => ({
  cases: generateCases(),
  selectedCase: null,
  selectCase: (c) => set({ selectedCase: c }),
}));
