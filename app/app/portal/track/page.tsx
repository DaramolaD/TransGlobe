import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PortalTrackTable } from "./PortalTrackTable";

export default async function PortalTrackPage() {
  const profile = await getCurrentProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("shipments")
    .select("*")
    .eq("created_by", profile!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Track shipments"
        description="Search and filter your shipments. Click a row for details or open live tracking from the modal."
      />
      <PortalTrackTable shipments={data ?? []} />
    </div>
  );
}
