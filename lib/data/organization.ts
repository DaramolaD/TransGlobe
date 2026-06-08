import "server-only";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { DEFAULT_ORG_SLUG } from "@/lib/auth/roles";
import type { Organization } from "@/lib/types/database";

export { organizationDisplayName } from "@/lib/organization/display";

async function orgClient() {
  const service = await createServiceClient();
  return service ?? (await createClient());
}

export async function getDefaultOrganizationId(): Promise<string | null> {
  const client = await orgClient();
  const { data } = await client
    .from("organizations")
    .select("id")
    .eq("slug", DEFAULT_ORG_SLUG)
    .single();

  return data?.id ?? null;
}

export async function getDefaultOrganization(): Promise<Organization | null> {
  const client = await orgClient();
  const { data } = await client
    .from("organizations")
    .select("*")
    .eq("slug", DEFAULT_ORG_SLUG)
    .single();

  return (data as Organization) ?? null;
}
