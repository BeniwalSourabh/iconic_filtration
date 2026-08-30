import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "blue" | "cyan" | "green" | "gold" | "dark";

const tones: Record<BadgeTone, string> = {
  blue: "border-blue-100 bg-blue-50 text-iconic-blue",
  cyan: "border-cyan-200 bg-cyan-50 text-iconic-blue",
  green: "border-green-100 bg-green-50 text-iconic-green",
  gold: "border-yellow-100 bg-yellow-50 text-yellow-800",
  dark: "border-white/15 bg-white/10 text-white",
};

export function Badge({ children, className, tone = "cyan" }: { children: ReactNode; className?: string; tone?: BadgeTone }) {
  return (
    <span className={cn("inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}

