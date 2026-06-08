import type { Organization } from "@/lib/types/database";

/** Client-safe display helper — never show internal slug "default" in UI */
export function organizationDisplayName(org: Organization | null | undefined): string {
  return org?.name?.trim() || "SwiftCargo";
}
