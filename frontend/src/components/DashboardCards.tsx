import { useCasesStore } from '@/store/casesStore';
import { useAuthStore } from '@/store/authStore';
import { AlertTriangle, Clock, Scale, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const card = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.08, duration: 0.35 },
});

export default function DashboardCards() {
  const cases = useCasesStore((s) => s.cases);
  const role = useAuthStore((s) => s.role);

  const total = cases.length;
  const critical = cases.filter((c) => c.escalation_level === 'critical').length;
  const overThreeYears = cases.filter((c) => c.age_days > 1095).length;
  const avgScore = Math.round(cases.reduce((s, c) => s + c.priority_score, 0) / total);

  const kpis = [
    { label: 'Total Backlog', value: total, icon: Scale, color: 'text-primary' },
    { label: 'Critical Cases', value: critical, icon: AlertTriangle, color: 'text-destructive' },
    { label: 'Cases > 3 Years', value: overThreeYears, icon: Clock, color: 'text-secondary' },
    { label: 'Avg Priority Score', value: avgScore, icon: TrendingUp, color: 'text-lavender' },
  ];

  // Senior judge sees only high-level KPIs (all 4), registrar sees all too
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {kpis.map((kpi, i) => (
        <motion.div key={kpi.label} {...card(i)}>
          <div className="bg-card rounded-xl p-5 judicial-shadow-md border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{kpi.label}</span>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
