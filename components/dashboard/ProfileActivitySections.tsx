import { DetailInlineRow } from "@/components/dashboard/DetailFieldList";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { TrackingId } from "@/components/dashboard/TrackingId";
import { formatServiceType } from "@/lib/dashboard/profile-detail-meta";
import { formatTableDate } from "@/lib/dashboard/table-details";
import type {
  ActivityAssignment,
  ActivityShipment,
  ProfileActivityResult,
} from "@/lib/profile-activity";
import type { UserRole } from "@/lib/types/database";

function shortId(id: string) {
  return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

function ShipmentPreviewCard({ shipment }: { shipment: ActivityShipment }) {
  const route = `${shipment.origin} → ${shipment.destination}`;
  return (
    <li className="px-3 py-2.5 space-y-1">
      <DetailInlineRow label="Route">
        <span className="truncate">{route}</span>
      </DetailInlineRow>
      <DetailInlineRow label="Tracking">
        <TrackingId value={shipment.tracking_number} />
      </DetailInlineRow>
      <DetailInlineRow label="ID">
        <span className="font-mono text-xs" title={shipment.id}>
          {shortId(shipment.id)}
        </span>
      </DetailInlineRow>
      <DetailInlineRow label="Service">
        <span className="capitalize">{formatServiceType(shipment.service_type)}</span>
      </DetailInlineRow>
      <DetailInlineRow label="Status">
        <StatusBadge status={shipment.status} />
      </DetailInlineRow>
      {shipment.weight_kg != null && (
        <DetailInlineRow label="Weight">
          <span>{shipment.weight_kg} kg</span>
        </DetailInlineRow>
      )}
      {shipment.package_count != null && (
        <DetailInlineRow label="Packages">
          <span>{shipment.package_count}</span>
        </DetailInlineRow>
      )}
      {shipment.estimated_delivery && (
        <DetailInlineRow label="ETA">
          <span className="tabular-nums">
            {formatTableDate(shipment.estimated_delivery)}
          </span>
        </DetailInlineRow>
      )}
      <DetailInlineRow label="Booked">
        <span className="tabular-nums">{formatTableDate(shipment.created_at)}</span>
      </DetailInlineRow>
    </li>
  );
}

function AssignmentPreviewCard({ assignment }: { assignment: ActivityAssignment }) {
  const s = assignment.shipment;
  return (
    <li className="px-3 py-2.5 space-y-1">
      <DetailInlineRow label="Assignment">
        <span className="font-mono text-xs" title={assignment.id}>
          {shortId(assignment.id)}
        </span>
      </DetailInlineRow>
      <DetailInlineRow label="Status">
        <StatusBadge status={assignment.status} />
      </DetailInlineRow>
      {s ? (
        <>
          <DetailInlineRow label="Tracking">
            <TrackingId value={s.tracking_number} />
          </DetailInlineRow>
          <DetailInlineRow label="Route">
            <span className="truncate">
              {s.origin} → {s.destination}
            </span>
          </DetailInlineRow>
          <DetailInlineRow label="Service">
            <span className="capitalize">{formatServiceType(s.service_type)}</span>
          </DetailInlineRow>
          <DetailInlineRow label="Shipment">
            <StatusBadge status={s.status} />
          </DetailInlineRow>
        </>
      ) : null}
      <DetailInlineRow label="Assigned">
        <span className="tabular-nums">{formatTableDate(assignment.assigned_at)}</span>
      </DetailInlineRow>
      {assignment.completed_at && (
        <DetailInlineRow label="Completed">
          <span className="tabular-nums">
            {formatTableDate(assignment.completed_at)}
          </span>
        </DetailInlineRow>
      )}
    </li>
  );
}

function ActivityList({
  empty,
  items,
  tall,
}: {
  empty: string;
  items: React.ReactNode[];
  tall?: boolean;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-md border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
        {empty}
      </div>
    );
  }
  return (
    <ul
      className={`divide-y rounded-md border text-sm overflow-y-auto ${
        tall ? "max-h-[320px]" : "max-h-[280px]"
      }`}
    >
      {items}
    </ul>
  );
}

function ActivityItem({
  title,
  meta,
  status,
}: {
  title: React.ReactNode;
  meta?: string;
  status?: string;
}) {
  return (
    <li className="flex items-start justify-between gap-3 px-3 py-2.5">
      <div className="min-w-0">
        <div className="font-medium truncate">{title}</div>
        {meta && <p className="text-xs text-muted-foreground mt-0.5">{meta}</p>}
      </div>
      {status && <StatusBadge status={status} />}
    </li>
  );
}

