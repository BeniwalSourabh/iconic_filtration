import type { RoleKey, UserStatus } from "@prisma/client";
import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      roles?: RoleKey[];
      status?: UserStatus;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    roles?: RoleKey[];
    status?: UserStatus;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    roles?: RoleKey[];
    status?: UserStatus;
  }
}

