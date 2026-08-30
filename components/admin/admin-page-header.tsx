import type { ReactNode } from "react";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase text-iconic-green">{eyebrow}</p>
        <h1 className="mt-2 font-heading text-4xl font-semibold text-iconic-navy">{title}</h1>
        {description ? <p className="mt-3 text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

