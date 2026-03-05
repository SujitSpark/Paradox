import DashboardCards from '@/components/DashboardCards';
import EscalationButton from '@/components/EscalationButton';
import { useAuthStore } from '@/store/authStore';
import { useCasesStore } from '@/store/casesStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(0, 72%, 51%)', 'hsl(19, 22%, 39%)', 'hsl(261, 10%, 67%)', 'hsl(41, 12%, 81%)'];

export default function DashboardPage() {
  const role = useAuthStore((s) => s.role);
  const cases = useCasesStore((s) => s.cases);

  const byType = cases.reduce<Record<string, number>>((acc, c) => {
    acc[c.case_type] = (acc[c.case_type] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.entries(byType).map(([name, count]) => ({ name, count }));

  const byLevel = cases.reduce<Record<string, number>>((acc, c) => {
    acc[c.escalation_level] = (acc[c.escalation_level] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(byLevel).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Court backlog overview & priority insights</p>
        </div>
        {role === 'registrar' && <EscalationButton />}
      </div>

      <DashboardCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card rounded-xl p-5 judicial-shadow-md border border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-4">Cases by Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(19, 22%, 39%)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(19, 22%, 39%)' }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(19, 52%, 15%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-5 judicial-shadow-md border border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-4">Escalation Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
