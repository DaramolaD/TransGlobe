"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit/log";

export async function completeAssignment(assignmentId: string) {
  const profile = await requireProfile();
  const supabase = await createClient();

  let q = supabase
    .from("assignments")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", assignmentId);

  if (profile.role === "driver") {
    q = q.eq("driver_id", profile.id);
  }

  const { data: assignment, error } = await q
    .select("id, shipment_id, driver_id")
    .single();

  if (error) return { error: error.message };

  if (assignment?.shipment_id) {
    await writeAuditLog({
      action: "assignment_completed",
      entityType: "shipment",
      entityId: assignment.shipment_id,
      payload: { assignment_id: assignment.id },
    });
  }

  revalidatePath("/app/driver");
  return { success: true };
}
