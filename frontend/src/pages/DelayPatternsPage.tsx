import { useCasesStore } from '@/store/casesStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';

export default function DelayPatternsPage() {
  const cases = useCasesStore((s) => s.cases);

  // Group by case_type and compute average age
  const byType = cases.reduce<Record<string, { total: number; count: number }>>((acc, c) => {
    if (!acc[c.case_type]) acc[c.case_type] = { total: 0, count: 0 };
    acc[c.case_type].total += c.age_days;
    acc[c.case_type].count += 1;
    return acc;
  }, {});
  const avgAgeData = Object.entries(byType).map(([name, { total, count }]) => ({
    name,
    avg_days: Math.round(total / count),
  }));

  // Adjournment distribution
  const adjBuckets = [
    { label: '0–5', min: 0, max: 5 },
    { label: '6–15', min: 6, max: 15 },
    { label: '16–30', min: 16, max: 30 },
    { label: '30+', min: 31, max: Infinity },
  ];
  const adjData = adjBuckets.map((b) => ({
    name: b.label,
    count: cases.filter((c) => c.adjournments_count >= b.min && c.adjournments_count <= b.max).length,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Delay Patterns</h1>
        <p className="text-sm text-muted-foreground mt-1">Analyze bottlenecks and adjournment trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card rounded-xl p-5 border border-border/50 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Average Case Age by Type (days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={avgAgeData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="avg_days" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-5 border border-border/50 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Adjournment Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={adjData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
