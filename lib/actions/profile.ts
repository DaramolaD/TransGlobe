"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";

export async function updateMyProfile(input: {
  fullName?: string;
  phone?: string;
  companyName?: string;
}) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: input.fullName?.trim() || null,
      phone: input.phone?.trim() || null,
      company_name: input.companyName?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  if (error) return { error: error.message };

  revalidatePath("/app/portal/account");
  revalidatePath("/app/driver/profile");
  return { success: true as const };
}
