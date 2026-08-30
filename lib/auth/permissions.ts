import type { RoleKey } from "@prisma/client";

export const roleRank: Record<RoleKey, number> = {
  VIEWER: 10,
  SALES: 20,
  EDITOR: 30,
  ADMIN: 40,
  SUPER_ADMIN: 50,
};

export const adminRoles = ["SUPER_ADMIN", "ADMIN", "EDITOR", "SALES", "VIEWER"] as const;

export function hasRole(userRoles: string[] | undefined, allowedRoles: readonly RoleKey[]) {
  if (!userRoles?.length) {
    return false;
  }

  return userRoles.some((role) => allowedRoles.includes(role as RoleKey));
}

export function hasMinimumRole(userRoles: string[] | undefined, minimumRole: RoleKey) {
  if (!userRoles?.length) {
    return false;
  }

  const minimumRank = roleRank[minimumRole];

  return userRoles.some((role) => {
    const rank = roleRank[role as RoleKey];
    return typeof rank === "number" && rank >= minimumRank;
  });
}

export function canAccessAdmin(userRoles: string[] | undefined) {
  return hasRole(userRoles, adminRoles);
}

