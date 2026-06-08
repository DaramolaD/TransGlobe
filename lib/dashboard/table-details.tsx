import type { DataTableDetail } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { TrackingId } from "@/components/dashboard/TrackingId";
import { dashboardTrackingHref } from "@/lib/dashboard/tracking-links";
import {
  displayName,
  type AssignmentSnippet,
  type InvoiceSnippet,
  type ProfileSnippet,
} from "@/lib/data/entity-relations";
import Link from "next/link";

export function formatTableDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function shipmentDetailRow(
  s: {
    id: string;
    tracking_number: string;
    origin: string;
    destination: string;
    service_type: string;
    status: string;
    weight_kg?: number | null;
    package_count?: number | null;
    estimated_delivery?: string | null;
    created_at: string;
    special_instructions?: string | null;
    customer?: ProfileSnippet | null;
    invoice?: InvoiceSnippet | null;
    assignment?: AssignmentSnippet | null;
  },
  options?: { href?: string; hrefLabel?: string }
): DataTableDetail {
  const driver = s.assignment?.driver;
  return {
    kind: "shipment",
    title: s.tracking_number,
    subtitle: `${s.origin} → ${s.destination}`,
    fields: [
      {
        label: "Shipment ID",
        value: (
          <span className="font-mono text-xs break-all" title={s.id}>
            {s.id}
          </span>
        ),
      },
      { label: "Tracking", value: <TrackingId value={s.tracking_number} /> },
      { label: "Status", value: <StatusBadge status={s.status} /> },
      ...(s.customer
        ? [
            {
              label: "Customer",
              value: (
                <span>
                  {displayName(s.customer)}
                  {s.customer.company_name ? (
                    <span className="text-muted-foreground">
                      {" "}
                      · {s.customer.company_name}
                    </span>
                  ) : null}
                </span>
              ),
            },
          ]
        : []),
      ...(s.invoice
        ? [
            {
              label: "Invoice",
              value: (
                <Link
                  href={`/app/admin/invoices/${s.invoice.id}`}
                  className="text-primary hover:underline font-mono text-sm"
                >
                  {s.invoice.invoice_number}
                </Link>
              ),
            },
            {
              label: "Billing",
              value: <StatusBadge status={s.invoice.status} />,
            },
          ]
        : [{ label: "Invoice", value: "No invoice" }]),
      ...(driver
        ? [
            {
              label: "Driver",
              value: displayName(driver),
            },
          ]
        : []),
      { label: "Service", value: s.service_type.replace(/_/g, " ") },
      { label: "Weight", value: s.weight_kg ? `${s.weight_kg} kg` : "—" },
      { label: "Packages", value: String(s.package_count ?? 1) },
      ...(s.estimated_delivery
        ? [{ label: "ETA", value: formatTableDate(s.estimated_delivery) }]
        : []),
      { label: "Booked", value: formatTableDate(s.created_at) },
      ...(s.special_instructions
        ? [{ label: "Instructions", value: s.special_instructions }]
        : []),
    ],
    href: options?.href ?? dashboardTrackingHref(s.id),
    hrefLabel: options?.hrefLabel ?? "Track shipment",
  };
}

export function quoteDetailRow(q: {
  id: string;
  origin: string;
  destination: string;
  status: string;
  service_type?: string | null;
  total_price?: number | null;
  weight_kg?: number | null;
  created_at: string;
  customerName?: string | null;
  leadName?: string | null;
  trackingNumber?: string | null;
  shipmentId?: string;
  currency?: string;
}): DataTableDetail {
  return {
    kind: "quote",
    title: `${q.origin} → ${q.destination}`,
    subtitle: formatTableDate(q.created_at),
    fields: [
      {
        label: "Quote ID",
        value: (
          <span className="font-mono text-xs break-all" title={q.id}>
            {q.id}
          </span>
        ),
      },
      { label: "Route", value: `${q.origin} → ${q.destination}` },
      { label: "Status", value: <StatusBadge status={q.status} /> },
      ...(q.customerName ? [{ label: "Customer", value: q.customerName }] : []),
      ...(q.leadName ? [{ label: "Lead", value: q.leadName }] : []),
      {
        label: "Service",
        value: (q.service_type ?? "—").replace(/_/g, " "),
      },
      {
        label: "Total",
        value:
          q.total_price != null
            ? `${q.currency ?? "USD"} ${Number(q.total_price).toFixed(2)}`
            : "—",
      },
      {
        label: "Weight",
        value: q.weight_kg != null ? `${q.weight_kg} kg` : "—",
      },
      ...(q.trackingNumber
        ? [{ label: "Shipment", value: <TrackingId value={q.trackingNumber} /> }]
        : []),
      { label: "Created", value: formatTableDate(q.created_at) },
    ],
    href: `/app/admin/quotes/${q.id}`,
    hrefLabel: "View quote details",
  };
}

