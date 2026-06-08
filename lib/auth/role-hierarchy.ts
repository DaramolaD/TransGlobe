import type { UserRole } from "@/lib/types/database";

/**
 * Interim hierarchy before full RBAC: higher roles inherit capabilities of lower
 * internal roles. Customer (`user`) is a separate portal, not in this tree.
 */
export const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  superadmin: ["admin", "sales", "driver"],
  admin: ["sales"],
  sales: [],
  driver: [],
  user: [],
};

/** Numeric rank for comparisons (higher = more access). */
export const ROLE_RANK: Record<UserRole, number> = {
  superadmin: 100,
  admin: 80,
  sales: 50,
  driver: 40,
  user: 10,
};

/** All roles whose capabilities `role` inherits (direct + transitive). */
export function inheritedRoles(role: UserRole): UserRole[] {
  const seen = new Set<UserRole>();
  const queue = [...(ROLE_HIERARCHY[role] ?? [])];

  while (queue.length) {
    const next = queue.shift()!;
    if (seen.has(next)) continue;
    seen.add(next);
    queue.push(...(ROLE_HIERARCHY[next] ?? []));
  }

  return [...seen];
}

/** True when `actor` is the same role or sits above `target` in the hierarchy. */
export function roleIncludes(actor: UserRole, target: UserRole): boolean {
  if (actor === target) return true;
  return inheritedRoles(actor).includes(target);
}

export function isAtLeastRole(actor: UserRole, minimum: UserRole): boolean {
  return ROLE_RANK[actor] >= ROLE_RANK[minimum];
}
