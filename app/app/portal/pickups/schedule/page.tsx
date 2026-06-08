import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth/session";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PortalShippingHelp } from "@/components/portal/PortalShippingHelp";
import { Button } from "@/components/ui/button";
import { SchedulePickupForm } from "./SchedulePickupForm";

export default async function SchedulePickupPage() {
  const profile = await getCurrentProfile();

  return (
    <div>
      <PageHeader
        title="Schedule pickup"
        description="Request a driver collection from your address — stays inside your portal."
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href="/app/portal/pickups">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to pickups
            </Link>
          </Button>
        }
      />
      <PortalShippingHelp variant="schedule-pickup" />
      <SchedulePickupForm
        defaultContact={{
          name: profile?.full_name ?? undefined,
          email: profile?.email ?? undefined,
          phone: profile?.phone ?? undefined,
        }}
      />
    </div>
  );
}
