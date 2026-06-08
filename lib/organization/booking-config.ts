import type { WeightUnit } from "@/lib/organization/settings";

/** Client-safe booking defaults from platform settings */
export type BookingPlatformConfig = {
  defaultIncoterms: string;
  requireHsCode: boolean;
  weightUnit: WeightUnit;
  defaultCurrency: string;
};
