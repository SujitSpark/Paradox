import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { useCasesStore, CourtCase } from '@/store/casesStore';
import { ArrowUpDown } from 'lucide-react';

const col = createColumnHelper<CourtCase>();

const ESCALATION_STYLES: Record<string, string> = {
  critical: 'bg-destructive/15 text-destructive',
  high: 'bg-secondary/15 text-secondary',
  medium: 'bg-lavender/20 text-foreground',
  low: 'bg-muted text-muted-foreground',
};

export default function PriorityTable() {
  const cases = useCasesStore((s) => s.cases);
  const selectCase = useCasesStore((s) => s.selectCase);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'priority_score', desc: true }]);

  const columns = useMemo(
    () => [
      col.accessor('case_id', { header: 'Case ID', size: 140 }),
      col.accessor('case_type', { header: 'Type', size: 110 }),
      col.accessor('filing_date', { header: 'Filed', size: 100 }),
      col.accessor('age_days', { header: 'Age (days)', size: 90 }),
      col.accessor('adjournments_count', { header: 'Adj.', size: 60 }),
      col.accessor('priority_score', {
        header: 'Priority',
        size: 80,
        cell: (info) => (
          <span className="font-semibold">{info.getValue()}</span>
        ),
      }),
      col.accessor('escalation_level', {
        header: 'Level',
        size: 90,
        cell: (info) => {
          const val = info.getValue();
          return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${ESCALATION_STYLES[val]}`}>
              {val}
            </span>
          );
        },
      }),
      col.accessor('status', { header: 'Status', size: 100 }),
    ],
    []
  );

  const table = useReactTable({
    data: cases,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-card rounded-xl judicial-shadow-md border border-border/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-border bg-muted/40">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ width: header.getSize() }}
                  >
                    <span className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => selectCase(row.original)}
                className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
