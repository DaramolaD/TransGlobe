"use server";

import { revalidatePath } from "next/cache";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import { getDefaultOrganizationId } from "@/lib/data/organization";
import { writeAuditLog } from "@/lib/audit/log";
import {
  parseOrganizationSettings,
  settingsToJson,
  type PlatformSettings,
} from "@/lib/organization/settings";

const REVALIDATE_PATHS = [
  "/app/superadmin/settings",
  "/app/superadmin",
  "/",
  "/tracking",
];

function revalidateOrganization() {
  for (const p of REVALIDATE_PATHS) revalidatePath(p);
}

async function requireSuperadmin() {
  const profile = await requireProfile();
  if (profile.role !== "superadmin") return { error: "Forbidden" as const, profile: null };
  return { profile, error: null };
}

export async function updatePlatformSettings(input: {
  name: string;
  logo_url?: string | null;
  settings: PlatformSettings;
}) {
  const { error: authErr, profile } = await requireSuperadmin();
  if (authErr) return { error: authErr };

  const orgId = await getDefaultOrganizationId();
  if (!orgId) return { error: "Organization not configured" };

  const name = input.name.trim();
  if (!name) return { error: "Company name is required" };

  const settings = parseOrganizationSettings(settingsToJson(input.settings));
  if (!/^[A-Z0-9]{2,6}$/.test(settings.tracking_prefix)) {
    return { error: "Tracking prefix must be 2–6 uppercase letters or numbers" };
  }

  const payload = {
    name,
    logo_url: input.logo_url?.trim() || null,
    settings: settingsToJson(settings),
    updated_at: new Date().toISOString(),
  };

  const service = await createServiceClient();
  const client = service ?? (await createClient());
  const { error } = await client
    .from("organizations")
    .update(payload)
    .eq("id", orgId);

  if (error) return { error: error.message };

  await writeAuditLog({
    action: "organization.settings_updated",
    entityType: "organization",
    entityId: orgId,
    payload: {
      actor: profile!.id,
      tracking_prefix: settings.tracking_prefix,
      default_currency: settings.default_currency,
    },
  });

  revalidateOrganization();
  return { success: true as const };
}