export function invoiceDetailRow(inv: {
  id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: string;
  due_date?: string | null;
  created_at: string;
  customerName?: string | null;
  customerEmail?: string | null;
  trackingNumber?: string | null;
  sent_at?: string | null;
  paid_at?: string | null;
}): DataTableDetail {
  return {
    kind: "invoice",
    title: inv.invoice_number,
    subtitle: `${inv.currency} ${Number(inv.amount).toFixed(2)}`,
    fields: [
      {
        label: "Invoice ID",
        value: (
          <span className="font-mono text-xs break-all" title={inv.id}>
            {inv.id}
          </span>
        ),
      },
      { label: "Number", value: inv.invoice_number },
      { label: "Status", value: <StatusBadge status={inv.status} /> },
      {
        label: "Amount",
        value: `${inv.currency} ${Number(inv.amount).toFixed(2)}`,
      },
      ...(inv.customerName || inv.customerEmail
        ? [
            {
              label: "Customer",
              value: inv.customerName ?? inv.customerEmail ?? "—",
            },
          ]
        : []),
      ...(inv.trackingNumber
        ? [{ label: "Shipment", value: <TrackingId value={inv.trackingNumber} /> }]
        : []),
      {
        label: "Due",
        value: inv.due_date ? formatTableDate(inv.due_date) : "—",
      },
      ...(inv.sent_at
        ? [{ label: "Sent", value: formatTableDate(inv.sent_at) }]
        : []),
      ...(inv.paid_at
        ? [{ label: "Paid", value: formatTableDate(inv.paid_at) }]
        : []),
      { label: "Created", value: formatTableDate(inv.created_at) },
    ],
    href: `/app/admin/invoices/${inv.id}`,
    hrefLabel: "View full invoice",
  };
}

export function claimDetailRow(c: {
  id: string;
  claim_type: string;
  status: string;
  description?: string;
  tracking_number?: string;
  created_at: string;
  customerName?: string | null;
  shipmentId?: string;
  route?: string;
  staffViewedAt?: string | null;
}): DataTableDetail {
  const claimType = c.claim_type.replace(/_/g, " ");
  const title =
    claimType.charAt(0).toUpperCase() + claimType.slice(1) + " claim";

  return {
    kind: "claim",
    title,
    subtitle: c.tracking_number ?? "No shipment linked",
    fields: [
      {
        label: "Review",
        value: c.staffViewedAt ? (
          <span className="text-muted-foreground">
            Viewed{" "}
            {new Date(c.staffViewedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        ) : (
          <span className="font-medium text-primary">New — not yet opened</span>
        ),
      },
      {
        label: "Claim ID",
        value: (
          <span className="font-mono text-xs break-all" title={c.id}>
            {c.id}
          </span>
        ),
      },
      { label: "Type", value: claimType },
      { label: "Status", value: <StatusBadge status={c.status} /> },
      ...(c.customerName
        ? [{ label: "Customer", value: c.customerName }]
        : []),
      {
        label: "Shipment",
        value: c.tracking_number ? (
          <TrackingId value={c.tracking_number} />
        ) : (
          "—"
        ),
      },
      ...(c.route ? [{ label: "Route", value: c.route }] : []),
      { label: "Description", value: c.description ?? "—" },
      { label: "Filed", value: formatTableDate(c.created_at) },
    ],
    href: `/app/admin/claims/${c.id}`,
    hrefLabel: "Open claim",
  };
}

export function facilityDetailRow(f: {
  id: string;
  name: string;
  facility_type: string;
  address_line?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  latitude: number;
  longitude: number;
  is_active: boolean;
  notes?: string | null;
}) {
  const region = [f.city, f.state, f.country].filter(Boolean).join(", ");
  return {
    kind: "facility" as const,
    title: f.name,
    subtitle: region || f.facility_type.replace(/_/g, " "),
    fields: [
      {
        label: "Facility ID",
        value: (
          <span className="font-mono text-xs break-all" title={f.id}>
            {f.id}
          </span>
        ),
      },
      { label: "Type", value: f.facility_type.replace(/_/g, " ") },
      { label: "Status", value: <StatusBadge status={f.is_active ? "active" : "inactive"} /> },
      ...(f.address_line ? [{ label: "Address", value: f.address_line }] : []),
      ...(region ? [{ label: "City / region", value: region }] : []),
      ...(f.postal_code ? [{ label: "Postal code", value: f.postal_code }] : []),
      {
        label: "Coordinates",
        value: (
          <span className="font-mono text-sm tabular-nums">
            {f.latitude.toFixed(6)}, {f.longitude.toFixed(6)}
          </span>
        ),
      },
      ...(f.notes ? [{ label: "Notes", value: f.notes }] : []),
    ],
  };
}

export function pickupDetailRow(p: {
  id: string;
  pickup_city: string;
  pickup_address: string;
  pickup_date: string;
  pickup_time?: string | null;
  pickup_country?: string | null;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  package_count?: number | null;
  package_weight?: string | null;
  status: string;
  special_instructions?: string | null;
}): DataTableDetail {
  return {
    kind: "pickup",
    title: p.contact_name || "Pickup contact",
    subtitle: p.contact_phone,
    fields: [
      { label: "Name", value: p.contact_name || "—" },
      { label: "Mobile", value: p.contact_phone || "—" },
      {
        label: "Pickup ID",
        value: (
          <span className="font-mono text-xs break-all" title={p.id}>
            {p.id}
          </span>
        ),
      },
      { label: "Status", value: <StatusBadge status={p.status} /> },
      { label: "Pickup date", value: formatTableDate(p.pickup_date) },
      { label: "Window", value: p.pickup_time ?? "—" },
      { label: "Address", value: p.pickup_address },
      {
        label: "City",
        value: `${p.pickup_city}${p.pickup_country ? `, ${p.pickup_country}` : ""}`,
      },
      { label: "Email", value: p.contact_email },
      { label: "Packages", value: String(p.package_count ?? 1) },
      ...(p.package_weight ? [{ label: "Weight", value: p.package_weight }] : []),
      ...(p.special_instructions
        ? [{ label: "Instructions", value: p.special_instructions }]
        : []),
    ],
  };
}
