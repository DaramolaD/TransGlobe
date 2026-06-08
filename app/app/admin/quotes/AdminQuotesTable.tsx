"use client";

import { FilterableDataTable } from "@/components/dashboard/FilterableDataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { TrackingId } from "@/components/dashboard/TrackingId";
import { RouteInlineCell, TableTextCell } from "@/components/dashboard/TableCells";
import { quoteDetailRow } from "@/lib/dashboard/table-details";
import { displayName, type QuoteWithRelations } from "@/lib/data/entity-relations";
import { QuoteRowMenu } from "./QuoteRowMenu";

export function AdminQuotesTable({ quotes }: { quotes: QuoteWithRelations[] }) {
  const rows = quotes.map((q) => {
    const leadName = q.lead
      ? `${q.lead.first_name} ${q.lead.last_name}`.trim()
      : null;
    return {
      _id: q.id,
      _detail: quoteDetailRow({
        id: q.id,
        origin: q.origin,
        destination: q.destination,
        status: q.status,
        service_type: q.service_type,
        total_price: q.total_price,
        weight_kg: q.weight_kg,
        created_at: q.created_at,
        customerName: displayName(q.customer),
        leadName,
        trackingNumber: q.shipment?.tracking_number,
        shipmentId: q.shipment?.id,
        currency: q.currency,
      }),
      _searchText: [
        q.origin,
        q.destination,
        q.status,
        q.service_type,
        displayName(q.customer),
        q.customer?.email,
        leadName,
        q.lead?.email,
        q.shipment?.tracking_number,
      ]
        .filter(Boolean)
        .join(" "),
      route: <RouteInlineCell origin={q.origin} destination={q.destination} />,
      customer: <TableTextCell>{displayName(q.customer)}</TableTextCell>,
      service: (
        <span className="capitalize text-sm text-muted-foreground">
          {q.service_type.replace(/_/g, " ")}
        </span>
      ),
      total: (
        <span className="text-sm tabular-nums">
          {q.total_price != null ? `${q.currency} ${Number(q.total_price).toFixed(2)}` : "—"}
        </span>
      ),
      status: <StatusBadge status={q.status} />,
      shipment: q.shipment?.tracking_number ? (
        <TrackingId value={q.shipment.tracking_number} />
      ) : (
        <span className="text-xs text-muted-foreground">Not converted</span>
      ),
      date: (
        <span className="text-sm text-muted-foreground tabular-nums">
          {new Date(q.created_at).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
      menu: <QuoteRowMenu id={q.id} currentStatus={q.status} />,
    };
  });

  return (
    <FilterableDataTable
      storageKey="admin-quotes-columns"
      searchPlaceholder="Search route, customer, lead, tracking #…"
      columns={[
        { key: "route", label: "Route", className: "min-w-[160px]" },
        { key: "customer", label: "Customer" },
        { key: "service", label: "Service", className: "hidden md:table-cell" },
        { key: "total", label: "Total" },
        { key: "status", label: "Status" },
        { key: "shipment", label: "Shipment", className: "hidden lg:table-cell" },
        { key: "date", label: "Date", className: "w-[90px]" },
        { key: "menu", label: "", className: "w-12" },
      ]}
      defaultVisibleKeys={["route", "customer", "total", "status", "date"]}
      rows={rows}
      getSearchText={(row) => String(row._searchText ?? "")}
      emptyMessage="No quotes yet. Estimator submissions appear here."
    />
  );
}
