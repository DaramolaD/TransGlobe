import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/lib/types/database";
import { ROLE_HOME } from "@/lib/auth/roles";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select(
      "id, organization_id, role, full_name, phone, email, company_name, avatar_url, is_active"
    )
    .eq("id", user.id)
    .single();

  return data as Profile | null;
}

export async function requireProfile() {
  const profile = await getCurrentProfile();
  if (!profile) throw new Error("Unauthorized");
  return profile;
}

export function getRoleHome(role: UserRole) {
  return ROLE_HOME[role];
}
