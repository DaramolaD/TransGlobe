import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, User, Users } from "lucide-react";
import { getQuoteWithRelations } from "@/lib/actions/quotes";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ActivitySection } from "@/components/dashboard/ActivitySection";
import { RelatedContextGrid } from "@/components/dashboard/RelatedContextGrid";
import { TrackingId } from "@/components/dashboard/TrackingId";
import { displayName } from "@/lib/data/entity-relations";
import { dashboardTrackingHref } from "@/lib/dashboard/tracking-links";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteRowMenu } from "../QuoteRowMenu";

export default async function AdminQuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: quote, error } = await getQuoteWithRelations(id);
  if (error || !quote) notFound();

  const leadLabel = quote.lead
    ? `${quote.lead.first_name} ${quote.lead.last_name}`.trim()
    : null;

  return (
    <div className="space-y-6 max-w-4xl">
      <Button variant="ghost" size="sm" className="-ml-2 gap-2" asChild>
        <Link href="/app/admin/quotes">
          <ArrowLeft className="h-4 w-4" />
          All quotes
        </Link>
      </Button>

      <PageHeader
        title={`${quote.origin} → ${quote.destination}`}
        description={`${quote.currency} ${quote.total_price != null ? Number(quote.total_price).toFixed(2) : "—"} · ${quote.service_type.replace(/_/g, " ")}`}
        action={<QuoteRowMenu id={quote.id} currentStatus={quote.status} />}
      />

      <StatusBadge status={quote.status} />

      <RelatedContextGrid
        items={[
          {
            label: "Customer",
            icon: <User className="h-3.5 w-3.5" />,
            primary: displayName(quote.customer),
            secondary: quote.customer?.email ?? undefined,
            href: quote.customer?.id
              ? `/app/superadmin/customers/${quote.customer.id}`
              : undefined,
          },
          ...(quote.lead
            ? [
                {
                  label: "Lead",
                  icon: <Users className="h-3.5 w-3.5" />,
                  primary: leadLabel ?? quote.lead.email,
                  secondary: quote.lead.company ?? quote.lead.email,
                },
              ]
            : []),
          {
            label: "Shipment",
            icon: <MapPin className="h-3.5 w-3.5" />,
            primary: quote.shipment ? (
              <TrackingId value={quote.shipment.tracking_number} />
            ) : (
              <span className="text-muted-foreground font-normal">Not converted yet</span>
            ),
            secondary: quote.shipment?.status.replace(/_/g, " "),
            href: quote.shipment?.id
              ? dashboardTrackingHref(quote.shipment.id)
              : undefined,
          },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quote details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Weight</p>
            <p>{quote.weight_kg != null ? `${quote.weight_kg} kg` : "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Valid until</p>
            <p>
              {quote.valid_until
                ? new Date(quote.valid_until).toLocaleDateString()
                : "—"}
            </p>
          </div>
          {quote.notes ? (
            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground">Notes</p>
              <p className="text-muted-foreground">{quote.notes}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <ActivitySection entityType="quote" entityId={quote.id} />
    </div>
  );
}
