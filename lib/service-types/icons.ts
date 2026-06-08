import type { LucideIcon } from "lucide-react";
import { Package, Plane, Ship, Train, Truck, Zap } from "lucide-react";

const ICON_BY_SLUG: Record<string, LucideIcon> = {
  air: Plane,
  sea: Ship,
  road: Truck,
  rail: Train,
  express: Zap,
  standard: Package,
};

export function iconForServiceSlug(slug: string): LucideIcon {
  return ICON_BY_SLUG[slug] ?? Package;
}
