"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import { isStaff } from "@/lib/auth/roles";
import { getDefaultOrganizationId } from "@/lib/data/organization";

export type StaffInboxItem = {
  id: string;
  title: string;
  body: string | null;
  created_at: string;
  href: string;
  read: boolean;
  kind: "claim" | "lead" | "other";
};

export type StaffInboxSummary = {
  unreadCount: number;
  claimsUnread: number;
  items: StaffInboxItem[];
};

function inboxHref(metadata: Record<string, unknown> | null | undefined): {
  href: string;
  kind: StaffInboxItem["kind"];
} {
  const meta = metadata ?? {};
  if (typeof meta.claim_id === "string") {
    return { href: `/app/admin/claims/${meta.claim_id}`, kind: "claim" };
  }
  if (typeof meta.lead_id === "string") {
    return { href: "/app/admin/leads", kind: "lead" };
  }
  return { href: "/app/admin", kind: "other" };
}

export async function getStaffInboxSummary(): Promise<StaffInboxSummary | null> {
  const profile = await requireProfile();
  if (!isStaff(profile.role)) return null;

  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("notifications")
    .select("id, title, body, read_at, metadata, created_at")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(12);

  const items: StaffInboxItem[] = (rows ?? []).map((row) => {
    const meta = row.metadata as Record<string, unknown> | null;
    const { href, kind } = inboxHref(meta);
    return {
      id: row.id,
      title: row.title,
      body: row.body,
      created_at: row.created_at,
      href,
      read: Boolean(row.read_at),
      kind,
    };
  });

  const unreadCount = items.filter((i) => !i.read).length;
  const claimsUnread = items.filter((i) => !i.read && i.kind === "claim").length;

  return { unreadCount, claimsUnread, items };
}

export async function markNotificationRead(notificationId: string) {
  const profile = await requireProfile();
  if (!isStaff(profile.role)) return { error: "Forbidden" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("user_id", profile.id)
    .is("read_at", null);

  if (error) return { error: error.message };

  revalidatePath("/app");
  return { success: true as const };
}

export async function markClaimNotificationsRead(claimId: string) {
  const profile = await requireProfile();
  if (!isStaff(profile.role)) return;

  const supabase = await createClient();
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", profile.id)
    .is("read_at", null)
    .filter("metadata->>claim_id", "eq", claimId);

  revalidatePath("/app");
}

export async function notifyStaffNewClaim(
  claimId: string,
  claimType: string,
  trackingNumber?: string | null
) {
  const orgId = await getDefaultOrganizationId();
  if (!orgId) return;

  const supabase = await createClient();
  const { data: staff } = await supabase
    .from("profiles")
    .select("id")
    .in("role", ["admin", "superadmin"])
    .eq("is_active", true);

  if (!staff?.length) return;

  const label = claimType.replace(/_/g, " ");
  const tracking = trackingNumber ? ` · ${trackingNumber}` : "";

  await supabase.from("notifications").insert(
    staff.map((s) => ({
      organization_id: orgId,
      user_id: s.id,
      title: "New claim",
      body: `${label} claim filed${tracking}`,
      metadata: { claim_id: claimId, type: "claim" },
    }))
  );
}
