import Link from "next/link";
import { DataTable } from "@/components/dashboard/DataTable";
import { RouteTableCell } from "@/components/dashboard/TableCells";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { TrackingId } from "@/components/dashboard/TrackingId";
import { dashboardTrackingHref } from "@/lib/dashboard/tracking-links";
import {
  claimDetailRow,
  formatTableDate,
  invoiceDetailRow,
  pickupDetailRow,
  quoteDetailRow,
  shipmentDetailRow,
} from "@/lib/dashboard/table-details";
import type { ProfileActivityResult } from "@/lib/profile-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ActivityTableSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden pt-0">
      <CardHeader className="border-b bg-muted/20 !py-5 gap-0">
        <CardTitle className="text-base font-semibold">
          {title}{" "}
          <span className="text-muted-foreground font-normal tabular-nums">
            ({count})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

export function CustomerActivityTables({ activity }: { activity: ProfileActivityResult }) {
  const { quotes, pickups, invoices, shipments, claims } = activity;

  return (
    <div className="space-y-6">
      <ActivityTableSection title="Quotes" count={quotes.length}>
        <DataTable
          embedded
          showIndex
          pageSize={10}
          columns={[
            { key: "route", label: "Route", className: "min-w-[160px]" },
            { key: "service", label: "Service" },
            { key: "total", label: "Total" },
            { key: "status", label: "Status" },
            { key: "date", label: "Created", className: "w-[110px]" },
          ]}
          rows={quotes.map((q) => ({
            _id: q.id,
            _detail: quoteDetailRow(q),
            route: (
              <RouteTableCell origin={q.origin} destination={q.destination} />
            ),
            service: (
              <span className="capitalize text-muted-foreground">
                {(q.service_type ?? "—").replace(/_/g, " ")}
              </span>
            ),
            total: q.total_price != null ? `$${q.total_price}` : "—",
            status: <StatusBadge status={q.status} />,
            date: (
              <span className="text-muted-foreground tabular-nums text-sm">
                {formatTableDate(q.created_at)}
              </span>
            ),
          }))}
          emptyMessage="No quotes for this customer yet."
        />
      </ActivityTableSection>

      <ActivityTableSection title="Pickups" count={pickups.length}>
        <DataTable
          embedded
          showIndex
          pageSize={10}
          columns={[
            { key: "city", label: "City" },
            { key: "contact", label: "Contact", className: "min-w-[140px]" },
            { key: "date", label: "Pickup date" },
            { key: "status", label: "Status" },
          ]}
          rows={pickups.map((p) => ({
            _id: p.id,
            _detail: pickupDetailRow({
              id: p.id,
              pickup_city: p.pickup_city,
              pickup_address: p.pickup_address ?? p.pickup_city,
              pickup_date: p.pickup_date,
              pickup_time: p.pickup_time,
              pickup_country: p.pickup_country,
              contact_name: p.contact_name ?? "—",
              contact_phone: p.contact_phone ?? "—",
              contact_email: p.contact_email ?? "—",
              package_count: p.package_count,
              package_weight: p.package_weight,
              status: p.status,
              special_instructions: p.special_instructions,
            }),
            city: <span className="font-medium">{p.pickup_city}</span>,
            contact: (
              <span className="text-sm truncate block max-w-[200px]">
                <span className="font-medium">{p.contact_name ?? "—"}</span>
                {p.contact_phone ? (
                  <span className="text-muted-foreground tabular-nums">
                    {" "}
                    · {p.contact_phone}
                  </span>
                ) : null}
              </span>
            ),
            date: (
              <span className="tabular-nums text-sm">{formatTableDate(p.pickup_date)}</span>
            ),
            status: <StatusBadge status={p.status} />,
          }))}
          emptyMessage="No pickup requests for this customer yet."
        />
      </ActivityTableSection>

      <ActivityTableSection title="Invoices" count={invoices.length}>
        <DataTable
          embedded
          showIndex
          pageSize={10}
          columns={[
            { key: "number", label: "Invoice #" },
            { key: "amount", label: "Amount" },
            { key: "due", label: "Due" },
            { key: "status", label: "Status" },
            { key: "date", label: "Created", className: "w-[110px]" },
          ]}
          rows={invoices.map((inv) => ({
            _id: inv.id,
            _detail: invoiceDetailRow(inv),
            number: (
              <span className="font-mono text-sm font-medium">{inv.invoice_number}</span>
            ),
            amount: (
              <span className="tabular-nums">
                {inv.currency} {inv.amount.toFixed(2)}
              </span>
            ),
            due: (
              <span className="text-sm text-muted-foreground tabular-nums">
                {inv.due_date ? formatTableDate(inv.due_date) : "—"}
              </span>
            ),
            status: <StatusBadge status={inv.status} />,
            date: (
              <span className="text-muted-foreground tabular-nums text-sm">
                {formatTableDate(inv.created_at)}
              </span>
            ),
          }))}
          emptyMessage="No invoices for this customer yet."
        />
      </ActivityTableSection>

      <ActivityTableSection title="Shipments" count={shipments.length}>
        <DataTable
          embedded
          showIndex
          pageSize={10}
          columns={[
            { key: "tracking", label: "Tracking #" },
            { key: "route", label: "Route", className: "min-w-[160px]" },
            { key: "service", label: "Service", className: "hidden sm:table-cell" },
            { key: "status", label: "Status" },
            { key: "date", label: "Booked", className: "w-[110px]" },
          ]}
          rows={shipments.map((s) => ({
            _id: s.id,
            _detail: shipmentDetailRow(
              {
                ...s,
                service_type: s.service_type ?? "air",
              },
              {
                href: dashboardTrackingHref(s.id),
                hrefLabel: "Track shipment",
              }
            ),
            tracking: (
              <Link href={dashboardTrackingHref(s.id)} className="hover:opacity-80">
                <TrackingId value={s.tracking_number} />
              </Link>
            ),
            route: (
              <RouteTableCell origin={s.origin} destination={s.destination} />
            ),
            service: (
              <span className="text-xs font-medium capitalize text-muted-foreground">
                {(s.service_type ?? "air").replace(/_/g, " ")}
              </span>
            ),
            status: <StatusBadge status={s.status} />,
            date: (
              <span className="text-muted-foreground tabular-nums text-sm">
                {formatTableDate(s.created_at)}
              </span>
            ),
          }))}
          emptyMessage="No shipments booked by this customer yet."
        />
      </ActivityTableSection>

      <ActivityTableSection title="Claims" count={claims.length}>
        <DataTable
          embedded
          showIndex
          pageSize={10}
          columns={[
            { key: "tracking", label: "Shipment" },
            { key: "type", label: "Type" },
            { key: "description", label: "Description", className: "min-w-[160px]" },
            { key: "status", label: "Status" },
            { key: "date", label: "Filed", className: "w-[110px]" },
          ]}
          rows={claims.map((c) => ({
            _id: c.id,
            _detail: claimDetailRow(c),
            tracking: c.tracking_number ? (
              <TrackingId value={c.tracking_number} />
            ) : (
              "—"
            ),
            type: <span className="capitalize">{c.claim_type}</span>,
            description: (
              <span className="text-sm text-muted-foreground line-clamp-1 max-w-[240px]">
                {c.description ?? "—"}
              </span>
            ),
            status: <StatusBadge status={c.status} />,
            date: (
              <span className="text-muted-foreground tabular-nums text-sm">
                {formatTableDate(c.created_at)}
              </span>
            ),
          }))}
          emptyMessage="No claims filed by this customer yet."
        />
      </ActivityTableSection>
    </div>
  );
}