export function ProfileActivitySections({
  activity,
  role,
  audience,
  scope,
  showSectionTitle = true,
}: {
  activity: ProfileActivityResult;
  role: UserRole;
  audience: "team" | "customer";
  scope: "preview" | "full";
  showSectionTitle?: boolean;
}) {
  const isDriver = role === "driver";
  const isCustomer = audience === "customer" || role === "user";
  const preview = scope === "preview";
  const tall = !preview;

  const hasActivity =
    activity.shipments.length > 0 ||
    activity.assignments.length > 0 ||
    activity.invoices.length > 0 ||
    activity.pickups.length > 0 ||
    activity.quotes.length > 0 ||
    activity.claims.length > 0;

  if (preview && isDriver) {
    return (
      <div>
        {showSectionTitle ? (
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Recent assignments
          </h4>
        ) : null}
        <ActivityList
          empty="No assignments yet."
          items={activity.assignments.map((a) => (
            <AssignmentPreviewCard key={a.id} assignment={a} />
          ))}
        />
      </div>
    );
  }

  if (preview && isCustomer) {
    return (
      <div>
        {showSectionTitle ? (
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Recent shipments
          </h4>
        ) : null}
        <ActivityList
          empty="No shipments booked yet."
          items={activity.shipments.map((s) => (
            <ShipmentPreviewCard key={s.id} shipment={s} />
          ))}
        />
      </div>
    );
  }

  if (preview && !isCustomer && !isDriver) {
    return (
      <div>
        {showSectionTitle ? (
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Recent shipments
          </h4>
        ) : null}
        <ActivityList
          empty="No shipments linked to this account."
          items={activity.shipments.map((s) => (
            <ShipmentPreviewCard key={s.id} shipment={s} />
          ))}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isDriver && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Driver assignments ({activity.assignments.length})
          </h4>
          <ActivityList
            tall={tall}
            empty="No assignments yet."
            items={activity.assignments.map((a) => (
              <ActivityItem
                key={a.id}
                title={
                  a.shipment ? (
                    <TrackingId value={a.shipment.tracking_number} />
                  ) : (
                    "Assignment"
                  )
                }
                meta={
                  a.shipment
                    ? `${a.shipment.origin} → ${a.shipment.destination} · ${formatTableDate(a.assigned_at)}`
                    : formatTableDate(a.assigned_at)
                }
                status={a.status}
              />
            ))}
          />
        </div>
      )}

      {isCustomer && (
        <>
          <Section
            title={`Shipments (${activity.shipments.length})`}
            empty="No shipments booked yet."
            tall={tall}
            items={activity.shipments.map((s) => (
              <ActivityItem
                key={s.id}
                title={<TrackingId value={s.tracking_number} />}
                meta={`${s.origin} → ${s.destination} · ${formatTableDate(s.created_at)}`}
                status={s.status}
              />
            ))}
          />
          <Section
            title={`Invoices (${activity.invoices.length})`}
            empty="No invoices yet."
            tall={tall}
            items={activity.invoices.map((i) => (
              <ActivityItem
                key={i.id}
                title={i.invoice_number}
                meta={`${i.currency} ${i.amount.toFixed(2)} · ${formatTableDate(i.created_at)}`}
                status={i.status}
              />
            ))}
          />
          <Section
            title={`Pickups (${activity.pickups.length})`}
            empty="No pickup requests."
            tall={tall}
            items={activity.pickups.map((p) => (
              <ActivityItem
                key={p.id}
                title={p.pickup_city}
                meta={`${formatTableDate(p.pickup_date)} · ${formatTableDate(p.created_at)}`}
                status={p.status}
              />
            ))}
          />
          <Section
            title={`Quotes (${activity.quotes.length})`}
            empty="No quotes yet."
            tall={tall}
            items={activity.quotes.map((q) => (
              <ActivityItem
                key={q.id}
                title={`${q.origin} → ${q.destination}`}
                meta={
                  q.total_price
                    ? `$${q.total_price} · ${formatTableDate(q.created_at)}`
                    : formatTableDate(q.created_at)
                }
                status={q.status}
              />
            ))}
          />
          <Section
            title={`Claims (${activity.claims.length})`}
            empty="No claims filed."
            tall={tall}
            items={activity.claims.map((c) => (
              <ActivityItem
                key={c.id}
                title={c.claim_type}
                meta={
                  c.tracking_number
                    ? `${c.tracking_number} · ${formatTableDate(c.created_at)}`
                    : formatTableDate(c.created_at)
                }
                status={c.status}
              />
            ))}
          />
        </>
      )}

      {!isCustomer && !isDriver && (
        <Section
          title={`Shipments created (${activity.shipments.length})`}
          empty="No shipments linked to this admin account."
          tall={tall}
          items={activity.shipments.map((s) => (
            <ActivityItem
              key={s.id}
              title={<TrackingId value={s.tracking_number} />}
              meta={formatTableDate(s.created_at)}
              status={s.status}
            />
          ))}
        />
      )}

      {!hasActivity && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No activity recorded in the system yet.
        </p>
      )}
    </div>
  );
}

function Section({
  title,
  empty,
  items,
  tall,
}: {
  title: string;
  empty: string;
  items: React.ReactNode[];
  tall?: boolean;
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
        {title}
      </h4>
      <ActivityList empty={empty} items={items} tall={tall} />
    </div>
  );
}
