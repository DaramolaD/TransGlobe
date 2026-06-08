import { Mail, MapPin, Phone } from "lucide-react";
import { DeliveryTimeline, type DeliveryTimelineStep } from "./DeliveryTimeline";
import type { InvoicePartyDisplay } from "@/lib/invoices/shipment-invoice-display";

function PartyStepDetail({ party }: { party: InvoicePartyDisplay }) {
  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium">{party.name}</p>
      {party.company ? (
        <p className="text-muted-foreground text-xs">{party.company}</p>
      ) : null}
      <div className="rounded-md border bg-background/80 px-3 py-2 space-y-0.5 text-muted-foreground">
        {party.addressLines.map((line, i) => (
          <p key={`${line}-${i}`} className={i === party.addressLines.length - 1 ? "text-foreground font-medium" : ""}>
            {line}
          </p>
        ))}
      </div>
      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        {party.phone ? (
          <span className="inline-flex items-center gap-1.5">
            <Phone className="h-3 w-3" />
            {party.phone}
          </span>
        ) : null}
        {party.email ? (
          <span className="inline-flex items-center gap-1.5 min-w-0">
            <Mail className="h-3 w-3 shrink-0" />
            <span className="truncate">{party.email}</span>
          </span>
        ) : null}
      </div>
    </div>
  );
}

function LegacyAddressDetail({ text }: { text: string }) {
  return (
    <p className="text-sm text-muted-foreground leading-relaxed break-words rounded-md border bg-background/80 px-3 py-2">
      {text}
    </p>
  );
}

export function RouteJourneyTimeline({
  fromTitle,
  fromSubtitle,
  fromDetail,
  toTitle,
  toSubtitle,
  toDetail,
  routeSummary,
}: {
  fromTitle: string;
  fromSubtitle?: string;
  fromDetail?: React.ReactNode;
  toTitle: string;
  toSubtitle?: string;
  toDetail?: React.ReactNode;
  routeSummary?: string;
}) {
  const steps: DeliveryTimelineStep[] = [
    {
      id: "origin",
      title: fromTitle,
      subtitle: fromSubtitle ?? "Origin · pickup location",
      detail: fromDetail,
      state: "completed",
    },
    {
      id: "destination",
      title: toTitle,
      subtitle: toSubtitle ?? "Destination · delivery location",
      detail: toDetail,
      state: "current",
    },
  ];

  return (
    <div className="space-y-4">
      {routeSummary ? (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5 px-1">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" />
          <span>{routeSummary}</span>
        </p>
      ) : null}
      <DeliveryTimeline steps={steps} />
      <p className="text-[10px] text-muted-foreground text-center uppercase tracking-wide">
        Your shipment travels along this route
      </p>
    </div>
  );
}

export function RouteJourneyFromParties({
  shipper,
  recipient,
  routeSummary,
}: {
  shipper: InvoicePartyDisplay;
  recipient: InvoicePartyDisplay;
  routeSummary: string;
}) {
  const fromCity =
    shipper.addressLines.length >= 2
      ? shipper.addressLines[shipper.addressLines.length - 2]
      : shipper.addressLines[0];
  const toCity =
    recipient.addressLines.length >= 2
      ? recipient.addressLines[recipient.addressLines.length - 2]
      : recipient.addressLines[0];

  return (
    <RouteJourneyTimeline
      routeSummary={routeSummary}
      fromTitle={`Ship from — ${fromCity}`}
      fromSubtitle={`${shipper.name} · pickup`}
      fromDetail={<PartyStepDetail party={shipper} />}
      toTitle={`Deliver to — ${toCity}`}
      toSubtitle={`${recipient.name} · destination`}
      toDetail={<PartyStepDetail party={recipient} />}
    />
  );
}

export function RouteJourneyLegacy({
  origin,
  destination,
  routeSummary,
}: {
  origin?: string;
  destination?: string;
  routeSummary?: string;
}) {
  return (
    <RouteJourneyTimeline
      routeSummary={routeSummary}
      fromTitle="Ship from"
      fromSubtitle="Where the package starts"
      fromDetail={origin ? <LegacyAddressDetail text={origin} /> : undefined}
      toTitle="Deliver to"
      toSubtitle="Where the package is going"
      toDetail={destination ? <LegacyAddressDetail text={destination} /> : undefined}
    />
  );
}
