import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  draft: "bg-gray-100 text-gray-800",
  booked: "bg-indigo-100 text-indigo-800",
  in_transit: "bg-sky-100 text-sky-800",
  delivered: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  published: "bg-green-100 text-green-800",
  approved: "bg-green-100 text-green-800",
  exception: "bg-red-100 text-red-800",
  open: "bg-orange-100 text-orange-800",
  paid: "bg-green-100 text-green-800",
  sent: "bg-blue-100 text-blue-800",
  overdue: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-500",
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-600",
  contacted: "bg-violet-100 text-violet-800",
  qualified: "bg-amber-100 text-amber-800",
  converted: "bg-emerald-100 text-emerald-800",
  lost: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.replace(/\s+/g, "_").toLowerCase();
  return (
    <Badge variant="secondary" className={cn("capitalize", STATUS_STYLES[normalized])}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
