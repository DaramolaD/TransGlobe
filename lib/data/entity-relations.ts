import { billingStateFromInvoice } from "@/lib/invoices/shipment-billing";
import type { InvoiceStatus } from "@/lib/types/database";

/**
 * TransGlobe entity relationship catalog (industry-standard logistics CRM model).
 *
 * Use Supabase nested selects from these fragments so screens load related
 * records in one round trip.
 */

export type ProfileSnippet = {
  id: string;
  full_name: string | null;
  email: string | null;
  company_name: string | null;
  phone?: string | null;
};

export type InvoiceSnippet = {
  id: string;
  invoice_number: string;
  status: string;
  amount: number;
  currency: string;
  due_date?: string | null;
};

export type AssignmentSnippet = {
  id: string;
  status: string;
  assigned_at: string;
  driver: ProfileSnippet | null;
};

export type QuoteSnippet = {
  id: string;
  total_price: number | null;
  currency: string;
  status?: string;
};

export type ShipmentWithRelations = {
  id: string;
  tracking_number: string;
  origin: string;
  destination: string;
  service_type: string;
  status: string;
  created_at: string;
  weight_kg?: number | null;
  package_count?: number | null;
  estimated_delivery?: string | null;
  current_location?: string | null;
  special_instructions?: string | null;
  quote_id?: string | null;
  created_by?: string | null;
  customer: ProfileSnippet | null;
  invoice: InvoiceSnippet | null;
  assignment: AssignmentSnippet | null;
  quote: QuoteSnippet | null;
};

/** Shipment list/detail — customer, invoice, active driver, quote */
const SHIPMENT_COLUMNS = `
  id,
  tracking_number,
  origin,
  destination,
  service_type,
  status,
  created_at,
  updated_at,
  weight_kg,
  package_count,
  estimated_delivery,
  actual_delivery,
  current_location,
  special_instructions,
  quote_id,
  created_by,
  organization_id
`;

export const SHIPMENT_RELATIONS_SELECT = `
  ${SHIPMENT_COLUMNS},
  customer:profiles!created_by (
    id, full_name, email, company_name, phone
  ),
  quote:quotes (
    id, total_price, currency, status
  ),
  invoices (
    id, invoice_number, status, amount, currency, due_date, created_at
  ),
  assignments (
    id, status, assigned_at,
    driver:profiles!driver_id (
      id, full_name, email, phone
    )
  )
`;

/** Invoice detail — customer + full shipment context */
const INVOICE_COLUMNS = `
  id,
  organization_id,
  shipment_id,
  customer_id,
  invoice_number,
  amount,
  currency,
  status,
  due_date,
  paid_at,
  sent_at,
  notes,
  payment_reference,
  payment_proof_url,
  payment_proof_public_id,
  payment_proof_uploaded_at,
  payment_submitted_at,
  created_at,
  updated_at
`;

export const INVOICE_DETAIL_SELECT = `
  ${INVOICE_COLUMNS},
  customer:profiles!customer_id (
    id, full_name, email, company_name, phone
  ),
  shipments (
    id,
    tracking_number,
    origin,
    destination,
    service_type,
    status,
    weight_kg,
    package_count,
    quote_id,
    estimated_delivery,
    created_at,
    packages (
      description, weight_kg, dimensions, quantity
    ),
    quote:quotes (
      id, total_price, currency, status
    ),
    assignments (
      id, status, assigned_at,
      driver:profiles!driver_id (
        id, full_name, email, phone
      )
    )
  )
`;

/** Invoice list rows */
export const INVOICE_LIST_SELECT = `
  ${INVOICE_COLUMNS},
  customer:profiles!customer_id (
    id, full_name, email, company_name
  ),
  shipments (
    id, tracking_number, origin, destination, status
  )
`;

function asObject<T>(value: unknown): T | null {
  if (value == null) return null;
  if (Array.isArray(value)) return (value[0] as T) ?? null;
  return value as T;
}

function asArray<T>(value: unknown): T[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value as T[];
  return [value as T];
}

