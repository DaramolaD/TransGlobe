import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/auth/roles";
import type { UserRole } from "@/lib/types/database";

const ROLE_STYLES: Record<UserRole, string> = {
  superadmin: "border-violet-200 bg-violet-50 text-violet-800",
  admin: "border-blue-200 bg-blue-50 text-blue-800",
  sales: "border-teal-200 bg-teal-50 text-teal-800",
  driver: "border-amber-200 bg-amber-50 text-amber-900",
  user: "border-slate-200 bg-slate-50 text-slate-700",
};

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <Badge variant="outline" className={cn("font-medium", ROLE_STYLES[role])}>
      {ROLE_LABELS[role]}
    </Badge>
  );
}
