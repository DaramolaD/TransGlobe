import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CustomerActivityTables } from "@/components/dashboard/CustomerActivityTables";
import { ProfileActivitySections } from "@/components/dashboard/ProfileActivitySections";
import { ProfileDetailSummary } from "@/components/dashboard/ProfileDetailSummary";
import { getProfileActivity } from "@/lib/actions/profile-activity";
import { DETAIL_KIND_CONFIG } from "@/lib/dashboard/detail-kinds";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserRole } from "@/lib/types/database";

export async function ProfileDetailPageContent({
  profileId,
  audience,
  backHref,
  backLabel,
}: {
  profileId: string;
  audience: "team" | "customer";
  backHref: string;
  backLabel: string;
}) {
  const { data: activity, error } = await getProfileActivity(profileId, {
    scope: "full",
  });

  if (error || !activity) notFound();

  const { profile } = activity;
  const role = profile.role as UserRole;

  if (audience === "customer" && role !== "user") notFound();
  if (audience === "team" && role === "user") notFound();

  const kind = audience === "customer" ? "customer" : "member";
  const kindMeta = DETAIL_KIND_CONFIG[kind];
  const KindIcon = kindMeta.icon;

  return (
    <div className="space-y-6 max-w-5xl">
      <Button variant="ghost" size="sm" className="-ml-2 gap-2" asChild>
        <Link href={backHref}>
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </Button>

      <ProfileDetailSummary
        profile={profile}
        audience={audience}
        role={role}
        kindLabel={kindMeta.label}
        headerClass={kindMeta.headerClass}
        iconClass={kindMeta.iconClass}
        Icon={KindIcon}
      />

      {audience === "customer" ? (
        <CustomerActivityTables activity={activity} />
      ) : (
        <Card className="overflow-hidden pt-0">
          <CardHeader className="border-b bg-muted/20 !py-5 gap-0">
            <CardTitle className="text-base font-semibold">Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ProfileActivitySections
              activity={activity}
              role={role}
              audience={audience}
              scope="full"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
