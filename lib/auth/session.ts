import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/options";
import { canAccessAdmin } from "@/lib/auth/permissions";

export async function getCurrentSession() {
  return getServerSession(authOptions);
}

export async function requireAdminSession() {
  const session = await getCurrentSession();

  if (!session?.user || !canAccessAdmin(session.user.roles)) {
    redirect("/admin/login");
  }

  return session;
}

