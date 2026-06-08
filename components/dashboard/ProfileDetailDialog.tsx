"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DetailModalShell } from "@/components/dashboard/DetailModalShell";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { ActiveStatusBadge } from "@/components/dashboard/TableCells";
import { ProfileActivitySections } from "@/components/dashboard/ProfileActivitySections";
import { getProfileActivity } from "@/lib/actions/profile-activity";
import type { ProfileActivityResult } from "@/lib/profile-activity";
import { DETAIL_KIND_CONFIG } from "@/lib/dashboard/detail-kinds";
import { profileDetailHref } from "@/lib/dashboard/profile-links";
import type { UserRole } from "@/lib/types/database";
import { DetailMetaStack } from "@/components/dashboard/DetailFieldList";
import { buildProfileMetaItems } from "@/lib/dashboard/profile-detail-meta";
import type { ProfileListItem } from "@/lib/dashboard/profile-table-rows";

function previewActivityLabel(role: UserRole, audience: "team" | "customer") {
  if (audience === "customer" || role === "user") return "Recent shipments";
  if (role === "driver") return "Recent assignments";
  return "Recent shipments";
}

export function ProfileDetailDialog({
  profile,
  audience,
  open,
  onOpenChange,
}: {
  profile: ProfileListItem | null;
  audience: "team" | "customer";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState<ProfileActivityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const kind = audience === "customer" ? "customer" : "member";
  const kindMeta = DETAIL_KIND_CONFIG[kind];
  const KindIcon = kindMeta.icon;

  useEffect(() => {
    if (!open || !profile) return;
    setLoading(true);
    setError(null);
    setActivity(null);
    getProfileActivity(profile.id, { scope: "preview" }).then((r) => {
      setLoading(false);
      if (r.error) setError(r.error);
      else setActivity(r.data);
    });
  }, [open, profile?.id]);

  if (!profile) return null;

  const role = profile.role as UserRole;
  const detailHref = profileDetailHref(profile.id, audience);
  const displayName = profile.full_name ?? profile.email ?? "Account";
  const activityLabel = previewActivityLabel(role, audience);
  const profileForMeta = activity?.profile ?? {
    id: profile.id,
    email: profile.email,
    phone: null,
    company_name: null,
    created_at: profile.created_at,
    updated_at: profile.created_at,
  };
  const metaItems = buildProfileMetaItems(profileForMeta);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DetailModalShell
        maxWidth="lg"
        headerClass={kindMeta.headerClass}
        icon={KindIcon}
        iconClass={kindMeta.iconClass}
        label={kindMeta.label}
        srTitle={displayName}
        footer={
          <Button asChild className="w-full sm:w-auto">
            <Link href={detailHref} onClick={() => onOpenChange(false)}>
              View full details
              <ArrowUpRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-1.5">
              <p className="text-xl font-bold leading-snug truncate">{displayName}</p>
              <RoleBadge role={audience === "team" ? role : "user"} />
            </div>
            <div className="shrink-0 pt-0.5">
              <ActiveStatusBadge active={profile.is_active} />
            </div>
          </div>

          <DetailMetaStack items={metaItems} />

          <div className="border-t pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              {activityLabel}
            </p>

            {loading && (
              <div className="flex items-center justify-center py-10 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Loading…
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive text-center py-8 rounded-md border border-dashed">
                {error}
              </p>
            )}

            {!loading && !error && activity && (
              <ProfileActivitySections
                activity={activity}
                role={role}
                audience={audience}
                scope="preview"
                showSectionTitle={false}
              />
            )}
          </div>
        </div>
      </DetailModalShell>
    </Dialog>
  );
}
