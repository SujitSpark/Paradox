import { useState, useMemo } from 'react';
import { useCasesStore } from '../store/casesStore';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Sparkles,
  Trophy,
  Filter
} from 'lucide-react';
import { clsx } from 'clsx';

export default function SchedulesPage() {
  const cases = useCasesStore((s) => s.cases);
  const [viewDate, setViewDate] = useState(new Date(2024, 10, 1)); // Default to Nov 2024 for mock data
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'week' | 'month' | 'all'>('month');

  // Dynamic Date Calculations
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  const monthName = viewDate.toLocaleDateString('en-GB', { month: 'long' });

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get start offset (Mon=0, ..., Sun=6)
  // JS getDay() returns Sun=0, Mon=1, ..., Sat=6
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  // Derive which dates have cases
  const caseDates = useMemo(() => {
    const dates = new Set<string>();
    cases.forEach(c => dates.add(c.lastHearing));
    return dates;
  }, [cases]);

  // Get cases for the selected date
  const selectedDateCases = useMemo(() => {
    if (!selectedDate) return [];
    return cases.filter(c => c.lastHearing === selectedDate);
  }, [selectedDate, cases]);

  // Real "Today" for highlighting
  const realToday = new Date();
  const realTodayString = `${realToday.getFullYear()}-${String(realToday.getMonth() + 1).padStart(2, '0')}-${String(realToday.getDate()).padStart(2, '0')}`;

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(realTodayString);
  };

  const FILTERS = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'all', label: 'All Upcoming' }
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto pb-20">
      <div className="flex items-center justify-between border-b border-outline-variant/10 pb-8">
        <div className="space-y-1">
          <h1 className="text-5xl font-serif font-bold tracking-tight text-primary">Schedules</h1>
          <p className="text-on-surface/40 font-sans font-medium uppercase tracking-[0.2em] text-[10px] font-black">
            Judicial Calendar • Operational Hearing Matrix
          </p>
        </div>
        
        <button className="btn-primary flex items-center gap-2 group py-3 px-8 shadow-xl">
          <Sparkles className="w-4 h-4 text-secondary-fixed animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-widest">Generate Optimized Schedule</span>
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex bg-surface-container-low p-1 rounded-sm ring-1 ring-outline-variant/5">
          {FILTERS.map(f => (
            <button 
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={clsx(
                "px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all",
                activeFilter === f.id ? "bg-primary text-secondary-fixed shadow-sm" : "text-on-surface/40 hover:text-primary"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="h-6 w-[1px] bg-outline-variant/10 mx-2" />
        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface/40 hover:text-primary transition-colors">
          <Filter className="w-4 h-4" />
          Custom Range
        </button>
      </div>

      <div className="space-y-10">
        {/* Top Section: Compact Monthly Calendar View */}
        <div className="judicial-card border-none bg-surface-container-lowest/50 backdrop-blur-sm overflow-hidden ring-1 ring-outline-variant/5">
          <div className="flex items-center justify-between px-8 py-6 bg-surface-container-low/30 border-b border-outline-variant/5">
            <h3 className="font-serif text-2xl font-bold text-primary">{monthName} {currentYear}</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrevMonth}
                className="p-2 hover:bg-surface-container-high rounded-sm transition-colors text-on-surface/40 hover:text-primary"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleToday}
                className="px-3 py-1.5 hover:bg-surface-container-high rounded-sm transition-colors text-[10px] font-black uppercase tracking-widest text-primary"
              >
                Today
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-2 hover:bg-surface-container-high rounded-sm transition-colors text-on-surface/40 hover:text-primary"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7">
            {DAYS.map(day => (
              <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-[#00003c]/30 border-r border-b border-outline-variant/10 last:border-r-0">
                {day}
              </div>
            ))}
            {Array.from({ length: 42 }, (_, i) => {
              const day = i - startOffset + 1;
              const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const hasCases = caseDates.has(dateString);
              const isToday = dateString === realTodayString;
              const isSelected = dateString === selectedDate;
              const isInMonth = day > 0 && day <= daysInMonth;

              return (
                <div 
                  key={i} 
                  onClick={() => isInMonth && setSelectedDate(dateString)}
                  className={clsx(
                    "h-24 p-4 border-r border-b border-outline-variant/5 transition-all duration-300 relative group",
                    !isInMonth && "bg-surface-container-low/10 opacity-20 cursor-default",
                    isInMonth && "bg-transparent hover:bg-surface-container-low/40 cursor-pointer",
                    isSelected && "bg-surface-container-low/60 ring-2 ring-inset ring-primary/10 shadow-inner",
                    i % 7 === 6 && "border-r-0"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={clsx(
                      "text-sm font-mono font-bold transition-all",
                      isSelected ? "text-primary scale-110" : "text-on-surface/40",
                      isToday && "w-7 h-7 rounded-full ring-2 ring-primary bg-primary/5 flex items-center justify-center -m-1 font-black"
                    )}>
                      {isInMonth ? day : ''}
                    </span>
                    {isInMonth && hasCases && (
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-sm ring-1 ring-white/50" />
                    )}
                  </div>
                  {isInMonth && hasCases && (
                    <div className="mt-1">
                      <div className="text-[9px] font-black text-on-surface/20 uppercase tracking-tighter">
                        {cases.filter(c => c.lastHearing === dateString).length} Matters
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Section (Dynamic): Master Detail List */}
        <div className="animate-slide-up">
          {!selectedDate ? (
            <div className="judicial-card p-20 flex flex-col items-center justify-center text-center space-y-4 bg-surface-container-low/30 border border-dashed border-outline-variant/20 italic">
              <CalendarIcon className="w-12 h-12 text-on-surface/10 mb-2" />
              <p className="text-[11px] font-sans font-black uppercase tracking-[0.3em] text-on-surface/30">Click on a date to view scheduled cases</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-end justify-between px-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface/40">Docket for</span>
                  <h3 className="font-serif text-3xl font-bold text-primary">
                    {new Date(selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} – {new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long' })}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                   <Trophy className="w-5 h-5 text-secondary animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-[#00003c]/40">AI-Optimized Readiness: 98%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {selectedDateCases.length === 0 ? (
                   <div className="col-span-full p-12 text-center text-on-surface/20 text-sm italic font-serif">No hearings scheduled for this date.</div>
                ) : (
                  selectedDateCases.map((c, i) => (
                    <div key={i} className="judicial-card p-8 flex flex-col gap-6 group hover:translate-y-[-4px] transition-all duration-500 hover:shadow-2xl hover:bg-surface-container-low ring-1 ring-outline-variant/5">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <span className="font-mono text-[10px] font-bold text-on-surface/40 uppercase tracking-widest bg-surface-container-low px-2 py-1 rounded-sm">{c.id}</span>
                          <h4 className="font-serif text-xl font-bold text-primary leading-tight group-hover:text-secondary transition-colors line-clamp-1">{c.title}</h4>
                        </div>
                        <div className={clsx(
                          "px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-sm",
                          c.riskLevel === 'critical' ? "bg-red-50 text-red-600 ring-1 ring-red-100" : "bg-primary text-secondary-fixed"
                        )}>
                          {c.riskLevel}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-6 pt-6 border-t border-outline-variant/10">
                        <div className="space-y-1">
                          <span className="text-[9px] font-sans font-black uppercase tracking-widest text-[#00003c]/30">Type</span>
                          <p className="text-[11px] font-sans font-bold text-on-surface/70">{c.type}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-sans font-black uppercase tracking-widest text-[#00003c]/30">Priority Score</span>
                          <p className="text-[11px] font-mono font-black text-primary">{(c.priorityScore * 100).toFixed(0)}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-sans font-black uppercase tracking-widest text-[#00003c]/30">Time Slot</span>
                          <div className="flex items-center gap-1.5 text-secondary">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-sans font-bold uppercase tracking-tight">10:30 AM</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-on-surface/30" />
                          <span className="text-[11px] font-sans font-bold text-on-surface/40">Court Room No. 4, North Wing</span>
                        </div>
                        <span className={clsx(
                          "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ring-1 ring-inset",
                          c.status === 'Pending' ? "bg-amber-50 text-amber-700 ring-amber-100" : "bg-blue-50 text-blue-700 ring-blue-100"
                        )}>
                          {c.status}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-outline-variant/5">
                        <button className="w-full bg-surface-container-neutral py-3 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 hover:bg-primary hover:text-white transition-all shadow-sm">
                          Manage Procedural Memos
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
