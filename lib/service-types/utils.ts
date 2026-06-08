import type { ServiceTypeCatalog } from "@/lib/types/database";

export function slugifyServiceType(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/(^_+|_+$)/g, "")
    .slice(0, 48);
}

export function isValidServiceSlug(slug: string): boolean {
  return /^[a-z][a-z0-9_]{0,47}$/.test(slug);
}

export function sortServiceTypes(rows: ServiceTypeCatalog[]): ServiceTypeCatalog[] {
  return [...rows].sort((a, b) => a.sort_order - b.sort_order || a.label.localeCompare(b.label));
}
