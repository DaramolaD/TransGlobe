import "server-only";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getDefaultOrganizationId } from "@/lib/data/organization";
import { getDefaultOrganization } from "@/lib/data/organization";
import { organizationDisplayName } from "@/lib/organization/display";
import { parseOrganizationSettings } from "@/lib/organization/settings";
import type { PlatformSettings } from "@/lib/organization/settings";
import type { BookingPlatformConfig } from "@/lib/organization/booking-config";

export async function getPlatformSettings(): Promise<PlatformSettings> {
  const client = (await createServiceClient()) ?? (await createClient());
  const orgId = await getDefaultOrganizationId();
  if (!orgId) return parseOrganizationSettings({});

  const { data } = await client
    .from("organizations")
    .select("settings")
    .eq("id", orgId)
    .single();

  return parseOrganizationSettings((data?.settings as Record<string, unknown>) ?? {});
}

export async function getLegalCompanyName(): Promise<string> {
  const org = await getDefaultOrganization();
  const s = parseOrganizationSettings(org?.settings);
  return s.legal_name.trim() || organizationDisplayName(org);
}

export async function getBookingPlatformConfig(): Promise<BookingPlatformConfig> {
  const s = await getPlatformSettings();
  return {
    defaultIncoterms: s.default_incoterms,
    requireHsCode: s.require_hs_code,
    weightUnit: s.weight_unit,
    defaultCurrency: s.default_currency,
  };
}
