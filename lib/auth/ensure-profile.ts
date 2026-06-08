import { createServiceClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types/database";

type ProfileAuthFields = {
  role: UserRole;
  is_active: boolean;
};

/** Create a missing profile for an auth user (e.g. signup before migrations ran). */
export async function ensureUserProfile(
  userId: string,
  email?: string | null,
  fullName?: string | null
): Promise<ProfileAuthFields | null> {
  const service = await createServiceClient();
  if (!service) return null;

  const { data: existing } = await service
    .from("profiles")
    .select("role, is_active")
    .eq("id", userId)
    .maybeSingle();

  if (existing) return existing as ProfileAuthFields;

  const { data: org } = await service
    .from("organizations")
    .select("id")
    .eq("slug", "default")
    .maybeSingle();

  if (!org) return null;

  const { data: created, error } = await service
    .from("profiles")
    .insert({
      id: userId,
      organization_id: org.id,
      role: "user",
      full_name: fullName?.trim() || email?.split("@")[0] || "User",
      email: email ?? null,
      is_active: true,
    })
    .select("role, is_active")
    .single();

  if (error || !created) return null;
  return created as ProfileAuthFields;
}
