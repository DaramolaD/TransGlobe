import { Mail, MapPin, Phone } from "lucide-react";
import {
  DeliveryTimeline,
  type DeliveryTimelineStep,
} from "@/components/tracking/DeliveryTimeline";
import type { InvoicePartyDisplay } from "@/lib/invoices/shipment-invoice-display";

function PartyStepDetail({ party }: { party: InvoicePartyDisplay }) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-foreground">{party.name}</p>
      {party.company ? (
        <p className="text-sm text-muted-foreground">{party.company}</p>
      ) : null}
      <div className="rounded-md border bg-background/80 px-3 py-2 space-y-0.5">
        {party.addressLines.map((line, i) => (
          <p key={`${line}-${i}`} className="text-sm leading-relaxed">
            {line}
          </p>
        ))}
      </div>
      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        {party.phone ? (
          <span className="flex items-center gap-1.5">
            <Phone className="h-3 w-3" />
            {party.phone}
          </span>
        ) : null}
        {party.email ? (
          <span className="flex items-center gap-1.5">
            <Mail className="h-3 w-3" />
            {party.email}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function cityLine(party: InvoicePartyDisplay): string {
  const lines = party.addressLines;
  if (lines.length >= 2) return lines[lines.length - 2];
  return lines[0] ?? party.name;
}

function legacyDetail(text: string) {
  return <p className="text-sm leading-relaxed break-words">{text}</p>;
}

export function InvoiceRouteTimeline({
  shipper,
  recipient,
  routeSummary,
  legacyOrigin,
  legacyDestination,
}: {
  shipper?: InvoicePartyDisplay | null;
  recipient?: InvoicePartyDisplay | null;
  routeSummary: string;
  legacyOrigin?: string;
  legacyDestination?: string;
}) {
  const steps: DeliveryTimelineStep[] = [];

  if (shipper && recipient) {
    steps.push(
      {
        id: "from",
        title: "Ship from",
        subtitle: cityLine(shipper),
        state: "completed",
        detail: <PartyStepDetail party={shipper} />,
      },
      {
        id: "to",
        title: "Deliver to",
        subtitle: cityLine(recipient),
        state: "current",
        detail: <PartyStepDetail party={recipient} />,
      }
    );
  } else {
    steps.push(
      {
        id: "from",
        title: "Ship from",
        subtitle: "Origin",
        state: "completed",
        detail: legacyDetail(legacyOrigin ?? "—"),
      },
      {
        id: "to",
        title: "Deliver to",
        subtitle: "Destination",
        state: "current",
        detail: legacyDetail(legacyDestination ?? "—"),
      }
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b bg-muted/30 flex items-center gap-2 text-xs text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span>Your shipment route · {routeSummary}</span>
      </div>
      <div className="px-4 py-5 sm:px-5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Where your package goes
        </p>
        <DeliveryTimeline steps={steps} />
      </div>
    </div>
  );
}
