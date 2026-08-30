import type { NextAuthOptions } from "next-auth";
import type { RoleKey } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { z } from "zod";
import { getPrisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";

type RoleAssignmentWithRole = {
  role: {
    key: RoleKey;
  };
};

const credentialsSchema = z.object({
  email: z.string().email().transform((email) => email.toLowerCase()),
  password: z.string().min(8).max(128),
});

function getAuthAdapter() {
  if (!process.env.DATABASE_URL) {
    return undefined;
  }

  return PrismaAdapter(getPrisma());
}

function getProviders() {
  const providers: NextAuthOptions["providers"] = [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!process.env.DATABASE_URL) {
          throw new Error("Database is not configured.");
        }

        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const prisma = getPrisma();
        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          include: {
            roleAssignments: {
              include: { role: true },
            },
          },
        });

        if (!user || user.status !== "ACTIVE" || !user.passwordHash) {
          return null;
        }

        const validPassword = await verifyPassword(parsed.data.password, user.passwordHash);

        if (!validPassword) {
          return null;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          roles: user.roleAssignments.map(
            (assignment: RoleAssignmentWithRole) => assignment.role.key,
          ),
          status: user.status,
        };
      },
    }),
  ];

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: false,
      }),
    );
  }

  return providers;
}

export const authOptions: NextAuthOptions = {
  adapter: getAuthAdapter(),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: getProviders(),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles ?? [];
        token.status = user.status;
        return token;
      }

      if (!token.email || !process.env.DATABASE_URL) {
        return token;
      }

      const dbUser = await getPrisma().user.findUnique({
        where: { email: token.email },
        include: {
          roleAssignments: {
            include: { role: true },
          },
        },
      });

      token.id = dbUser?.id ?? token.id;
      token.roles =
        dbUser?.roleAssignments.map((assignment: RoleAssignmentWithRole) => assignment.role.key) ??
        [];
      token.status = dbUser?.status;

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.roles = token.roles ?? [];
        session.user.status = token.status;
      }

      return session;
    },
    async signIn({ user, account }) {
      if (!process.env.DATABASE_URL) {
        return false;
      }

      if (account?.provider === "google" && user.email) {
        const dbUser = await getPrisma().user.findUnique({
          where: { email: user.email.toLowerCase() },
          select: { status: true },
        });

        return dbUser?.status === "ACTIVE";
      }

      return true;
    },
  },
  events: {
    async signIn({ user, account }) {
      if (!process.env.DATABASE_URL) {
        return;
      }

      await getPrisma().auditLog.create({
        data: {
          actorId: user.id,
          action: "auth.sign_in",
          entityType: "User",
          entityId: user.id,
          metadata: {
            provider: account?.provider ?? "unknown",
          },
        },
      });
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
};
