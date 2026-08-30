import Link from "next/link";
import { CheckCircle2, Database, Download, Plus, Search, SlidersHorizontal } from "lucide-react";
import type { AdminSection } from "@/data/admin-content";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export function AdminManagementPage({ section }: { section: AdminSection }) {
  return (
    <div>
      <AdminPageHeader
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-soft"
            >
              <Plus className="h-4 w-4" />
              {section.primaryAction}
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-white px-4 text-sm font-semibold text-iconic-blue"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {section.secondaryAction}
            </button>
          </div>
        }
      />

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {section.metrics.map((metric) => (
          <article key={metric.label} className="rounded-lg border bg-card p-5 shadow-soft">
            <Database className="h-5 w-5 text-iconic-cyan" />
            <p className="mt-4 text-xs font-semibold uppercase text-slate-500">{metric.label}</p>
            <p className="mt-1 font-heading text-2xl font-semibold text-iconic-navy">{metric.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{metric.helper}</p>
          </article>
        ))}
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-heading text-2xl font-semibold text-iconic-navy">Records</h2>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex h-10 items-center gap-2 rounded-md border bg-white px-3 text-sm text-slate-500">
                <Search className="h-4 w-4" />
                Search
              </div>
              <div className="flex h-10 items-center gap-2 rounded-md border bg-white px-3 text-sm text-slate-500">
                <Download className="h-4 w-4" />
                Export
              </div>
            </div>
          </div>
          <AdminDataTable columns={section.columns} rows={section.rows} emptyState={section.emptyState} />
        </div>

        <aside className="rounded-lg border bg-card p-5 shadow-soft">
          <h2 className="font-heading text-xl font-semibold text-iconic-navy">Workflow</h2>
          <div className="mt-5 space-y-3">
            {section.workflow.map((item, index) => (
              <div key={item} className="flex gap-3 rounded-md border bg-background p-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-xs font-semibold text-iconic-blue">
                  {index + 1}
                </div>
                <div className="flex min-w-0 items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-iconic-green" />
                  <span className="text-sm font-medium leading-5 text-slate-700">{item}</span>
                </div>
              </div>
            ))}
          </div>
          <Link href={section.href} className="mt-5 inline-flex text-sm font-semibold text-iconic-blue">
            Module route: {section.href}
          </Link>
        </aside>
      </section>
    </div>
  );
}
