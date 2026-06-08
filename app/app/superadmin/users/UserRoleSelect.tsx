"use client";

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

const ROLES: UserRole[] = ["superadmin", "admin", "sales", "driver", "user"];

export function UserRoleSelect({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: UserRole;
}) {
  async function onChange(role: UserRole) {
    const r = await updateUserRole(userId, role);
    if (r.error) toast.error(r.error);
    else toast.success("Role updated");
  }

  return (
    <Select defaultValue={currentRole} onValueChange={(v) => onChange(v as UserRole)}>
      <SelectTrigger className="w-[130px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((r) => (
          <SelectItem key={r} value={r}>
            {r}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
