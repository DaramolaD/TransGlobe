"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import { isStaff } from "@/lib/auth/roles";
import { getDefaultOrganizationId } from "@/lib/data/organization";
import type { InvoiceStatus } from "@/lib/types/database";
import {
  billingStateFromInvoice,
  type ShipmentBillingState,
} from "@/lib/invoices/shipment-billing";
import { baseFreightAmount, fallbackRates } from "@/lib/pricing/rate-cards";
import {
  buildInvoiceShipmentDetails,
  type InvoiceShipmentDetails,
} from "@/lib/invoices/shipment-invoice-display";
import { writeAuditLog } from "@/lib/audit/log";
import {
  amountWithTax,
  dueDateFromPaymentTerms,
  generateInvoiceNumber,
} from "@/lib/invoices/invoice-utils";
import {
  activeAssignmentFromEmbed,
  INVOICE_DETAIL_SELECT,
  INVOICE_LIST_SELECT,
  type ProfileSnippet,
  type QuoteSnippet,
} from "@/lib/data/entity-relations";

const INVOICE_PATHS = [
  "/app/admin/invoices",
  "/app/portal/invoices",
  "/app/admin/dispatch",
  "/app/admin/shipments",
];

function revalidateInvoices() {
  for (const p of INVOICE_PATHS) revalidatePath(p);
}

async function requireStaffProfile() {
  const profile = await requireProfile();
  if (!isStaff(profile.role)) return { error: "Forbidden" as const, profile: null };
  return { profile, error: null };
}

async function defaultDueDate(): Promise<string> {
  const { getPlatformSettings } = await import("@/lib/organization/platform-settings");
  const platform = await getPlatformSettings();
  return dueDateFromPaymentTerms(platform.payment_terms_days);
}

async function estimateAmountFromShipment(shipment: {
  weight_kg?: number | null;
  service_type?: string;
}): Promise<number> {
  const weight = Number(shipment.weight_kg) || 50;
  const serviceType = shipment.service_type ?? "standard";

  const supabase = await createClient();
  const { data: rateRows } = await supabase
    .from("rate_cards")
    .select("service_type, price_per_kg, min_charge, name")
    .eq("is_active", true);

  const rates = rateRows?.length ? rateRows : fallbackRates();
  const priced = baseFreightAmount(weight, serviceType, rates);
  if (priced) return priced.amount;

  const multipliers: Record<string, number> = {
    air: 4.5,
    express: 5,
    sea: 1.2,
    road: 2,
    rail: 1.8,
    standard: 2.5,
  };
  const rate = multipliers[serviceType] ?? 2.5;
  return Math.round(weight * rate * 100) / 100;
}

async function notifyCustomer(
  userId: string,
  title: string,
  body: string,
  metadata: Record<string, unknown> = {}
) {
  const orgId = await getDefaultOrganizationId();
  if (!orgId) return;
  const supabase = await createClient();
  await supabase.from("notifications").insert({
    organization_id: orgId,
    user_id: userId,
    title,
    body,
    metadata,
  });
}

export async function listInvoicesAdmin() {
  const staff = await requireStaffProfile();
  if (staff.error) return { error: staff.error, data: [] };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select(INVOICE_LIST_SELECT)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message, data: [] };

  const rows = (data ?? []).map((row) => {
    const r = row as Record<string, unknown>;
    const customerRaw = r.customer;
    const customer = Array.isArray(customerRaw)
      ? (customerRaw[0] as ProfileSnippet | undefined) ?? null
      : (customerRaw as ProfileSnippet | null);
    const shipRaw = r.shipments;
    const shipments = Array.isArray(shipRaw)
      ? shipRaw[0] ?? null
      : shipRaw;
    return { ...r, customer, shipments };
  });

  return { data: rows };
}

