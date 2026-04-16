import { useCasesStore } from '../store/casesStore';
import { useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { 
  AlertTriangle, 
  TrendingDown, 
  Lightbulb, 
  ChevronRight,
  Layers,
  Clock,
  Users
} from 'lucide-react';
import { clsx } from 'clsx';

export default function RiskAnalysisPage() {
  const { cases, preventionSuggestions, fetchInsights } = useCasesStore();
  
  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const highRiskCases = cases.filter(c => c.risk_level === 'CRITICAL' || c.risk_level === 'HIGH').slice(0, 6);

  const ICON_MAP: Record<string, any> = {
    'Lightbulb': Lightbulb,
    'Layers': Layers,
    'Clock': Clock,
    'Users': Users
  };

  const riskDistribution = [
    { name: 'Low', count: cases.filter(c => c.risk_level === 'LOW').length, color: '#f0ede8' },
    { name: 'Medium', count: cases.filter(c => c.risk_level === 'MEDIUM').length, color: '#e0e0ff' },
    { name: 'High', count: cases.filter(c => c.risk_level === 'HIGH').length, color: '#735c00' },
    { name: 'Critical', count: cases.filter(c => c.risk_level === 'CRITICAL').length, color: '#00003c' },
  ];

  return (
    <div className="space-y-10 animate-fade-in max-w-[1600px] mx-auto pb-20">
      <div className="flex flex-col gap-2 border-b border-outline-variant/10 pb-8">
        <h1 className="text-5xl font-serif font-bold tracking-tight text-primary">Risk Analysis</h1>
        <p className="text-on-surface/40 font-sans font-medium uppercase tracking-[0.2em] text-[10px] font-black">
          Predictive Justice • Registry Risk Assessment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Distribution Chart */}
        <div className="judicial-card p-8 space-y-8">
          <div className="flex items-center justify-between border-b border-outline-variant/5 pb-4">
            <h3 className="font-serif text-xl font-bold text-primary">Risk Distribution</h3>
            <span className="text-[10px] font-sans font-black text-on-surface/30 uppercase tracking-widest">Active Caseload</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistribution} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#767684' }} 
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#fcf9f4', border: 'none', boxShadow: '0 24px 48px -4px rgba(28, 28, 25, 0.06)', borderRadius: '2px' }}
                />
                <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-serif text-xl font-bold text-primary px-2">Prevention Suggestions</h3>
          <div className="space-y-4">
            {preventionSuggestions.length === 0 ? (
              <div className="judicial-card p-6 text-center italic text-on-surface/30">
                Analyzing registry for preventive opportunities...
              </div>
            ) : (
              preventionSuggestions.map((s, i) => {
                const Icon = ICON_MAP[s.icon] || Lightbulb;
                return (
                  <div key={i} className="judicial-card p-6 flex gap-6 group hover:translate-x-1 transition-all duration-300">
                    <div className="p-3 bg-surface-container-low rounded-sm group-hover:bg-primary transition-colors">
                      <Icon className="w-6 h-6 text-primary group-hover:text-secondary-fixed transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-sans font-black uppercase text-[11px] tracking-widest text-primary/80">{s.title}</h4>
                      <p className="font-sans text-sm text-on-surface/60 leading-relaxed">{s.detail}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* High Risk Cases List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-serif text-2xl font-bold text-primary">High-Risk Dossiers</h3>
          <button className="text-[10px] font-sans font-black text-primary/40 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1 group">
            Risk Analysis Report <TrendingDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highRiskCases.map((c) => (
              <div key={c.case_id} className="judicial-card p-6 space-y-6 group hover:bg-surface-container-low transition-colors border-l-2 border-l-transparent hover:border-l-primary">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] font-bold text-on-surface/30 uppercase tracking-tighter">Ref: {c.case_id}</span>
                    <h4 className="font-serif text-lg font-bold text-primary leading-tight line-clamp-2">{c.case_number}</h4>
                  </div>
                  <div className={clsx(
                    "p-2 rounded-sm",
                    c.risk_level === 'CRITICAL' ? "bg-red-50 text-red-600" : "bg-primary text-secondary-fixed"
                  )}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-outline-variant/10">
                  <div className="space-y-1">
                    <span className="text-[9px] font-sans font-black uppercase text-on-surface/30 tracking-widest">Type</span>
                    <p className="text-[11px] font-sans font-bold text-on-surface/70">{c.case_type}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-sans font-black uppercase text-on-surface/30 tracking-widest">Adjournments</span>
                    <p className="text-[11px] font-sans font-bold text-on-surface/70">{c.adjournments_count}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-sans font-black uppercase text-on-surface/30 tracking-widest">Priority</span>
                    <p className="text-[11px] font-sans font-bold text-on-surface/70">{(c.priority_score * 100).toFixed(0)}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-sans font-black uppercase text-on-surface/30 tracking-widest">Judge</span>
                    <p className="text-[11px] font-sans font-bold text-on-surface/70 truncate">{c.assigned_user_id || 'Unassigned'}</p>
                  </div>
                </div>
              
              <button className="w-full flex items-center justify-between group/btn text-[10px] font-sans font-black uppercase tracking-[0.2em] text-primary/40 hover:text-primary transition-all pt-2">
                Analyze Precedents
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
