import { create } from 'zustand';

export interface CourtCase {
  case_internal_id: number;
  case_id: string;
  case_number: string;
  filing_date: string;
  registration_date?: string;
  last_hearing_date?: string;
  next_hearing_date?: string;
  case_type: string;
  nature_of_case?: string;
  status: string;
  court_name: string;
  court_name_level?: string;
  district: string;
  state: string;
  petitioner_count: number;
  respondent_count: number;
  adjournments_count: number;
  age_days: number;
  priority_score: number;
  adj_risk_score: number;
  escalation_level: number;
}

interface CasesState {
  cases: CourtCase[];
  selectedCase: CourtCase | null;
  searchQuery: string;
  typeFilter: string | null;
  statusFilter: string | null;
  isLoading: boolean;
  error: string | null;
  
  fetchCases: () => Promise<void>;
  selectCase: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setTypeFilter: (type: string | null) => void;
  setStatusFilter: (status: string | null) => void;
  resetFilters: () => void;
}

export const useCasesStore = create<CasesState>((set) => ({

  cases: [],
  selectedCase: null,
  searchQuery: '',
  typeFilter: null,
  statusFilter: null,
  isLoading: false,
  error: null,

  fetchCases: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://127.0.0.1:8000/cases');
      if (!response.ok) throw new Error('Failed to fetch cases');
      const data = await response.json();
      set({ cases: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  selectCase: (id) => set((s) => ({ selectedCase: s.cases.find(c => c.case_id === id) || null })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setTypeFilter: (type) => set({ typeFilter: type }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  resetFilters: () => set({ searchQuery: '', typeFilter: null, statusFilter: null }),
}));
