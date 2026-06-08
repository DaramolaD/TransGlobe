"use server";

import { revalidatePath } from "next/cache";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import type { UserRole } from "@/lib/types/database";

export async function updateUserRole(userId: string, role: UserRole) {
  const profile = await requireProfile();
  if (profile.role !== "superadmin") return { error: "Forbidden" };

  const service = await createServiceClient();
  if (!service) {
    const supabase = await createClient();
    const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
    if (error) return { error: error.message };
  } else {
    const { error } = await service.from("profiles").update({ role }).eq("id", userId);
    if (error) return { error: error.message };
    await service.auth.admin.updateUserById(userId, {
      app_metadata: { role },
    });
  }

  revalidatePath("/app/superadmin/users");
  revalidatePath("/app/superadmin/customers");
      revalidatePath("/app/superadmin");
  return { success: true };
}
