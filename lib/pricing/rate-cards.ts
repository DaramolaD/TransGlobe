import type { ServiceType } from "@/lib/types/database";

export type RateCardRow = {
  service_type: ServiceType | string;
  price_per_kg: number;
  min_charge?: number | null;
  name?: string | null;
};

const DELIVERY_DAYS: Record<string, string> = {
  air: "2-5 days",
  sea: "15-30 days",
  road: "3-7 days",
  rail: "5-10 days",
  express: "1-3 days",
  standard: "5-10 days",
};

const FALLBACK_RATES: RateCardRow[] = [
  { service_type: "air", price_per_kg: 15, min_charge: 0, name: "Air Freight" },
  { service_type: "sea", price_per_kg: 3, min_charge: 0, name: "Sea Freight" },
  { service_type: "road", price_per_kg: 8, min_charge: 0, name: "Road Freight" },
  { service_type: "rail", price_per_kg: 5, min_charge: 0, name: "Rail Freight" },
];

export function deliveryTimeForService(
  serviceType: string,
  hints?: Record<string, string | null | undefined>
): string {
  const hint = hints?.[serviceType];
  if (hint?.trim()) return hint.trim();
  return DELIVERY_DAYS[serviceType] ?? "5-10 days";
}

export function findRateCard(
  rates: RateCardRow[],
  serviceType: string
): RateCardRow | undefined {
  return rates.find((r) => r.service_type === serviceType);
}

/** Weight-based line amount before package/insurance/express multipliers */
export function baseFreightAmount(
  weightKg: number,
  serviceType: string,
  rates: RateCardRow[]
): { amount: number; serviceName: string } | null {
  const rate = findRateCard(rates, serviceType);
  if (!rate || weightKg <= 0) return null;

  const perKg = Number(rate.price_per_kg);
  const min = Number(rate.min_charge) || 0;
  const raw = weightKg * perKg;
  const amount = Math.round(Math.max(raw, min) * 100) / 100;
  const serviceName =
    rate.name?.trim() ||
    serviceType.charAt(0).toUpperCase() + serviceType.slice(1) + " Freight";

  return { amount, serviceName };
}

export function fallbackRates(): RateCardRow[] {
  return FALLBACK_RATES;
}
