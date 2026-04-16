import { useCasesStore } from '../store/casesStore';
import { 
  XAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { TrendingUp, Scale, AlertCircle, Clock, ChevronRight, Zap, Loader2, PieChart as PieIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { useEffect } from 'react';
import JudicialLoader from '../components/JudicialLoader';
import StatCard from '../components/shared/StatCard';
import PriorityTable from '../components/shared/PriorityTable';
import InsightCard from '../components/shared/InsightCard';

const CHART_COLORS = ['#00003c', '#735c00', '#1c1c1c', '#4b5563', '#9ca3af', '#d1d5db'];

export default function DashboardPage() {
  const { 
    cases, fetchCases, fetchKPIs, kpis, selectCase, isLoading, 
    runAnalysis, agentLogs, fetchLogs, insights, fetchInsights, topCriticalCase 
  } = useCasesStore();

  useEffect(() => {
    fetchCases();
    fetchKPIs();
    fetchInsights();
    fetchLogs();
  }, [fetchCases, fetchKPIs, fetchInsights, fetchLogs]);

  if (isLoading && cases.length === 0) return <JudicialLoader />;

  const priorityCases = cases.filter(c => c.priority_score > 70);

  const stats = [
    { label: "Total Backlog", value: kpis?.total_cases.toLocaleString() || "0", icon: Scale, trend: kpis?.trends?.total || "+0.0%" },
    { label: "Critical Risk", value: kpis?.high_risk_cases || "0", icon: AlertCircle, trend: kpis?.trends?.risk || "Stable", isCritical: (kpis?.high_risk_cases || 0) > 0 },
    { label: "Avg. Priority", value: kpis?.avg_priority || "0.0", icon: Clock, trend: kpis?.trends?.priority || "Normal" },
    { label: "Memos Ready", value: kpis?.memos_ready || "0", icon: TrendingUp, trend: kpis?.trends?.memos || "Optimal" },
  ];

  const caseTypeData = Object.entries(
    cases.reduce((acc, curr) => {
      acc[curr.case_type] = (acc[curr.case_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-10 animate-fade-in max-w-[1600px] mx-auto pb-20 px-4 md:px-0">
      <div className="flex flex-col gap-2 border-b border-outline-variant/10 pb-8">
        <h1 className="text-5xl font-serif font-bold tracking-tight text-primary">Dashboard</h1>
        <p className="text-on-surface/40 font-sans font-medium uppercase tracking-[0.2em] text-[10px] font-black">
          Operational Intelligence • THE MODERN MAGISTRATE
        </p>
      </div>

      {/* Critical Case Spotlight */}
      {topCriticalCase && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="relative group overflow-hidden bg-primary rounded-sm p-1">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-fixed/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="judicial-card border-none bg-surface-container-highest/90 m-[1px] p-8 lg:p-12 flex flex-col lg:flex-row gap-12 items-center relative z-10">
              <div className="flex-1 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full animate-pulse">
                      Critical Risk Event
                    </span>
                    <span className="text-[10px] font-mono font-bold text-on-surface/40 uppercase tracking-tighter">
                      Ref: {topCriticalCase.case_id}
                    </span>
                  </div>
                  <h2 className="text-4xl lg:text-6xl font-serif font-bold text-primary leading-[1.1]">
                    {topCriticalCase.case_number}
                  </h2>
                  <p className="text-on-surface/60 font-sans text-lg max-w-2xl leading-relaxed italic">
                    This case has reached the 85th percentile for adjournment risk and requires immediate bench allocation or settlement review.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { label: "Risk Score", value: `${topCriticalCase.adj_risk_score.toFixed(0)}%`, color: "text-red-600" },
                    { label: "Adjournments", value: topCriticalCase.adjournments_count, color: "text-primary" },
                    { label: "Age", value: `${topCriticalCase.age_days} days`, color: "text-primary" },
                    { label: "Filing", value: new Date(topCriticalCase.filing_date).getFullYear(), color: "text-primary" },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-1">
                      <p className="text-[10px] font-sans font-black uppercase tracking-widest text-on-surface/30">{stat.label}</p>
                      <p className={clsx("text-2xl font-serif font-bold", stat.color)}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-[400px] space-y-6">
                <div className="p-6 bg-primary text-white space-y-4 shadow-2xl">
                  <h4 className="font-sans font-black uppercase text-[10px] tracking-widest text-secondary-fixed">Recommended Action</h4>
                  <p className="text-sm font-serif italic text-white/80 leading-relaxed">
                    "Group this petition with similar SLPs in the 2024 cause list to mitigate systemic delay."
                  </p>
                  <button 
                    onClick={() => selectCase(topCriticalCase.case_id)}
                    className="w-full bg-white text-primary py-3 text-[10px] font-black uppercase tracking-widest hover:bg-secondary-fixed transition-colors"
                  >
                    Initiate Deep Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
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
          
          <PriorityTable cases={priorityCases} onSelectCase={selectCase} />
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
                {insights.length === 0 ? (
                  <div className="py-4 text-center italic text-white/40 text-xs">Awaiting data analysis...</div>
                ) : (
                  insights.map((insight, i) => (
                    <InsightCard key={i} insight={insight} />
                  ))
                )}
              </div>
              
              <div className="pt-6">
                <button 
                  onClick={() => runAnalysis()}
                  disabled={isLoading}
                  className="w-full bg-secondary-fixed text-primary border border-secondary-fixed py-2.5 rounded-sm text-[10px] font-sans font-black uppercase tracking-[0.2em] hover:bg-white hover:text-primary transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-3 h-3 animate-spin"/> : <Zap className="w-3 h-3" />}
                  {isLoading ? 'Processing...' : 'Initiate Intelligence Pipeline'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Analysis BarChart */}
        <div className="judicial-card p-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant/5">
            <h3 className="font-serif text-xl font-bold text-primary">Active Caseload Risk Analysis</h3>
            <span className="text-[10px] font-sans font-black text-on-surface/30 uppercase tracking-widest">Simulation Agent Mapping</span>
          </div>
          <div className="h-[300px] w-full">
            {(() => {
              const riskData = [
                { category: 'Baseline Risk', count: cases.filter(c => c.adj_risk_score <= 40).length },
                { category: 'Elevated Risk', count: cases.filter(c => c.adj_risk_score > 40 && c.adj_risk_score <= 75).length },
                { category: 'Red Zone', count: cases.filter(c => c.adj_risk_score >= 80).length },
              ];
              return (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00003c" opacity={0.05} />
                    <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#767684', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: '#fcf9f4'}}
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderRadius: '4px' }}
                      itemStyle={{ color: '#00003c', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="count" fill="#00003c" radius={[4, 4, 0, 0]} barSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
          </div>
        </div>

        {/* Case Type Circular Chart */}
        <div className="judicial-card p-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant/5">
            <h3 className="font-serif text-xl font-bold text-primary">Case Composition</h3>
            <div className="flex items-center gap-2">
              <PieIcon className="w-3 h-3 text-secondary-fixed" />
              <span className="text-[10px] font-sans font-black text-on-surface/30 uppercase tracking-widest">Type-Based Distribution</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={caseTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {caseTypeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fcf9f4', border: 'none', borderRadius: '4px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#00003c', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-[10px] font-sans font-black uppercase text-on-surface/60 tracking-wider ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Agent Activity Log */}
      <div className="judicial-card p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/5">
          <div className="flex items-center gap-3">
            <h3 className="font-serif text-xl font-bold text-primary">Agent Intelligence Log</h3>
            <span className="animate-pulse w-2 h-2 rounded-full bg-secondary-fixed shadow-[0_0_8px_rgba(115,92,0,0.5)]"></span>
          </div>
          <span className="text-[10px] font-sans font-black text-on-surface/30 uppercase tracking-widest">Real-time Pipeline Audit</span>
        </div>
        
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {agentLogs.length === 0 ? (
            <div className="py-12 text-center italic font-serif text-on-surface/30 border border-dashed border-outline-variant/20 rounded-sm">
              No recent agent activity recorded. Initiate pipeline to begin.
            </div>
          ) : (
            agentLogs.map((log) => (
              <div key={log.log_id} className="flex gap-6 items-start p-4 hover:bg-surface-container-low/50 rounded-sm transition-colors border border-transparent hover:border-outline-variant/5 group">
                <div className="flex flex-col items-center gap-2 pt-1">
                  <div className="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                  <div className="w-[1px] h-full bg-outline-variant/10 min-h-[30px]" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-sans font-black uppercase tracking-widest text-secondary-fixed">{log.agent_name}</span>
                    <span className="text-[9px] font-mono font-bold text-on-surface/30">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <h4 className="font-serif text-sm font-bold text-primary">{log.action}</h4>
                  <p className="text-xs font-sans text-on-surface/60 italic leading-relaxed">
                    {log.result_summary}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
