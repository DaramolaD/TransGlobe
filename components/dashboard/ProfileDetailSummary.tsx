import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { ActiveStatusBadge } from "@/components/dashboard/TableCells";
import { ProfileEditRoleDialog } from "@/components/dashboard/ProfileEditRoleDialog";
import { DetailMetaStack } from "@/components/dashboard/DetailFieldList";
import { buildProfileMetaItems } from "@/lib/dashboard/profile-detail-meta";
import type { ProfileActivityProfile } from "@/lib/profile-activity";
import type { UserRole } from "@/lib/types/database";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type ProfileDetailSummaryProps = {
  profile: ProfileActivityProfile;
  audience: "team" | "customer";
  role: UserRole;
  kindLabel: string;
  headerClass: string;
  iconClass: string;
  Icon: LucideIcon;
};

export function ProfileDetailSummary({
  profile,
  audience,
  role,
  kindLabel,
  headerClass,
  iconClass,
  Icon,
}: ProfileDetailSummaryProps) {
  const displayName = profile.full_name ?? profile.email ?? "Account";
  const displayRole = audience === "customer" ? "user" : role;

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className={cn("px-5 py-4 sm:px-6 sm:py-5", headerClass)}>
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 bg-background/90 shadow-sm",
              iconClass
            )}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="flex flex-1 items-start justify-between gap-3 min-w-0">
            <div className="min-w-0 space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {kindLabel}
              </p>
              <h1 className="text-xl sm:text-2xl font-bold leading-tight truncate">
                {displayName}
              </h1>
              <RoleBadge role={displayRole} />
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <ActiveStatusBadge active={profile.is_active} />
              <ProfileEditRoleDialog
                userId={profile.id}
                currentRole={role}
                mode={audience === "customer" ? "customer" : "team"}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t bg-background px-5 py-4 sm:px-6 sm:py-5">
        <DetailMetaStack
          className="max-w-lg"
          items={buildProfileMetaItems(profile)}
        />
      </div>
    </div>
  );
}
