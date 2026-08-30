import Link from "next/link";
import { ArrowRight, ClipboardList, Database, FileText, Package, ShieldCheck, Users } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { adminDashboardModules } from "@/data/admin-content";
import { requireAdminSession } from "@/lib/auth/session";

const cards = [
  { label: "Product Records", value: "19", icon: Package },
  { label: "Admin Modules", value: String(adminDashboardModules.length), icon: Database },
  { label: "Lead Forms", value: "2", icon: ClipboardList },
  { label: "Access Roles", value: "5", icon: Users },
];

const readiness = [
  "Auth.js protected admin layout",
  "Role-based access gate",
  "Database schema for all modules",
  "Public quote and contact forms",
  "Admin pages for catalog, content, media, leads, SEO, settings, and users",
];

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Secure admin"
        title="Dashboard"
        description={`Signed in as ${session.user?.email}. Admin workflows are protected by Auth.js and role checks.`}
        action={
          <div className="inline-flex w-fit items-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-semibold text-iconic-blue">
            <ShieldCheck className="h-4 w-4 text-iconic-green" />
            Roles: {session.user?.roles?.join(", ") || "none"}
          </div>
        }
      />

      <div className="mt-8 grid gap-5 md:grid-cols-4">
        {cards.map((card) => (
          <AdminStatCard key={card.label} {...card} />
        ))}
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase text-iconic-green">Modules</p>
              <h2 className="mt-2 font-heading text-2xl font-semibold text-iconic-navy">Management areas</h2>
            </div>
            <Link href="/admin/products" className="hidden items-center gap-2 text-sm font-semibold text-iconic-blue sm:inline-flex">
              Start with products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {adminDashboardModules.map((module) => (
              <Link
                key={module.href}
                href={module.href}
                className="rounded-lg border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-cyan-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-iconic-green">{module.eyebrow}</p>
                    <h3 className="mt-2 font-heading text-xl font-semibold text-iconic-navy">{module.title}</h3>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-iconic-cyan" />
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{module.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {module.metrics.slice(0, 2).map((metric) => (
                    <span key={metric.label} className="rounded-full border bg-background px-3 py-1 text-xs font-semibold text-slate-600">
                      {metric.label}: {metric.value}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <aside className="rounded-lg border bg-card p-5 shadow-soft">
          <FileText className="h-7 w-7 text-iconic-cyan" />
          <h2 className="mt-5 font-heading text-xl font-semibold text-iconic-navy">Phase 8 readiness</h2>
          <div className="mt-5 space-y-3">
            {readiness.map((item) => (
              <div key={item} className="flex gap-3 rounded-md border bg-background p-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-iconic-green" />
                <span className="text-sm font-medium leading-5 text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
