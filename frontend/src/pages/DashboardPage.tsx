import { useCasesStore } from '../store/casesStore';
import { XAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Scale, AlertCircle, Clock, ChevronRight, Zap, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { useEffect } from 'react';

const INSIGHTS = [
  { title: "Backlog Surge", detail: "Civil cases in Zone 4 increased by 15% this week.", type: "warning" },
  { title: "Efficiency Gain", detail: "Avg. hearing duration decreased by 8 min for Writ petitions.", type: "success" },
  { title: "Risk Alert", detail: "3 High-risk cases are approaching the 2-year delay threshold.", type: "critical" },
];

export default function DashboardPage() {
  const { cases, fetchCases, selectCase, isLoading } = useCasesStore();

  
  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  if (isLoading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-4 text-primary">
        <Loader2 className="w-12 h-12 animate-spin text-primary/20" />
        <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Synchronizing Records...</span>
      </div>
    </div>
  );

  const priorityCases = cases.filter(c => c.priority_score > 0.8).slice(0, 5);

  const stats = [
    { label: "Total Backlog", value: cases.length.toLocaleString(), icon: Scale, trend: "+2.4%" },
    { label: "Critical Risk", value: cases.filter(c => c.adj_risk_score > 70).length, icon: AlertCircle, trend: "High Priority" },
    { label: "Avg. Resolution", value: "842 Days", icon: Clock, trend: "-12d" },
    { label: "Registry Score", value: "94.2", icon: TrendingUp, trend: "Optimal" },
  ];


  return (
    <div className="space-y-10 animate-fade-in max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-2 border-b border-outline-variant/10 pb-8">
        <h1 className="text-5xl font-serif font-bold tracking-tight text-primary">Dashboard</h1>
        <p className="text-on-surface/40 font-sans font-medium uppercase tracking-[0.2em] text-[10px] font-black">
          Operational Intelligence • The Modern Magistrate
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="judicial-card p-6 flex flex-col gap-4 group hover:bg-surface-container-low transition-all duration-500 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-surface-container-neutral rounded-sm group-hover:bg-primary transition-colors duration-500">
                <s.icon className="w-5 h-5 text-primary group-hover:text-secondary-fixed transition-colors" />
              </div>
              <span className="text-[10px] font-sans font-black text-on-surface/30 uppercase tracking-widest">{s.trend}</span>
            </div>
            <div>
              <p className="text-[10px] font-sans font-black tracking-[0.2em] uppercase text-on-surface/40 mb-1">{s.label}</p>
              <h3 className="text-3xl font-serif font-bold text-primary">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Priority Queue Table */}
        <div className="lg:col-span-2 judicial-card p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant/5">
            <div className="flex items-center gap-3">
              <h3 className="font-serif text-xl font-bold text-primary">Priority Registry</h3>
              <span className="px-2 py-0.5 bg-secondary-container text-secondary text-[9px] font-black uppercase rounded-[2px]">Urgent</span>
            </div>
            <Link to="/priority-queue" className="text-[10px] font-sans font-black text-primary/40 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1 group">
              View Full Queue <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans">
              <thead>
                <tr className="border-b border-outline-variant/10 text-[10px] uppercase font-black tracking-widest text-on-surface/30">
                  <th className="pb-4 pt-2 px-1">Case ID</th>
                  <th className="pb-4 pt-2">Case Title</th>
                  <th className="pb-4 pt-2">Category</th>
                  <th className="pb-4 pt-2 text-right">Risk Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {priorityCases.map((c) => (
                  <tr key={c.case_id} className="group hover:bg-surface-container-low transition-colors cursor-pointer" onClick={() => selectCase(c.case_id)}>
                    <td className="py-4 px-1 text-xs font-mono text-on-surface/40 group-hover:text-primary">#{c.case_id}</td>
                    <td className="py-4 font-serif text-sm font-bold text-primary">{c.case_number}</td>
                    <td className="py-4">
                      <span className="text-[10px] uppercase font-bold tracking-tight text-on-surface/60 px-2 py-1 bg-surface-container-neutral rounded-sm">{c.case_type}</span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="font-mono text-sm font-bold text-tertiary">{(c.priority_score * 100).toFixed(0)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="space-y-6">
          <div className="judicial-card p-8 bg-primary text-white h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <Zap className="w-5 h-5 text-secondary-fixed" />
                <h3 className="font-serif text-xl font-bold">Quick Insights</h3>
              </div>
              
              <div className="space-y-6">
                {INSIGHTS.map((insight, i) => (
                  <div key={i} className="space-y-1 group/item cursor-default">
                    <h4 className={clsx(
                      "text-[10px] font-sans font-black uppercase tracking-widest",
                      insight.type === 'critical' ? 'text-secondary-fixed' : 'text-white/40'
                    )}>
                      {insight.title}
                    </h4>
                    <p className="text-sm font-sans text-white/70 leading-relaxed group-hover/item:text-white transition-colors">
                      {insight.detail}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="pt-6">
                <button className="w-full bg-white/5 border border-white/10 py-2.5 rounded-sm text-[10px] font-sans font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-[0.98]">
                  Generate AI Brief
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registry Flow Analysis (Compact) */}
      <div className="judicial-card p-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant/5">
          <h3 className="font-serif text-xl font-bold text-primary">Registry Flow Analysis</h3>
          <span className="text-[10px] font-sans font-black text-on-surface/30 uppercase tracking-widest">Year-to-Date Performance</span>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={Array.from({ length: 12 }, (_, i) => ({ month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i], value: 200 + Math.random() * 300 }))}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00003c" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#00003c" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#767684', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fcf9f4', border: 'none', boxShadow: '0 24px 48px -4px rgba(28, 28, 25, 0.06)', borderRadius: '2px' }}
                itemStyle={{ color: '#00003c', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="value" stroke="#00003c" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
