import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 text-center">
      <div className="max-w-md">
        <p className="text-sm font-semibold uppercase text-iconic-green">404</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold text-iconic-navy">Page not found</h1>
        <p className="mt-4 text-muted-foreground">The page you are looking for is not available yet.</p>
        <Link href="/" className="mt-8 inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground">
          Back to home
        </Link>
      </div>
    </main>
  );
}
