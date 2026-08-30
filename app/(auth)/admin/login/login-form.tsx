"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { ArrowRight, Loader2 } from "lucide-react";

export function AdminLoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-6">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);
          const formData = new FormData(event.currentTarget);
          const email = String(formData.get("email") ?? "");
          const password = String(formData.get("password") ?? "");

          startTransition(async () => {
            const result = await signIn("credentials", {
              email,
              password,
              redirect: false,
              callbackUrl: "/admin",
            });

            if (result?.ok) {
              window.location.href = result.url ?? "/admin";
              return;
            }

            setError("Invalid credentials or inactive admin account.");
          });
        }}
      >
        <label className="block text-sm font-medium text-foreground">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-2 h-11 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:border-iconic-cyan focus:shadow-focus"
          />
        </label>
        <label className="block text-sm font-medium text-foreground">
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            className="mt-2 h-11 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:border-iconic-cyan focus:shadow-focus"
          />
        </label>
        {error ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-iconic-navy disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Sign in <ArrowRight className="h-4 w-4" />
        </button>
      </form>
      {googleEnabled ? (
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/admin" })}
          className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-md border bg-white px-4 text-sm font-semibold text-iconic-blue transition hover:bg-cyan-50"
        >
          Continue with Google
        </button>
      ) : null}
    </div>
  );
}

