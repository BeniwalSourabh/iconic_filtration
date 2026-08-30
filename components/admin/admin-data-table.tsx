import { Inbox } from "lucide-react";
import type { AdminColumn, AdminRow } from "@/data/admin-content";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";

export function AdminDataTable({
  columns,
  rows,
  emptyState,
}: {
  columns: AdminColumn[];
  rows: AdminRow[];
  emptyState?: string;
}) {
  if (!rows.length) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center shadow-soft">
        <Inbox className="mx-auto h-8 w-8 text-iconic-cyan" />
        <h2 className="mt-4 font-heading text-xl font-semibold text-iconic-navy">No records yet</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          {emptyState ?? "Records will appear here after the module has live database content."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-background text-xs uppercase text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-semibold">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row, index) => (
              <tr key={`${row[columns[0]?.key ?? "row"]}-${index}`} className="hover:bg-background/70">
                {columns.map((column) => {
                  const value = row[column.key] ?? "";
                  const isStatus = column.key === "status";

                  return (
                    <td key={column.key} className="px-4 py-4 align-top text-slate-700">
                      {isStatus ? <AdminStatusBadge>{value}</AdminStatusBadge> : value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
