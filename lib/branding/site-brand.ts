import "server-only";

import { getDefaultOrganization } from "@/lib/data/organization";
import { organizationDisplayName } from "@/lib/organization/display";
import { parseOrganizationSettings } from "@/lib/organization/settings";
import type { SiteBrand } from "@/lib/branding/types";

export type { SiteBrand };

export async function getSiteBrand(): Promise<SiteBrand> {
  const org = await getDefaultOrganization();
  const s = parseOrganizationSettings(org?.settings);

  return {
    name: organizationDisplayName(org),
    logoUrl: org?.logo_url ?? null,
    tagline: s.tagline,
    region: s.operating_regions,
    headquarters: s.headquarters,
    supportEmail: s.support_email,
    supportPhone: s.support_phone,
    opsHours: s.ops_hours,
    legalName: s.legal_name || organizationDisplayName(org),
    customsBrokerContact: s.customs_broker_contact,
    cargoInsurancePartner: s.cargo_insurance_partner,
  };
}
