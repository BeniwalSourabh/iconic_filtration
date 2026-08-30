import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { canAccessAdmin } from "@/lib/auth/permissions";
import { brand } from "@/lib/design-system";
import { AdminLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const session = await getCurrentSession();

  if (session?.user && canAccessAdmin(session.user.roles)) {
    redirect("/admin");
  }

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[0.95fr_1.05fr]">
      <section className="hidden bg-iconic-navy p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="inline-flex items-center gap-3">
          <Image src={brand.logoPath} alt="ICONIC Filtration logo" width={64} height={64} className="rounded-md bg-white p-2" />
          <span className="font-heading text-xl font-semibold">ICONIC</span>
        </Link>
        <div>
          <p className="text-sm font-semibold uppercase text-iconic-cyan">Admin access</p>
          <h1 className="mt-4 max-w-xl font-heading text-5xl font-semibold leading-tight">
            Manage products, leads, content, SEO, and site settings securely.
          </h1>
          <p className="mt-5 max-w-lg text-slate-300">
            Phase 4 adds the authentication foundation. Database-backed users become active after setup and role assignment.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md rounded-lg border bg-card p-7 shadow-soft">
          <div className="mb-7 flex items-center gap-3 lg:hidden">
            <Image src={brand.logoPath} alt="ICONIC Filtration logo" width={52} height={52} className="rounded-md bg-white object-contain" />
            <span className="font-heading text-lg font-semibold text-iconic-navy">ICONIC Admin</span>
          </div>
          <p className="text-sm font-semibold uppercase text-iconic-green">Sign in</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold text-iconic-navy">Admin dashboard</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Use your active admin email and password. Google login appears automatically when OAuth keys are configured.
          </p>
          <AdminLoginForm googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)} />
        </div>
      </section>
    </main>
  );
}
