import type { FacilityTypeCatalog } from "@/lib/types/database";

export function slugifyFacilityType(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/(^_+|_+$)/g, "")
    .slice(0, 48);
}

export function isValidFacilityTypeSlug(slug: string): boolean {
  return /^[a-z][a-z0-9_]{0,47}$/.test(slug);
}

export function sortFacilityTypes(rows: FacilityTypeCatalog[]): FacilityTypeCatalog[] {
  return [...rows].sort(
    (a, b) => a.sort_order - b.sort_order || a.label.localeCompare(b.label)
  );
}

export function facilityTypeLabel(
  slug: string,
  catalog: FacilityTypeCatalog[]
): string {
  return catalog.find((t) => t.slug === slug)?.label ?? slug.replace(/_/g, " ");
}
