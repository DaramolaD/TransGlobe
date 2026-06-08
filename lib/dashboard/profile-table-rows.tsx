import type { DataTableRow } from "@/components/dashboard/DataTable";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import {
  ActiveStatusBadge,
  UserTableCell,
} from "@/components/dashboard/TableCells";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/lib/auth/roles";
import type { UserRole } from "@/lib/types/database";
import { formatTableDate } from "@/lib/dashboard/table-details";

export type ProfileListItem = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
};

export function staffTableRows(
  profiles: ProfileListItem[],
  options?: { href?: string; hrefLabel?: string }
): DataTableRow[] {
  const href = options?.href ?? "/app/superadmin/users";
  const hrefLabel = options?.hrefLabel ?? "Manage team roles";

  return profiles.map((u) => ({
    _id: u.id,
    _detail: {
      kind: "member" as const,
      title: u.full_name ?? u.email ?? "Team member",
      subtitle: u.email ?? undefined,
      fields: [
        { label: "Role", value: <RoleBadge role={u.role as UserRole} /> },
        { label: "Status", value: u.is_active ? "Active" : "Inactive" },
        { label: "Joined", value: formatTableDate(u.created_at) },
      ],
      href,
      hrefLabel,
    },
    member: <UserTableCell name={u.full_name ?? "—"} email={u.email} />,
    role: <RoleBadge role={u.role as UserRole} />,
    status: <ActiveStatusBadge active={u.is_active} />,
  }));
}

export function customerTableRows(
  profiles: ProfileListItem[],
  options?: { href?: string; hrefLabel?: string }
): DataTableRow[] {
  const href = options?.href ?? "/app/superadmin/customers";
  const hrefLabel = options?.hrefLabel ?? "View all customers";

  return profiles.map((u) => ({
    _id: u.id,
    _detail: {
      kind: "customer" as const,
      title: u.full_name ?? u.email ?? "Customer",
      subtitle: u.email ?? undefined,
      fields: [
        {
          label: "Account",
          value: (
            <Badge variant="outline" className="bg-slate-50">
              {ROLE_LABELS.user}
            </Badge>
          ),
        },
        { label: "Status", value: u.is_active ? "Active" : "Inactive" },
        { label: "Registered", value: formatTableDate(u.created_at) },
      ],
      href,
      hrefLabel,
    },
    customer: <UserTableCell name={u.full_name ?? "—"} email={u.email} />,
    status: <ActiveStatusBadge active={u.is_active} />,
    joined: (
      <span className="text-sm text-muted-foreground tabular-nums">
        {formatTableDate(u.created_at)}
      </span>
    ),
  }));
}
