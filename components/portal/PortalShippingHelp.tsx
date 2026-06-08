import Link from "next/link";
import { Info, Package, Truck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type PortalShippingHelpProps = {
  variant: "book" | "pickups" | "schedule-pickup";
  className?: string;
};

export function PortalShippingHelp({ variant, className }: PortalShippingHelpProps) {
  if (variant === "book") {
    return (
      <Alert className={cn("mb-6 border-primary/20 bg-primary/5", className)}>
        <Package className="text-primary" />
        <AlertTitle>When to book a shipment</AlertTitle>
        <AlertDescription>
          <p>
            Use this when you know the full send — who is shipping, who receives, package
            details, and the destination. You get a <strong>tracking number</strong> and can
            follow progress under{" "}
            <Link href="/app/portal/track" className="text-primary underline-offset-4 hover:underline">
              Track
            </Link>
            .
          </p>
          <p>
            <strong>Schedule pickup while booking:</strong> turn on{" "}
            <em>Schedule pickup from shipper address</em> in the form below. That creates your
            shipment <strong>and</strong> a linked pickup request at the shipper address — it
            appears on{" "}
            <Link href="/app/portal/pickups" className="text-primary underline-offset-4 hover:underline">
              Pickups
            </Link>{" "}
            and is tied to your new tracking number.
          </p>
          <p>
            Only need a driver to collect boxes, without a full booking yet? Use{" "}
            <Link href="/app/portal/pickups/schedule" className="text-primary underline-offset-4 hover:underline">
              Schedule pickup
            </Link>{" "}
            instead.
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  if (variant === "pickups") {
    return (
      <Alert className={cn("mb-6", className)}>
        <Truck className="text-muted-foreground" />
        <AlertTitle>What is a pickup?</AlertTitle>
        <AlertDescription>
          <p>
            A pickup is a <strong>collection request</strong> — you ask us to come to an address
            on a chosen date and time to collect package(s). It is not the same as tracking a full
            shipment route.
          </p>
          <p>
            Pickups can be <strong>standalone</strong> (collection only) or{" "}
            <strong>linked to a booking</strong> when you tick{" "}
            <em>Schedule pickup from shipper address</em> on{" "}
            <Link href="/app/portal/book" className="text-primary underline-offset-4 hover:underline">
              Book shipment
            </Link>
            . Linked pickups share the same tracking number as that shipment.
          </p>
          <p>
            To send something end-to-end with tracking, invoices, and delivery updates, use{" "}
            <Link href="/app/portal/book" className="text-primary underline-offset-4 hover:underline">
              Book shipment
            </Link>
            .
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className={cn("mb-6", className)}>
      <Info className="text-muted-foreground" />
      <AlertTitle>Standalone pickup request</AlertTitle>
      <AlertDescription>
        <p>
          This form requests a <strong>driver collection only</strong>. You will see it on your{" "}
          <Link href="/app/portal/pickups" className="text-primary underline-offset-4 hover:underline">
            Pickups
          </Link>{" "}
          list once submitted. Our team confirms the appointment.
        </p>
        <p>
          If you are ready to ship with full shipper/recipient details and want a{" "}
          <strong>tracking number</strong>, use{" "}
          <Link href="/app/portal/book" className="text-primary underline-offset-4 hover:underline">
            Book shipment
          </Link>{" "}
          and turn on <em>Schedule pickup from shipper address</em> — that books the shipment and
          creates a linked pickup in one step.
        </p>
      </AlertDescription>
    </Alert>
  );
}
