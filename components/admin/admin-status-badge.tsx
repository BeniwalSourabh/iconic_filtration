import { cn } from "@/lib/utils";

export function AdminStatusBadge({ children }: { children: string }) {
  const lowered = children.toLowerCase();
  const tone =
    lowered.includes("published") || lowered.includes("ready") || lowered.includes("active") || lowered.includes("live")
      ? "border-green-200 bg-green-50 text-green-700"
      : lowered.includes("pending") || lowered.includes("needed") || lowered.includes("draft") || lowered.includes("review")
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-slate-200 bg-slate-50 text-slate-700";

  return <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", tone)}>{children}</span>;
}
