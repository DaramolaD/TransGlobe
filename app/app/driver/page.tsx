import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { getPlatformSettings } from "@/lib/organization/platform-settings";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DriverJobCard } from "./DriverJobCard";

export default async function DriverTodayPage() {
  const [profile, platform] = await Promise.all([
    getCurrentProfile(),
    getPlatformSettings(),
  ]);
  const supabase = await createClient();

  const { data: assignments } = await supabase
    .from("assignments")
    .select("*, shipments(*)")
    .eq("driver_id", profile!.id)
    .in("status", ["pending", "accepted", "in_progress"])
    .order("assigned_at", { ascending: true });

  return (
    <div>
      <PageHeader title="Today's jobs" description="Pickups and deliveries assigned to you." />
      <div className="space-y-4">
        {(assignments ?? []).length === 0 && (
          <p className="text-muted-foreground text-sm">No active assignments. Check back when dispatch assigns you.</p>
        )}
        {(assignments ?? []).map((a) => (
          <DriverJobCard
            key={a.id}
            assignmentId={a.id}
            gpsUploadIntervalSec={platform.gps_publish_interval_sec}
            shipment={a.shipments as {
              id: string;
              tracking_number: string;
              origin: string;
              destination: string;
              status: string;
            }}
          />
        ))}
      </div>
    </div>
  );
}
