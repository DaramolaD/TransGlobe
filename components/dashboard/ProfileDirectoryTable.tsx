"use client";

import { useCallback, useState } from "react";
import { DataTable, OVERVIEW_PREVIEW_ROWS } from "@/components/dashboard/DataTable";
import { ProfileDetailDialog } from "@/components/dashboard/ProfileDetailDialog";
import { ProfileRowActions } from "@/components/dashboard/ProfileRowActions";
import {
  ActiveStatusBadge,
  UserTableCell,
} from "@/components/dashboard/TableCells";
import type { ProfileListItem } from "@/lib/dashboard/profile-table-rows";
import { formatTableDate } from "@/lib/dashboard/table-details";
import type { DataTableRow } from "@/components/dashboard/DataTable";

type ProfileDirectoryTableProps = {
  profiles: ProfileListItem[];
  audience: "team" | "customer";
  emptyMessage: string;
  overview?: boolean;
  totalCount?: number;
};

export function ProfileDirectoryTable({
  profiles,
  audience,
  emptyMessage,
  overview = false,
  totalCount,
}: ProfileDirectoryTableProps) {
  const isTeam = audience === "team";
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<ProfileListItem | null>(null);

  const openPreview = useCallback((profile: ProfileListItem) => {
    setSelected(profile);
    setDialogOpen(true);
  }, []);

  const rows: DataTableRow[] = profiles.map((u) => {
    const base = {
      _id: u.id,
      email: (
        <span className="text-sm text-muted-foreground truncate block max-w-[200px]">
          {u.email ?? "—"}
        </span>
      ),
      status: <ActiveStatusBadge active={u.is_active} />,
      actions: (
        <ProfileRowActions
          profile={u}
          audience={audience}
          onViewPreview={() => openPreview(u)}
        />
      ),
    };

    if (isTeam) {
      return {
        ...base,
        member: <UserTableCell name={u.full_name ?? "—"} email={null} />,
      };
    }

    return {
      ...base,
      customer: <UserTableCell name={u.full_name ?? "—"} email={null} />,
      joined: (
        <span className="text-sm text-muted-foreground tabular-nums">
          {formatTableDate(u.created_at)}
        </span>
      ),
    };
  });

  const teamColumns = [
    { key: "member", label: "Team member", className: "min-w-[160px]" },
    { key: "email", label: "Email", className: "min-w-[160px]" },
    { key: "status", label: "Status", className: "w-[100px]" },
    { key: "actions", label: "", className: "w-12" },
  ];

  const customerColumns = [
    { key: "customer", label: "Customer", className: "min-w-[160px]" },
    { key: "email", label: "Email", className: "min-w-[160px]" },
    { key: "status", label: "Status", className: "w-[100px]" },
    {
      key: "joined",
      label: "Registered",
      className: overview ? "hidden sm:table-cell" : undefined,
    },
    { key: "actions", label: "", className: "w-12" },
  ];

  return (
    <>
      <DataTable
        embedded={overview}
        compact={overview}
        variant={overview ? "overview" : "default"}
        summaryLabel={isTeam ? "team members" : "customers"}
        paginate={!overview}
        maxRows={overview ? OVERVIEW_PREVIEW_ROWS : undefined}
        totalCount={overview ? totalCount : undefined}
        pageSize={overview ? OVERVIEW_PREVIEW_ROWS : 10}
        showIndex
        columns={isTeam ? teamColumns : customerColumns}
        rows={rows}
        emptyMessage={emptyMessage}
        onRowClick={(row) => {
          const profile = profiles.find((p) => p.id === row._id);
          if (profile) openPreview(profile);
        }}
      />

      <ProfileDetailDialog
        profile={selected}
        audience={audience}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