export async function listMyInvoices() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      shipments (tracking_number, origin, destination)
    `
    )
    .eq("customer_id", profile.id)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message, data: [] };
  return { data: data ?? [] };
}

export async function getInvoice(id: string) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(INVOICE_DETAIL_SELECT)
    .eq("id", id)
    .single();

  if (error || !data) return { error: error?.message ?? "Not found", data: null };

  if (!isStaff(profile.role) && data.customer_id !== profile.id) {
    return { error: "Forbidden", data: null };
  }

  const row = data as Record<string, unknown>;
  const customer = (row.customer as ProfileSnippet | null) ?? null;
  const shipmentRaw = row.shipments as Record<string, unknown> | null;
  const shipment = Array.isArray(shipmentRaw)
    ? (shipmentRaw[0] as Record<string, unknown>)
    : shipmentRaw;

  const quoteEmbed = shipment?.quote as QuoteSnippet | QuoteSnippet[] | null;
  const quote = Array.isArray(quoteEmbed)
    ? quoteEmbed[0] ?? null
    : quoteEmbed;

  const assignment = shipment
    ? activeAssignmentFromEmbed(shipment.assignments)
    : null;

  const packages = Array.isArray(shipment?.packages)
    ? shipment.packages
    : shipment?.packages
      ? [shipment.packages]
      : [];

  let shipmentDetails: InvoiceShipmentDetails | null = null;
  if (shipment?.id) {
    shipmentDetails = buildInvoiceShipmentDetails(
      shipment as Parameters<typeof buildInvoiceShipmentDetails>[0],
      packages as Parameters<typeof buildInvoiceShipmentDetails>[1]
    );
  }

  return {
    data: {
      ...data,
      customer,
      quote,
      assignment,
      shipmentDetails,
    },
  };
}

export async function listShipmentsForInvoicing() {
  const staff = await requireStaffProfile();
  if (staff.error) return { error: staff.error, data: [] };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shipments")
    .select(
      "id, tracking_number, origin, destination, status, created_by, weight_kg, service_type, quote_id"
    )
    .neq("status", "cancelled")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return { error: error.message, data: [] };
  return { data: data ?? [] };
}

export async function getShipmentBillingStatus(
  shipmentId: string
): Promise<ShipmentBillingState> {
  const supabase = await createClient();
  const { data: invoice } = await supabase
    .from("invoices")
    .select("id, invoice_number, status")
    .eq("shipment_id", shipmentId)
    .not("status", "eq", "cancelled")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { getPlatformSettings } = await import("@/lib/organization/platform-settings");
  const platform = await getPlatformSettings();

  return billingStateFromInvoice(
    invoice as { id: string; invoice_number: string; status: InvoiceStatus } | null,
    { requirePaidInvoice: platform.dispatch_requires_paid_invoice }
  );
}

/** Batch billing lookup for dispatch / shipments tables */
export async function getBillingForShipments(
  shipmentIds: string[]
): Promise<Record<string, ShipmentBillingState>> {
  if (shipmentIds.length === 0) return {};

  const supabase = await createClient();
  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, shipment_id, invoice_number, status, created_at")
    .in("shipment_id", shipmentIds)
    .not("status", "eq", "cancelled")
    .order("created_at", { ascending: false });

  const { getPlatformSettings } = await import("@/lib/organization/platform-settings");
  const platform = await getPlatformSettings();
  const billingOptions = { requirePaidInvoice: platform.dispatch_requires_paid_invoice };

  const byShipment: Record<string, ShipmentBillingState> = {};
  for (const id of shipmentIds) {
    const inv = (invoices ?? []).find((i) => i.shipment_id === id);
    byShipment[id] = billingStateFromInvoice(
      inv
        ? {
            id: inv.id,
            invoice_number: inv.invoice_number,
            status: inv.status as InvoiceStatus,
          }
        : null,
      billingOptions
    );
  }
  return byShipment;
}

/** Used before assignDriver — returns error message if blocked */
export async function assertPaidInvoiceForDispatch(shipmentId: string) {
  const billing = await getShipmentBillingStatus(shipmentId);
  if (!billing.canAssignDriver) {
    return { ok: false as const, error: billing.blockingReason ?? "Invoice not paid" };
  }
  return { ok: true as const };
}

export async function createInvoiceFromShipment(
  shipmentId: string,
  options?: { amount?: number; dueDate?: string; notes?: string; send?: boolean }
) {
  const staff = await requireStaffProfile();
  if (staff.error) return { error: staff.error };

  const supabase = await createClient();

  const { data: shipment, error: shipErr } = await supabase
    .from("shipments")
    .select("id, organization_id, created_by, weight_kg, service_type, quote_id, tracking_number")
    .eq("id", shipmentId)
    .single();

  if (shipErr || !shipment) return { error: "Shipment not found" };
  if (!shipment.created_by) return { error: "Shipment has no customer assigned" };

  const { data: existing } = await supabase
    .from("invoices")
    .select("id, invoice_number")
    .eq("shipment_id", shipmentId)
    .not("status", "eq", "cancelled")
    .maybeSingle();

  if (existing) {
    return {
      success: true,
      invoiceId: existing.id,
      invoiceNumber: existing.invoice_number,
      existing: true,
    };
  }

  const { getPlatformSettings } = await import("@/lib/organization/platform-settings");
  const platform = await getPlatformSettings();

  let amount = options?.amount;
  let currency = platform.default_currency;

  if (shipment.quote_id) {
    const { data: quote } = await supabase
      .from("quotes")
      .select("total_price, currency")
      .eq("id", shipment.quote_id)
      .single();
    if (quote?.total_price) {
      amount = amount ?? Number(quote.total_price);
      currency = quote.currency ?? "USD";
    }
  }

  if (amount == null) amount = await estimateAmountFromShipment(shipment);

  const priced = amountWithTax(amount, platform.default_tax_rate);
  amount = priced.total;
  const taxNote = priced.note;

  const invoiceNumber = generateInvoiceNumber(platform.invoice_prefix);

  const status: InvoiceStatus = options?.send ? "sent" : "draft";
  const now = new Date().toISOString();

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      organization_id: shipment.organization_id,
      shipment_id: shipmentId,
      customer_id: shipment.created_by,
      invoice_number: invoiceNumber,
      amount,
      currency,
      status,
      due_date: options?.dueDate ?? (await defaultDueDate()),
      notes: [options?.notes, taxNote].filter(Boolean).join("\n") || null,
      sent_at: options?.send ? now : null,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  if (options?.send && invoice.customer_id) {
    await notifyCustomer(
      invoice.customer_id,
      "New invoice ready",
      `Invoice ${invoice.invoice_number} for shipment ${shipment.tracking_number} is ready. Amount: ${currency} ${amount}.`,
      { invoice_id: invoice.id, type: "invoice_sent" }
    );
    await writeAuditLog({
      action: "invoice_sent",
      entityType: "invoice",
      entityId: invoice.id,
      payload: {
        invoice_number: invoice.invoice_number,
        tracking_number: shipment.tracking_number,
      },
    });
  }

  await writeAuditLog({
    action: "invoice_created",
    entityType: "invoice",
    entityId: invoice.id,
    payload: {
      invoice_number: invoice.invoice_number,
      amount,
      currency,
      status,
      sent_on_create: Boolean(options?.send),
    },
  });

  revalidateInvoices();
  revalidatePath(`/app/admin/invoices/${invoice.id}`);
  return { success: true, invoice, existing: false };
}

export async function createInvoice(data: {
  shipmentId: string;
  amount: number;
  dueDate?: string;
  notes?: string;
  send?: boolean;
}) {
  return createInvoiceFromShipment(data.shipmentId, {
    amount: data.amount,
    dueDate: data.dueDate,
    notes: data.notes,
    send: data.send,
  });
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus) {
  const staff = await requireStaffProfile();
  if (staff.error) return { error: staff.error };

  const supabase = await createClient();
  const updates: Record<string, unknown> = { status };

  if (status === "sent") {
    updates.sent_at = new Date().toISOString();
  }
  if (status === "paid") {
    updates.paid_at = new Date().toISOString();
  }
  if (status === "cancelled") {
    updates.paid_at = null;
  }

  const { data: invoice, error } = await supabase
    .from("invoices")
    .update(updates)
    .eq("id", id)
    .select("*, shipments(tracking_number)")
    .single();

  if (error) return { error: error.message };

  const auditAction =
    status === "sent"
      ? "invoice_sent"
      : status === "paid"
        ? "invoice_marked_paid"
        : status === "cancelled"
          ? "invoice_cancelled"
          : null;

  if (auditAction) {
    await writeAuditLog({
      action: auditAction,
      entityType: "invoice",
      entityId: id,
      payload: {
        invoice_number: invoice.invoice_number,
        status,
        amount: invoice.amount,
        currency: invoice.currency,
      },
    });
  }

  if (status === "paid" && invoice.shipment_id && invoice.customer_id) {
    await notifyCustomer(
      invoice.customer_id,
      "Payment confirmed",
      `Invoice ${invoice.invoice_number} is paid. Your shipment can now be dispatched.`,
      { invoice_id: invoice.id, type: "invoice_paid" }
    );
  }

  if (status === "sent" && invoice.customer_id) {
    const tracking =
      (invoice.shipments as { tracking_number?: string } | null)?.tracking_number ?? "";
    await notifyCustomer(
      invoice.customer_id,
      "Invoice sent",
      `Invoice ${invoice.invoice_number}${tracking ? ` (${tracking})` : ""} is due by ${invoice.due_date ?? "the due date"}.`,
      { invoice_id: invoice.id, type: "invoice_sent" }
    );
  }

  revalidateInvoices();
  revalidatePath(`/app/admin/invoices/${id}`);
  revalidatePath(`/app/portal/invoices/${id}`);
  return { success: true };
}

export async function sendInvoice(id: string) {
  return updateInvoiceStatus(id, "sent");
}

export async function resendInvoice(id: string) {
  const staff = await requireStaffProfile();
  if (staff.error) return { error: staff.error };

  const supabase = await createClient();
  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*, shipments(tracking_number)")
    .eq("id", id)
    .single();

  if (error || !invoice) return { error: error?.message ?? "Not found" };
  if (invoice.status === "cancelled" || invoice.status === "paid") {
    return { error: "Cannot resend a cancelled or paid invoice" };
  }
  if (!invoice.customer_id) return { error: "No customer on this invoice" };

  const tracking =
    (invoice.shipments as { tracking_number?: string } | null)?.tracking_number ?? "";

  await notifyCustomer(
    invoice.customer_id,
    "Invoice reminder",
    `Reminder: invoice ${invoice.invoice_number}${tracking ? ` (${tracking})` : ""} for ${invoice.currency} ${invoice.amount} is due${invoice.due_date ? ` by ${invoice.due_date}` : ""}.`,
    { invoice_id: invoice.id, type: "invoice_resent" }
  );

  if (invoice.status === "draft") {
    return sendInvoice(id);
  }

  await writeAuditLog({
    action: "invoice_resent",
    entityType: "invoice",
    entityId: id,
    payload: {
      invoice_number: invoice.invoice_number,
      status: invoice.status,
    },
  });

  revalidateInvoices();
  revalidatePath(`/app/admin/invoices/${id}`);
  return { success: true as const };
}

export async function listInvoiceActivity(invoiceId: string) {
  const staff = await requireStaffProfile();
  if (staff.error) return { data: [], error: staff.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("id, action, payload, created_at, actor_id")
    .eq("entity_type", "invoice")
    .eq("entity_id", invoiceId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return { data: [], error: error.message };

  const actorIds = [
    ...new Set((data ?? []).map((e) => e.actor_id).filter(Boolean)),
  ] as string[];

  let actors: Record<string, string> = {};
  if (actorIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", actorIds);
    actors = Object.fromEntries(
      (profiles ?? []).map((p) => [
        p.id,
        p.full_name ?? p.email ?? "Staff",
      ])
    );
  }

  return {
    data: (data ?? []).map((e) => ({
      id: e.id,
      action: e.action,
      payload: e.payload,
      created_at: e.created_at,
      actor_name: e.actor_id ? actors[e.actor_id] : null,
    })),
  };
}

export async function markInvoicePaid(id: string) {
  return updateInvoiceStatus(id, "paid");
}

export async function cancelInvoice(id: string) {
  return updateInvoiceStatus(id, "cancelled");
}

export async function submitPaymentReference(
  invoiceId: string,
  reference: string,
  proof?: {
    url: string;
    public_id: string;
    uploaded_at: string;
  }
) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const customerLabel = profile.full_name ?? profile.email ?? "Customer";

  const { data: invoice } = await supabase
    .from("invoices")
    .select("id, customer_id, invoice_number, status, amount, currency")
    .eq("id", invoiceId)
    .single();

  if (!invoice || invoice.customer_id !== profile.id) {
    return { error: "Invoice not found" };
  }
  if (!["sent", "overdue"].includes(invoice.status)) {
    return { error: "This invoice cannot accept payment references" };
  }
  if (!reference.trim()) return { error: "Reference is required" };

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("invoices")
    .update({
      payment_reference: reference.trim(),
      payment_submitted_at: now,
      ...(proof
        ? {
            payment_proof_url: proof.url,
            payment_proof_public_id: proof.public_id,
            payment_proof_uploaded_at: proof.uploaded_at,
          }
        : {}),
    })
    .eq("id", invoiceId);

  if (error) return { error: error.message };

  await writeAuditLog({
    action: "payment_reference_submitted",
    entityType: "invoice",
    entityId: invoiceId,
    payload: {
      invoice_number: invoice.invoice_number,
      reference: reference.trim(),
      submitted_by: customerLabel,
      has_proof: Boolean(proof),
    },
  });

  if (proof) {
    await writeAuditLog({
      action: "payment_proof_uploaded",
      entityType: "invoice",
      entityId: invoiceId,
      payload: {
        invoice_number: invoice.invoice_number,
        public_id: proof.public_id,
      },
    });
  }

  const orgId = await getDefaultOrganizationId();
  if (orgId) {
    const { data: admins } = await supabase
      .from("profiles")
      .select("id")
      .in("role", ["admin", "superadmin"])
      .eq("is_active", true);

    for (const admin of admins ?? []) {
      await supabase.from("notifications").insert({
        organization_id: orgId,
        user_id: admin.id,
        title: "Payment reference submitted",
        body: `${customerLabel} submitted payment ref "${reference}" for ${invoice.invoice_number} (${invoice.currency} ${invoice.amount}).`,
        metadata: { invoice_id: invoiceId, type: "payment_reference" },
      });
    }
  }

  revalidatePath(`/app/portal/invoices/${invoiceId}`);
  revalidatePath("/app/admin/invoices");
  return { success: true };
}