export function activeInvoiceFromEmbed(
  invoices: unknown
): InvoiceSnippet | null {
  const rows = asArray<InvoiceSnippet & { status: string; created_at?: string }>(
    invoices
  );
  const active = rows
    .filter((i) => i.status !== "cancelled")
    .sort(
      (a, b) =>
        new Date(b.created_at ?? 0).getTime() -
        new Date(a.created_at ?? 0).getTime()
    );
  return active[0] ?? null;
}

export function activeAssignmentFromEmbed(
  assignments: unknown
): AssignmentSnippet | null {
  const rows = asArray<
    AssignmentSnippet & {
      driver: unknown;
      status: string;
    }
  >(assignments);
  const open = rows.filter(
    (a) => !["completed", "failed"].includes(a.status)
  );
  const pick = open[0] ?? rows[rows.length - 1];
  if (!pick) return null;
  return {
    id: pick.id,
    status: pick.status,
    assigned_at: pick.assigned_at,
    driver: asObject<ProfileSnippet>(pick.driver),
  };
}

export function normalizeShipmentRow(raw: Record<string, unknown>): ShipmentWithRelations {
  return {
    id: raw.id as string,
    tracking_number: raw.tracking_number as string,
    origin: raw.origin as string,
    destination: raw.destination as string,
    service_type: raw.service_type as string,
    status: raw.status as string,
    created_at: raw.created_at as string,
    weight_kg: raw.weight_kg as number | null,
    package_count: raw.package_count as number | null,
    estimated_delivery: raw.estimated_delivery as string | null,
    current_location: raw.current_location as string | null,
    special_instructions: raw.special_instructions as string | null,
    quote_id: raw.quote_id as string | null,
    created_by: raw.created_by as string | null,
    customer: asObject<ProfileSnippet>(raw.customer),
    quote: asObject<QuoteSnippet>(raw.quote),
    invoice: activeInvoiceFromEmbed(raw.invoices),
    assignment: activeAssignmentFromEmbed(raw.assignments),
  };
}

export function displayName(p: ProfileSnippet | null | undefined): string {
  if (!p) return "—";
  return p.full_name?.trim() || p.email?.trim() || "—";
}

export function billingMapFromShipments(
  shipments: ShipmentWithRelations[],
  options?: { requirePaidInvoice?: boolean }
) {
  const map: Record<string, ReturnType<typeof billingStateFromInvoice>> = {};
  for (const s of shipments) {
    map[s.id] = billingStateFromInvoice(
      s.invoice
        ? {
            id: s.invoice.id,
            invoice_number: s.invoice.invoice_number,
            status: s.invoice.status as InvoiceStatus,
          }
        : null,
      options
    );
  }
  return map;
}

const QUOTE_COLUMNS = `
  id,
  organization_id,
  created_by,
  lead_id,
  origin,
  destination,
  weight_kg,
  dimensions,
  service_type,
  package_type,
  insurance,
  express,
  base_price,
  total_price,
  currency,
  status,
  valid_until,
  notes,
  created_at,
  updated_at
`;

const CLAIM_COLUMNS = `
  id,
  organization_id,
  shipment_id,
  created_by,
  claim_type,
  description,
  status,
  resolution_notes,
  staff_viewed_at,
  staff_viewed_by,
  created_at,
  updated_at
`;

export type QuoteWithRelations = {
  id: string;
  origin: string;
  destination: string;
  service_type: string;
  status: string;
  total_price: number | null;
  currency: string;
  weight_kg: number | null;
  created_at: string;
  valid_until: string | null;
  notes: string | null;
  customer: ProfileSnippet | null;
  lead: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    company: string | null;
    status: string;
  } | null;
  shipment: {
    id: string;
    tracking_number: string;
    status: string;
  } | null;
};

