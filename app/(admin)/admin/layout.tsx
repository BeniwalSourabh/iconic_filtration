import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BookOpenText,
  ClipboardList,
  Download,
  FileQuestion,
  FileSearch,
  GalleryHorizontal,
  Gauge,
  Images,
  Inbox,
  LayoutDashboard,
  MessageSquareQuote,
  Newspaper,
  Package,
  PanelsTopLeft,
  SearchCheck,
  Settings,
  Tags,
  Users,
} from "lucide-react";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { adminNavigation } from "@/lib/design-system";
import { requireAdminSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const iconMap: Record<string, LucideIcon> = {
  Dashboard: LayoutDashboard,
  Products: Package,
  Categories: Tags,
  Industries: PanelsTopLeft,
  Projects: GalleryHorizontal,
  "Case Studies": BookOpenText,
  Blogs: Newspaper,
  FAQs: FileQuestion,
  Gallery: Images,
  Certificates: BadgeCheck,
  Downloads: Download,
  Testimonials: MessageSquareQuote,
  "Quote Requests": ClipboardList,
  "Contact Enquiries": Inbox,
  SEO: SearchCheck,
  Settings,
  Users,
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminSession();

  return (
    <main className="min-h-screen bg-iconic-navy text-white">
      <div className="grid min-h-screen md:grid-cols-[280px_1fr]">
        <aside className="border-r border-white/10 bg-black/12 p-5 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-iconic-cyan text-iconic-navy">
              <Gauge className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-heading text-lg font-semibold">ICONIC Admin</span>
              <span className="block truncate text-xs text-slate-300">{session.user?.email}</span>
            </span>
          </Link>
          <nav className="mt-8 space-y-1">
            {adminNavigation.map((item) => {
              const Icon = iconMap[item.label] ?? FileSearch;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-8">
            <SignOutButton />
          </div>
        </aside>
        <section className="bg-background text-foreground">
          <div className="mx-auto max-w-[1280px] p-6 md:p-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
