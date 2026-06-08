import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, MapPin, User } from "lucide-react";
import { getClaimWithRelations } from "@/lib/actions/claims";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { ActivitySection } from "@/components/dashboard/ActivitySection";
import { RelatedContextGrid } from "@/components/dashboard/RelatedContextGrid";
import { TrackingId } from "@/components/dashboard/TrackingId";
import { ClaimSlaPanel } from "@/components/claims/ClaimSlaPanel";
import { displayName } from "@/lib/data/entity-relations";
import { dashboardTrackingHref } from "@/lib/dashboard/tracking-links";
import { formatClaimType, getClaimSlaInfo } from "@/lib/claims/sla";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClaimRowMenu } from "../ClaimRowMenu";
import { ClaimViewMarker } from "@/components/dashboard/ClaimViewMarker";
import { getPlatformSettings } from "@/lib/organization/platform-settings";

export default async function AdminClaimDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ data: claim, error }, platform] = await Promise.all([
    getClaimWithRelations(id),
    getPlatformSettings(),
  ]);
  if (error || !claim) notFound();

  const sla = getClaimSlaInfo(
    claim.created_at,
    platform.claims_sla_days,
    claim.status
  );
  const claimTitle = formatClaimType(claim.claim_type);
  const filedLabel = new Date(claim.created_at).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <ClaimViewMarker claimId={claim.id} />

      <Button variant="ghost" size="sm" className="-ml-2 gap-2" asChild>
        <Link href="/app/admin/claims">
          <ArrowLeft className="h-4 w-4" />
          All claims
        </Link>
      </Button>

      <PageHeader
        title={`${claimTitle} claim`}
        description={`Customer report filed ${filedLabel}${
          claim.shipment?.tracking_number
            ? ` · Shipment ${claim.shipment.tracking_number}`
            : ""
        }`}
        action={<ClaimRowMenu id={claim.id} currentStatus={claim.status} />}
      />

      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={claim.status} />
        {claim.staff_viewed_at ? (
          <Badge variant="secondary" className="font-normal">
            Opened by staff{" "}
            {new Date(claim.staff_viewed_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </Badge>
        ) : (
          <Badge className="font-normal bg-primary/15 text-primary hover:bg-primary/15">
            New — not yet opened
          </Badge>
        )}
      </div>

      <RelatedContextGrid
        items={[
          {
            label: "Customer",
            icon: <User className="h-3.5 w-3.5" />,
            primary: displayName(claim.customer),
            secondary: claim.customer?.email ?? "No email on file",
            href: claim.customer?.id
              ? `/app/superadmin/customers/${claim.customer.id}`
              : undefined,
          },
          {
            label: "Affected shipment",
            icon: <MapPin className="h-3.5 w-3.5" />,
            primary: claim.shipment ? (
              <TrackingId value={claim.shipment.tracking_number} />
            ) : (
              "No shipment linked"
            ),
            secondary: claim.shipment
              ? `${claim.shipment.origin} → ${claim.shipment.destination}`
              : undefined,
            href: claim.shipment?.id
              ? dashboardTrackingHref(claim.shipment.id)
              : undefined,
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                What the customer reported
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {claim.description}
              </p>
              {claim.resolution_notes ? (
                <div className="mt-5 pt-5 border-t space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Your team&apos;s resolution notes
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {claim.resolution_notes}
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <ActivitySection entityType="claim" entityId={claim.id} />
        </div>

        <div className="lg:col-span-2">
          <ClaimSlaPanel
            sla={sla}
            claimStatus={claim.status}
            insurancePartner={platform.cargo_insurance_partner}
            customsBroker={platform.customs_broker_contact}
          />
        </div>
      </div>
    </div>
  );
}
