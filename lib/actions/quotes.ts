"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import { isStaff } from "@/lib/auth/roles";
import { writeAuditLog } from "@/lib/audit/log";
import {
  normalizeQuoteRow,
  QUOTE_RELATIONS_SELECT,
  type QuoteWithRelations,
} from "@/lib/data/entity-relations";
import type { QuoteStatus } from "@/lib/types/database";

const PATHS = ["/app/admin/quotes", "/app/portal/quotes"];

function revalidateQuotes() {
  for (const p of PATHS) revalidatePath(p);
}

async function requireStaff() {
  const profile = await requireProfile();
  if (!isStaff(profile.role)) return { error: "Forbidden" as const };
  return { profile, error: null };
}

export async function listQuotesAdmin(): Promise<{
  data: QuoteWithRelations[];
  error?: string;
}> {
  const auth = await requireStaff();
  if (auth.error) return { data: [], error: auth.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .select(QUOTE_RELATIONS_SELECT)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return {
    data: ((data ?? []) as Record<string, unknown>[]).map(normalizeQuoteRow),
  };
}

export async function getQuoteWithRelations(id: string): Promise<{
  data: QuoteWithRelations | null;
  error?: string;
}> {
  const auth = await requireStaff();
  if (auth.error) return { data: null, error: auth.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .select(QUOTE_RELATIONS_SELECT)
    .eq("id", id)
    .single();

  if (error || !data) return { data: null, error: error?.message ?? "Not found" };
  return { data: normalizeQuoteRow(data as Record<string, unknown>) };
}

export async function updateQuoteStatus(id: string, status: QuoteStatus) {
  const auth = await requireStaff();
  if (auth.error) return { error: auth.error };

  const supabase = await createClient();
  const { data: quote, error } = await supabase
    .from("quotes")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, origin, destination, status")
    .single();

  if (error) return { error: error.message };

  await writeAuditLog({
    action: "quote_status_updated",
    entityType: "quote",
    entityId: id,
    payload: {
      status,
      route: `${quote.origin} → ${quote.destination}`,
    },
  });

  revalidateQuotes();
  revalidatePath(`/app/admin/quotes/${id}`);
  return { success: true as const };
}
