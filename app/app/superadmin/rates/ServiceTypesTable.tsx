"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ConfirmDeleteDialog } from "@/components/dashboard/ConfirmDeleteDialog";
import { Button } from "@/components/ui/button";
import { deleteServiceType } from "@/lib/actions/service-types";
import type { ServiceTypeCatalog } from "@/lib/types/database";
import { ServiceTypeFormDialog } from "./ServiceTypeFormDialog";
import { toast } from "sonner";

export function ServiceTypesTable({ types }: { types: ServiceTypeCatalog[] }) {
  const router = useRouter();
  const [pending, setPending] = useState<ServiceTypeCatalog | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!pending) return;
    setDeleting(true);
    const r = await deleteServiceType(pending.id);
    setDeleting(false);
    if (r.error) toast.error(r.error);
    else {
      toast.success("Service type deleted");
      setPending(null);
      router.refresh();
    }
  }

  return (
    <>
      <DataTable
        showIndex
        columns={[
          { key: "label", label: "Name" },
          { key: "slug", label: "Code" },
          { key: "position", label: "List position" },
          { key: "delivery", label: "Delivery" },
          { key: "active", label: "Active" },
          { key: "actions", label: "", className: "w-[140px] text-right" },
        ]}
        rows={types.map((t) => ({
          label: <span className="font-medium">{t.label}</span>,
          slug: <span className="font-mono text-xs text-muted-foreground">{t.slug}</span>,
          position: (
            <span
              className="text-sm tabular-nums text-muted-foreground"
              title="Lower numbers appear first for customers"
            >
              {t.sort_order}
            </span>
          ),
          delivery: (
            <span className="text-sm text-muted-foreground">{t.delivery_hint ?? "—"}</span>
          ),
          active: t.is_active ? (
            <StatusBadge status="active" />
          ) : (
            <StatusBadge status="inactive" />
          ),
          actions: (
            <div
              className="flex items-center justify-end gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <ServiceTypeFormDialog type={t} />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-destructive hover:text-destructive"
                onClick={() => setPending(t)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ),
        }))}
        emptyMessage="No service types yet."
      />

      <ConfirmDeleteDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setPending(null);
        }}
        title={
          pending ? `Delete service type “${pending.label}”?` : "Delete service type?"
        }
        description={
          pending
            ? `This removes “${pending.label}” (${pending.slug}) from your catalog. It will disappear from the estimator and booking screens. If it is linked to rate cards, quotes, or shipments, deletion will be blocked — turn it off with Active instead.`
            : undefined
        }
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </>
  );
}
