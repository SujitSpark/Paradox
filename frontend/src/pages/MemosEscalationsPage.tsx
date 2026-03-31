import { useState } from 'react';
import { useCasesStore } from '../store/casesStore';
import { 
  FileText, 
  AlertCircle, 
  ArrowUpCircle, 
  CheckCircle2, 
  Clock, 
  MoreVertical,
  Download,
  ShieldCheck
} from 'lucide-react';
import { clsx } from 'clsx';

export default function MemosEscalationsPage() {
  const [activeTab, setActiveTab] = useState<'memos' | 'escalations'>('memos');
  const cases = useCasesStore((s) => s.cases);
  const escalatedCases = cases.filter(c => c.riskLevel === 'critical' || c.priorityScore > 0.85).slice(0, 8);

  const memos = [
    { title: "Statutory Analysis - Case #742", date: "14 Nov 2024", type: "Draft", size: "4.2 MB", author: "AI Analysis Unit" },
    { title: "Bench Brief - WP/2023/1042", date: "12 Nov 2024", type: "Final", size: "1.8 MB", author: "Registry Admin" },
    { title: "Risk Mitigation Protocol", date: "10 Nov 2024", type: "Internal", size: "2.1 MB", author: "The Magistrate" },
  ];

  return (
    <div className="space-y-10 animate-fade-in max-w-[1600px] mx-auto pb-20">
      <div className="flex flex-col gap-6 border-b border-outline-variant/10 pb-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-5xl font-serif font-bold tracking-tight text-primary">Memos & Escalations</h1>
            <p className="text-on-surface/40 font-sans font-medium uppercase tracking-[0.2em] text-[10px] font-black">
              Procedural Intelligence • Judicial Communication
            </p>
          </div>
          
          <button className="btn-primary flex items-center gap-2 py-2.5">
            <ArrowUpCircle className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">New Declaration</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-sm w-fit ring-1 ring-outline-variant/5">
          <button 
            onClick={() => setActiveTab('memos')}
            className={clsx(
              "px-8 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'memos' ? "bg-surface-container-highest text-primary shadow-sm" : "text-on-surface/40 hover:text-primary"
            )}
          >
            Legal Memos
          </button>
          <button 
            onClick={() => setActiveTab('escalations')}
            className={clsx(
              "px-8 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'escalations' ? "bg-red-50 text-red-600 shadow-sm ring-1 ring-red-100" : "text-on-surface/40 hover:text-red-500"
            )}
          >
            Escalations
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {activeTab === 'memos' ? (
          <div className="space-y-6">
            <h3 className="font-serif text-2xl font-bold text-primary px-2">Generated Briefs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memos.map((memo, i) => (
                <div key={i} className="judicial-card p-8 space-y-6 group hover:translate-y-[-4px] transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-surface-container-low flex items-center justify-center rounded-sm text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface/30">{memo.type}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-serif text-xl font-bold text-primary group-hover:text-secondary-fixed transition-colors">{memo.title}</h4>
                    <div className="flex items-center gap-3 text-[10px] font-sans font-bold text-on-surface/40 uppercase tracking-tight">
                      <Clock className="w-3 h-3" />
                      <span>Updated {memo.date}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-secondary-fixed" />
                      <span className="text-[10px] font-sans font-black text-on-surface/40 uppercase tracking-widest">{memo.author}</span>
                    </div>
                    <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                      <Download className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-serif text-2xl font-bold text-primary">Red Zone High Priority</h3>
              <div className="flex items-center gap-2 text-red-600 animate-pulse">
                <AlertCircle className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Immediate Action Required</span>
              </div>
            </div>
            
            <div className="judicial-card border-none bg-surface-container-lowest/30 backdrop-blur-sm overflow-hidden ring-1 ring-red-100/30">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-red-50/50 border-b border-red-100/50">
                    <th className="px-8 py-5 text-[10px] font-black text-red-700/50 uppercase tracking-[0.2em] w-[140px]">Case ID</th>
                    <th className="px-6 py-5 text-[10px] font-black text-red-700/50 uppercase tracking-[0.2em]">Escalation Reason</th>
                    <th className="px-6 py-5 text-[10px] font-black text-red-700/50 uppercase tracking-[0.2em] w-[160px]">Judge</th>
                    <th className="px-6 py-5 text-[10px] font-black text-red-700/50 uppercase tracking-[0.2em] w-[160px]">Status</th>
                    <th className="px-6 py-5 w-[60px]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100/20">
                  {escalatedCases.map((c) => (
                    <tr key={c.id} className="group hover:bg-red-50/30 transition-all cursor-pointer">
                      <td className="px-8 py-6">
                        <span className="font-mono text-[11px] font-bold text-red-800/40 tracking-wider bg-red-100/50 px-2 py-1 rounded-sm uppercase">{c.id}</span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-serif text-base font-bold text-primary group-hover:text-red-700 transition-colors line-clamp-1">{c.title}</span>
                          <span className="text-[10px] font-sans text-red-600/60 font-bold uppercase tracking-tight">Critical Delay Threshold Exceeded (840 Days)</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-[11px] font-sans font-bold text-primary/70">{c.judge}</span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                          <span className="text-[10px] font-sans font-black uppercase text-red-600 tracking-widest">Awaiting Directives</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <button className="p-2 hover:bg-red-100 rounded-sm transition-colors group/btn">
                          <MoreVertical className="w-4 h-4 text-red-300 group-hover/btn:text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
