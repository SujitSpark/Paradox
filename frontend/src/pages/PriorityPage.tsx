import PriorityTable from '@/components/PriorityTable';
import CaseDetailPanel from '@/components/CaseDetailPanel';

export default function PriorityPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Priority Queue</h1>
        <p className="text-sm text-muted-foreground mt-1">Click any row to view case details</p>
      </div>
      <PriorityTable />
      <CaseDetailPanel />
    </div>
  );
}
