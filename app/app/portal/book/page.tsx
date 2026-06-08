import { PageHeader } from "@/components/dashboard/PageHeader";
import { PortalShippingHelp } from "@/components/portal/PortalShippingHelp";
import { getCurrentProfile } from "@/lib/auth/session";
import { getBookingPlatformConfig } from "@/lib/organization/platform-settings";
import { BookShipmentForm } from "./BookShipmentForm";

export default async function PortalBookPage() {
  const [profile, platformConfig] = await Promise.all([
    getCurrentProfile(),
    getBookingPlatformConfig(),
  ]);

  return (
    <div>
      <PageHeader
        title="Book a shipment"
        description="Full send from origin to destination — with optional pickup at the shipper address."
      />
      <PortalShippingHelp variant="book" />
      <BookShipmentForm
        platformConfig={platformConfig}
        defaultShipper={{
          name: profile?.full_name ?? undefined,
          email: profile?.email ?? undefined,
          phone: profile?.phone ?? undefined,
          company: profile?.company_name ?? undefined,
        }}
      />
    </div>
  );
}
