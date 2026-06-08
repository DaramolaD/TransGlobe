import type { UserRole } from "@/lib/types/database";

export type { UserRole };

export const ROLE_LABELS: Record<UserRole, string> = {
  superadmin: "Super Admin",
  admin: "Admin",
  sales: "Sales",
  driver: "Driver",
  user: "Customer",
};

export const ROLE_HOME: Record<UserRole, string> = {
  superadmin: "/app/superadmin",
  admin: "/app/admin",
  sales: "/app/sales",
  driver: "/app/driver",
  user: "/app/portal",
};

export function canAccessPath(role: UserRole, pathname: string): boolean {
  if (role === "superadmin") return pathname.startsWith("/app");
  if (role === "admin")
    return (
      pathname.startsWith("/app/admin") ||
      pathname.startsWith("/app/portal") === false
    );
  if (role === "sales") return pathname.startsWith("/app/sales");
  if (role === "driver") return pathname.startsWith("/app/driver");
  if (role === "user") return pathname.startsWith("/app/portal");
  return false;
}

/** Internal workers (not portal customers) */
export const WORKER_ROLES: UserRole[] = ["superadmin", "admin", "sales", "driver"];

/** Ops team listed in Team tables — excludes platform super admins */
export const TEAM_DIRECTORY_ROLES: UserRole[] = ["admin", "sales", "driver"];

/** Users who can be assigned leads */
export const LEAD_ASSIGNEE_ROLES: UserRole[] = ["admin", "sales"];

export function isWorker(role: UserRole): boolean {
  return WORKER_ROLES.includes(role);
}

export function isCustomerRole(role: UserRole): boolean {
  return role === "user";
}

/** Back-office staff who manage operations (excludes drivers and sales) */
export function isStaff(role: UserRole): boolean {
  return role === "superadmin" || role === "admin";
}

export function isSales(role: UserRole): boolean {
  return role === "sales";
}

export function canManageLeads(role: UserRole): boolean {
  return role === "superadmin" || role === "admin";
}

export function canWorkLeads(role: UserRole): boolean {
  return canManageLeads(role) || isSales(role);
}

export function canManageCms(role: UserRole): boolean {
  return role === "superadmin" || role === "admin";
}

export const DEFAULT_ORG_SLUG = "default";
