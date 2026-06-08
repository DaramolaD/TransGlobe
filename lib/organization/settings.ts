import type { MapVisibilityMode } from "@/lib/types/tracking";

export type WeightUnit = "kg" | "lb";

/** Tenant configuration stored in `organizations.settings` JSONB */
export type PlatformSettings = {
  legal_name: string;
  tagline: string;
  headquarters: string;
  operating_regions: string;
  support_email: string;
  support_phone: string;
  ops_hours: string;

  tracking_prefix: string;
  default_map_visibility: MapVisibilityMode;
  public_tracking_enabled: boolean;
  show_driver_name_public: boolean;
  gps_publish_interval_sec: number;

  default_currency: string;
  weight_unit: WeightUnit;
  timezone: string;
  dispatch_requires_paid_invoice: boolean;
  auto_assign_nearest_driver: boolean;

  quote_validity_days: number;
  portal_booking_auto_confirm: boolean;
  require_hs_code: boolean;
  default_incoterms: string;

  invoice_prefix: string;
  payment_terms_days: number;
  default_tax_rate: number;

  claims_sla_days: number;
  cargo_insurance_partner: string;
  customs_broker_contact: string;

  notify_on_pickup: boolean;
  notify_on_in_transit: boolean;
  notify_on_customs: boolean;
  notify_on_delivery: boolean;
  notify_on_exception: boolean;

  tms_webhook_url: string;
  carrier_integration_notes: string;
};

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  legal_name: "",
  tagline: "Global freight · Air, sea & road logistics",
  headquarters: "Lagos · New York · London hubs",
  operating_regions: "Americas · Europe · Africa",
  support_email: "ops@swiftcargo.com",
  support_phone: "+1 (800) 555-0142",
  ops_hours: "24/7 control tower",

  tracking_prefix: "SWC",
  default_map_visibility: "past_and_current",
  public_tracking_enabled: true,
  show_driver_name_public: false,
  gps_publish_interval_sec: 30,

  default_currency: "USD",
  weight_unit: "kg",
  timezone: "America/New_York",
  dispatch_requires_paid_invoice: true,
  auto_assign_nearest_driver: false,

  quote_validity_days: 14,
  portal_booking_auto_confirm: true,
  require_hs_code: false,
  default_incoterms: "DAP",

  invoice_prefix: "INV",
  payment_terms_days: 30,
  default_tax_rate: 0,

  claims_sla_days: 5,
  cargo_insurance_partner: "",
  customs_broker_contact: "",

  notify_on_pickup: true,
  notify_on_in_transit: true,
  notify_on_customs: true,
  notify_on_delivery: true,
  notify_on_exception: true,

  tms_webhook_url: "",
  carrier_integration_notes: "",
};

const MAP_VISIBILITY_MODES: MapVisibilityMode[] = [
  "past_and_current",
  "full_journey",
  "milestones_only",
  "live_gps_only",
];

function asBool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}

