"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserRole } from "@/lib/actions/users";
import type { UserRole } from "@/lib/types/database";
import { toast } from "sonner";

const ALL_ROLES: UserRole[] = ["user", "driver", "sales", "admin", "superadmin"];
const TEAM_ROLES: UserRole[] = ["driver", "sales", "admin", "superadmin"];
const CUSTOMER_PROMOTE_ROLES: UserRole[] = ["user", "driver", "sales", "admin"];

export function UserRoleForm({
  userId,
  currentRole,
  mode = "team",
}: {
  userId: string;
  currentRole: UserRole;
  /** team = internal staff roles; customer = portal accounts; full = all roles */
  mode?: "team" | "customer" | "full";
}) {
  const roles =
    mode === "team"
      ? [...TEAM_ROLES, "user" as UserRole]
      : mode === "customer"
        ? CUSTOMER_PROMOTE_ROLES
        : ALL_ROLES;

  const [role, setRole] = useState(currentRole);
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    const r = await updateUserRole(userId, role);
    setLoading(false);
    if (r.error) toast.error(r.error);
    else toast.success("Role updated, user must sign in again for menu changes.");
  }

  return (
    <div className="flex gap-1">
      <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
        <SelectTrigger className="w-[120px] h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {roles.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm" onClick={save} disabled={loading}>
        Save
      </Button>
    </div>
  );
}
