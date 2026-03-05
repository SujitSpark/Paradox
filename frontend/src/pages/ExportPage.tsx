import { useCasesStore } from '@/store/casesStore';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export default function ExportPage() {
  const cases = useCasesStore((s) => s.cases);

  const exportCSV = () => {
    const headers = ['case_id', 'case_type', 'filing_date', 'age_days', 'priority_score', 'escalation_level', 'court_name', 'district'];
    const rows = cases.map((c) => headers.map((h) => (c as any)[h] ?? '').join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `justai_cases_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Export Current View</h1>
        <p className="text-sm text-muted-foreground mt-1">Download case data as CSV</p>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm space-y-4">
        <p className="text-sm text-muted-foreground">
          Export all <span className="font-semibold text-foreground">{cases.length}</span> cases with priority scores and escalation levels.
        </p>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          <Download className="w-4 h-4" />
          Export as CSV
        </button>
      </div>
    </div>
  );
}