function asNumber(v: unknown, fallback: number): number {
  const n = typeof v === "number" ? v : parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

function asString(v: unknown, fallback: string): string {
  return typeof v === "string" ? v : fallback;
}

export function parseOrganizationSettings(
  raw: Record<string, unknown> | null | undefined
): PlatformSettings {
  const s = raw ?? {};
  const mapMode = asString(s.default_map_visibility, DEFAULT_PLATFORM_SETTINGS.default_map_visibility);
  const weightUnit = asString(s.weight_unit, DEFAULT_PLATFORM_SETTINGS.weight_unit);

  return {
    legal_name: asString(s.legal_name, DEFAULT_PLATFORM_SETTINGS.legal_name),
    tagline: asString(s.tagline, DEFAULT_PLATFORM_SETTINGS.tagline),
    headquarters: asString(s.headquarters, DEFAULT_PLATFORM_SETTINGS.headquarters),
    operating_regions: asString(
      s.operating_regions ?? s.region,
      DEFAULT_PLATFORM_SETTINGS.operating_regions
    ),
    support_email: asString(s.support_email, DEFAULT_PLATFORM_SETTINGS.support_email),
    support_phone: asString(s.support_phone, DEFAULT_PLATFORM_SETTINGS.support_phone),
    ops_hours: asString(s.ops_hours, DEFAULT_PLATFORM_SETTINGS.ops_hours),

    tracking_prefix: asString(s.tracking_prefix, DEFAULT_PLATFORM_SETTINGS.tracking_prefix)
      .toUpperCase()
      .slice(0, 6),
    default_map_visibility: MAP_VISIBILITY_MODES.includes(mapMode as MapVisibilityMode)
      ? (mapMode as MapVisibilityMode)
      : DEFAULT_PLATFORM_SETTINGS.default_map_visibility,
    public_tracking_enabled: asBool(
      s.public_tracking_enabled,
      DEFAULT_PLATFORM_SETTINGS.public_tracking_enabled
    ),
    show_driver_name_public: asBool(
      s.show_driver_name_public,
      DEFAULT_PLATFORM_SETTINGS.show_driver_name_public
    ),
    gps_publish_interval_sec: Math.min(
      300,
      Math.max(15, asNumber(s.gps_publish_interval_sec, DEFAULT_PLATFORM_SETTINGS.gps_publish_interval_sec))
    ),

    default_currency: asString(s.default_currency, DEFAULT_PLATFORM_SETTINGS.default_currency)
      .toUpperCase()
      .slice(0, 3),
    weight_unit: weightUnit === "lb" ? "lb" : "kg",
    timezone: asString(s.timezone, DEFAULT_PLATFORM_SETTINGS.timezone),
    dispatch_requires_paid_invoice: asBool(
      s.dispatch_requires_paid_invoice,
      DEFAULT_PLATFORM_SETTINGS.dispatch_requires_paid_invoice
    ),
    auto_assign_nearest_driver: asBool(
      s.auto_assign_nearest_driver,
      DEFAULT_PLATFORM_SETTINGS.auto_assign_nearest_driver
    ),

    quote_validity_days: Math.min(
      90,
      Math.max(1, asNumber(s.quote_validity_days, DEFAULT_PLATFORM_SETTINGS.quote_validity_days))
    ),
    portal_booking_auto_confirm: asBool(
      s.portal_booking_auto_confirm,
      DEFAULT_PLATFORM_SETTINGS.portal_booking_auto_confirm
    ),
    require_hs_code: asBool(s.require_hs_code, DEFAULT_PLATFORM_SETTINGS.require_hs_code),
    default_incoterms: asString(
      s.default_incoterms,
      DEFAULT_PLATFORM_SETTINGS.default_incoterms
    ).toUpperCase(),

    invoice_prefix: asString(s.invoice_prefix, DEFAULT_PLATFORM_SETTINGS.invoice_prefix)
      .toUpperCase()
      .slice(0, 8),
    payment_terms_days: Math.min(
      120,
      Math.max(0, asNumber(s.payment_terms_days, DEFAULT_PLATFORM_SETTINGS.payment_terms_days))
    ),
    default_tax_rate: Math.min(
      100,
      Math.max(0, asNumber(s.default_tax_rate, DEFAULT_PLATFORM_SETTINGS.default_tax_rate))
    ),

    claims_sla_days: Math.min(
      30,
      Math.max(1, asNumber(s.claims_sla_days, DEFAULT_PLATFORM_SETTINGS.claims_sla_days))
    ),
    cargo_insurance_partner: asString(
      s.cargo_insurance_partner,
      DEFAULT_PLATFORM_SETTINGS.cargo_insurance_partner
    ),
    customs_broker_contact: asString(
      s.customs_broker_contact,
      DEFAULT_PLATFORM_SETTINGS.customs_broker_contact
    ),

    notify_on_pickup: asBool(s.notify_on_pickup, DEFAULT_PLATFORM_SETTINGS.notify_on_pickup),
    notify_on_in_transit: asBool(
      s.notify_on_in_transit,
      DEFAULT_PLATFORM_SETTINGS.notify_on_in_transit
    ),
    notify_on_customs: asBool(s.notify_on_customs, DEFAULT_PLATFORM_SETTINGS.notify_on_customs),
    notify_on_delivery: asBool(s.notify_on_delivery, DEFAULT_PLATFORM_SETTINGS.notify_on_delivery),
    notify_on_exception: asBool(
      s.notify_on_exception,
      DEFAULT_PLATFORM_SETTINGS.notify_on_exception
    ),

    tms_webhook_url: asString(s.tms_webhook_url, DEFAULT_PLATFORM_SETTINGS.tms_webhook_url),
    carrier_integration_notes: asString(
      s.carrier_integration_notes,
      DEFAULT_PLATFORM_SETTINGS.carrier_integration_notes
    ),
  };
}

export function settingsToJson(settings: PlatformSettings): Record<string, unknown> {
  return { ...settings };
}

export const MAP_VISIBILITY_LABELS: Record<MapVisibilityMode, string> = {
  past_and_current: "Past route + current position",
  full_journey: "Full planned journey",
  milestones_only: "Facility milestones only",
  live_gps_only: "Live GPS only (no route)",
};
