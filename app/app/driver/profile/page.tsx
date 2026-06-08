import { getCurrentProfile } from "@/lib/auth/session";
import { getMyDriverAvailability } from "@/lib/actions/driver-availability";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvailabilityToggle } from "@/components/driver/AvailabilityToggle";

export default async function DriverProfilePage() {
  const profile = await getCurrentProfile();
  const { data: availability } = await getMyDriverAvailability();

  return (
    <div>
      <PageHeader title="Profile" description="Your driver account." />
      <div className="mb-6">
        <AvailabilityToggle
          initialStatus={availability?.status ?? "offline"}
          initialReason={availability?.reason}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{profile?.full_name}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>Email: {profile?.email}</p>
          <p>Phone: {profile?.phone ?? "—"}</p>
          <p className="capitalize">Role: {profile?.role}</p>
        </CardContent>
      </Card>
    </div>
  );
}