export type ClaimWithRelations = {
  id: string;
  claim_type: string;
  description: string;
  status: string;
  resolution_notes: string | null;
  staff_viewed_at: string | null;
  staff_viewed_by: string | null;
  created_at: string;
  customer: ProfileSnippet | null;
  shipment: {
    id: string;
    tracking_number: string;
    origin: string;
    destination: string;
    status: string;
    service_type?: string;
  } | null;
};

export const QUOTE_RELATIONS_SELECT = `
  ${QUOTE_COLUMNS},
  customer:profiles!created_by (
    id, full_name, email, company_name, phone
  ),
  lead:leads (
    id, first_name, last_name, email, company, status
  ),
  shipments (
    id, tracking_number, status
  )
`;

export const CLAIM_RELATIONS_SELECT = `
  ${CLAIM_COLUMNS},
  customer:profiles!created_by (
    id, full_name, email, company_name, phone
  ),
  shipment:shipments!shipment_id (
    id, tracking_number, origin, destination, status, service_type
  )
`;

export function normalizeQuoteRow(raw: Record<string, unknown>): QuoteWithRelations {
  const shipments = asArray<{ id: string; tracking_number: string; status: string }>(
    raw.shipments
  );
  return {
    id: raw.id as string,
    origin: raw.origin as string,
    destination: raw.destination as string,
    service_type: raw.service_type as string,
    status: raw.status as string,
    total_price: raw.total_price != null ? Number(raw.total_price) : null,
    currency: raw.currency as string,
    weight_kg: raw.weight_kg != null ? Number(raw.weight_kg) : null,
    created_at: raw.created_at as string,
    valid_until: (raw.valid_until as string) ?? null,
    notes: (raw.notes as string) ?? null,
    customer: asObject<ProfileSnippet>(raw.customer),
    lead: asObject<QuoteWithRelations["lead"]>(raw.lead),
    shipment: shipments[0] ?? null,
  };
}

export function normalizeClaimRow(raw: Record<string, unknown>): ClaimWithRelations {
  return {
    id: raw.id as string,
    claim_type: raw.claim_type as string,
    description: raw.description as string,
    status: raw.status as string,
    resolution_notes: (raw.resolution_notes as string) ?? null,
    staff_viewed_at: (raw.staff_viewed_at as string) ?? null,
    staff_viewed_by: (raw.staff_viewed_by as string) ?? null,
    created_at: raw.created_at as string,
    customer: asObject<ProfileSnippet>(raw.customer),
    shipment: asObject<ClaimWithRelations["shipment"]>(raw.shipment),
  };
}

/** Human-readable map for docs / onboarding */
export const RELATION_CATALOG = [
  {
    entity: "Organization",
    relatesTo: ["profiles", "shipments", "invoices", "leads", "quotes", "cms"],
  },
  {
    entity: "Profile (user)",
    roles: ["superadmin", "admin", "driver", "user (customer)"],
    relatesTo: [
      "shipments.created_by (customer who booked)",
      "invoices.customer_id",
      "assignments.driver_id",
      "quotes.created_by",
      "claims.created_by",
      "pickup_requests.created_by",
    ],
  },
  {
    entity: "Shipment",
    relatesTo: [
      "profiles (customer via created_by)",
      "quotes (quote_id)",
      "packages (1:N)",
      "invoices (billing)",
      "assignments → driver profile",
      "tracking_events",
      "shipment_locations (GPS)",
      "pickup_requests",
      "claims",
      "documents",
    ],
  },
  {
    entity: "Invoice",
    relatesTo: ["shipment", "customer profile", "audit_logs (activity)"],
  },
  {
    entity: "Quote",
    relatesTo: ["profile (created_by)", "lead", "shipment (when converted)"],
  },
  {
    entity: "Assignment",
    relatesTo: ["shipment", "driver profile"],
  },
  {
    entity: "Claim",
    relatesTo: ["shipment", "customer profile"],
  },
  {
    entity: "Pickup request",
    relatesTo: ["shipment (optional)", "customer profile"],
  },
  {
    entity: "Tracking event",
    relatesTo: ["shipment", "facility_locations (hub/warehouse)"],
  },
] as const;
