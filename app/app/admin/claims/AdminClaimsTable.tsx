"use client";

import { useRouter } from "next/navigation";
import { FilterableDataTable } from "@/components/dashboard/FilterableDataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { TrackingId } from "@/components/dashboard/TrackingId";
import { Badge } from "@/components/ui/badge";
import { claimDetailRow } from "@/lib/dashboard/table-details";
import { TableTextCell } from "@/components/dashboard/TableCells";
import { markClaimViewed } from "@/lib/actions/claims";
import { displayName, type ClaimWithRelations } from "@/lib/data/entity-relations";
import { ClaimRowMenu } from "./ClaimRowMenu";
import type { DataTableRow } from "@/components/dashboard/DataTable";

export function AdminClaimsTable({ claims }: { claims: ClaimWithRelations[] }) {
  const router = useRouter();

  const rows = claims.map((c) => ({
    _id: c.id,
    _detail: claimDetailRow({
      id: c.id,
      claim_type: c.claim_type,
      status: c.status,
      description: c.description,
      tracking_number: c.shipment?.tracking_number,
      created_at: c.created_at,
      customerName: displayName(c.customer),
      shipmentId: c.shipment?.id,
      route: c.shipment
        ? `${c.shipment.origin} → ${c.shipment.destination}`
        : undefined,
    }),
    _searchText: [
      c.claim_type,
      c.status,
      c.description,
      displayName(c.customer),
      c.customer?.email,
      c.shipment?.tracking_number,
      c.staff_viewed_at ? "viewed" : "new",
    ]
      .filter(Boolean)
      .join(" "),
    tracking: c.shipment?.tracking_number ? (
      <TrackingId value={c.shipment.tracking_number} />
    ) : (
      "—"
    ),
    customer: (
      <TableTextCell className="text-muted-foreground" title={displayName(c.customer)}>
        {displayName(c.customer)}
      </TableTextCell>
    ),
    type: <span className="capitalize text-sm">{c.claim_type.replace(/_/g, " ")}</span>,
    summary: (
      <TableTextCell className="text-muted-foreground" title={c.description}>
        {c.description}
      </TableTextCell>
    ),
    review: c.staff_viewed_at ? (
      <Badge variant="secondary" className="font-normal text-muted-foreground">
        Viewed
      </Badge>
    ) : (
      <Badge className="font-normal bg-primary/15 text-primary hover:bg-primary/15">
        New
      </Badge>
    ),
    status: <StatusBadge status={c.status} />,
    date: (
      <span className="text-sm text-muted-foreground tabular-nums">
        {new Date(c.created_at).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
    menu: <ClaimRowMenu id={c.id} currentStatus={c.status} />,
  }));

  async function handleRowClick(row: DataTableRow) {
    const id = row._id;
    if (typeof id === "string") {
      await markClaimViewed(id);
      router.refresh();
    }
  }

  return (
    <FilterableDataTable
      storageKey="admin-claims-columns"
      searchPlaceholder="Search claim, customer, tracking #…"
      columns={[
        { key: "tracking", label: "Shipment", className: "min-w-[110px]" },
        { key: "customer", label: "Customer", className: "min-w-[100px]" },
        { key: "type", label: "Type" },
        { key: "summary", label: "Summary", className: "min-w-[180px]" },
        { key: "review", label: "Review", className: "min-w-[80px]", truncate: false },
        { key: "status", label: "Status" },
        { key: "date", label: "Filed", className: "w-[100px]" },
        { key: "menu", label: "", className: "w-12" },
      ]}
      defaultVisibleKeys={["tracking", "customer", "type", "review", "status", "date"]}
      rows={rows}
      getSearchText={(row) => String(row._searchText ?? "")}
      emptyMessage="No claims filed yet."
      onRowClick={handleRowClick}
    />
  );
}
