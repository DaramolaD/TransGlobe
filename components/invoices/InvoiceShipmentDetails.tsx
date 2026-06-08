import { ImageIcon, MapPin, Package, Truck } from "lucide-react";
import { DeliveryReceiptCard } from "@/components/tracking/DeliveryReceiptCard";
import {
  RouteJourneyFromParties,
  RouteJourneyLegacy,
} from "@/components/tracking/RouteJourneyTimeline";
import type { InvoiceShipmentDetails } from "@/lib/invoices/shipment-invoice-display";

function PackageCard({ pkg, index }: { pkg: InvoiceShipmentDetails["packages"][0]; index: number }) {
  return (
    <div className="rounded-lg border bg-background p-3 flex gap-3">
      {pkg.imageName ? (
        <div className="shrink-0 h-16 w-16 rounded-md border bg-muted/40 flex flex-col items-center justify-center text-center p-1">
          <ImageIcon className="h-5 w-5 text-muted-foreground mb-0.5" />
          <span className="text-[9px] text-muted-foreground leading-tight line-clamp-2">
            Photo on file
          </span>
        </div>
      ) : (
        <div className="shrink-0 h-16 w-16 rounded-md border bg-muted/30 flex items-center justify-center">
          <Package className="h-6 w-6 text-muted-foreground/70" />
        </div>
      )}
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm font-medium">
          Package {index + 1}
          {pkg.quantity > 1 ? ` × ${pkg.quantity}` : ""}
        </p>
        <p className="text-sm text-muted-foreground">{pkg.description}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          {pkg.weightKg != null && pkg.weightKg > 0 ? (
            <span>{pkg.weightKg} kg</span>
          ) : null}
          {pkg.dimensions ? <span>{pkg.dimensions}</span> : null}
          {pkg.packageType ? (
            <span className="capitalize">{pkg.packageType.replace(/_/g, " ")}</span>
          ) : null}
        </div>
        {pkg.imageName ? (
          <p className="text-xs text-muted-foreground truncate" title={pkg.imageName}>
            Reference image: {pkg.imageName}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function InvoiceShipmentDetails({
  details,
  trackingHref,
}: {
  details: InvoiceShipmentDetails;
  trackingHref?: string;
}) {
  return (
    <section className="mb-8 space-y-5">
      <DeliveryReceiptCard
        subtitle="Invoice shipment"
        title="What you are paying for"
        headerExtra={
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-2">
              <Truck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{details.serviceLabel} shipment</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" />
                  {details.routeSummary}
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-dashed bg-background px-4 py-2.5 sm:text-right shrink-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Tracking number
              </p>
              {trackingHref ? (
                <a
                  href={trackingHref}
                  className="font-mono text-sm font-bold text-primary hover:underline mt-0.5 inline-block"
                >
                  {details.trackingNumber}
                </a>
              ) : (
                <p className="font-mono text-sm font-bold mt-0.5">{details.trackingNumber}</p>
              )}
              <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground mt-1 sm:justify-end">
                {details.packageCount != null ? (
                  <span>
                    {details.packageCount} pkg{details.packageCount === 1 ? "" : "s"}
                  </span>
                ) : null}
                {details.weightKg != null && details.weightKg > 0 ? (
                  <span>{details.weightKg} kg</span>
                ) : null}
              </div>
            </div>
          </div>
        }
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
          Shipment route
        </p>
        {details.hasStructuredData && details.shipper && details.recipient ? (
          <RouteJourneyFromParties
            shipper={details.shipper}
            recipient={details.recipient}
            routeSummary={details.routeSummary}
          />
        ) : (
          <RouteJourneyLegacy
            origin={details.legacyOrigin}
            destination={details.legacyDestination}
            routeSummary={details.routeSummary}
          />
        )}
      </DeliveryReceiptCard>

      {details.packages.length > 0 ? (
        <DeliveryReceiptCard subtitle="Contents" title="Packages">
          <div className="grid gap-2 sm:grid-cols-1">
            {details.packages.map((pkg, i) => (
              <PackageCard key={`${pkg.description}-${i}`} pkg={pkg} index={i} />
            ))}
          </div>
        </DeliveryReceiptCard>
      ) : null}

      {(details.goodsDescription || details.referenceNumber) && (
        <div className="text-sm space-y-1 rounded-lg border bg-muted/20 px-4 py-3">
          {details.referenceNumber ? (
            <p>
              <span className="text-muted-foreground">Your reference:</span>{" "}
              <span className="font-medium">{details.referenceNumber}</span>
            </p>
          ) : null}
          {details.goodsDescription ? (
            <p>
              <span className="text-muted-foreground">Contents:</span> {details.goodsDescription}
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}
