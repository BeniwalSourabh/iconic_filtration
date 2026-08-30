import type { LucideIcon } from "lucide-react";

export function AdminStatCard({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <article className="rounded-lg border bg-card p-5 shadow-soft">
      <Icon className="h-6 w-6 text-iconic-cyan" />
      <p className="mt-5 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-2xl font-semibold text-iconic-navy">{value}</p>
    </article>
  );
}

