"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ConfirmDeleteDialog } from "@/components/dashboard/ConfirmDeleteDialog";
import { Button } from "@/components/ui/button";
import { deleteFacilityType } from "@/lib/actions/facility-types";
import type { FacilityTypeCatalog } from "@/lib/types/database";
import { FacilityTypeFormDialog } from "./FacilityTypeFormDialog";
import { toast } from "sonner";

export function FacilityTypesTable({ types }: { types: FacilityTypeCatalog[] }) {
  const router = useRouter();
  const [pending, setPending] = useState<FacilityTypeCatalog | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!pending) return;
    setDeleting(true);
    const r = await deleteFacilityType(pending.id);
    setDeleting(false);
    if (r.error) toast.error(r.error);
    else {
      toast.success("Facility type deleted");
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
          { key: "position", label: "Sort order" },
          { key: "active", label: "Status" },
          { key: "actions", label: "", className: "w-[140px] text-right" },
        ]}
        rows={types.map((t) => ({
          label: <span className="font-medium">{t.label}</span>,
          slug: <span className="font-mono text-xs text-muted-foreground">{t.slug}</span>,
          position: (
            <span className="text-sm tabular-nums text-muted-foreground">
              {t.sort_order}
            </span>
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
              <FacilityTypeFormDialog type={t} />
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
        emptyMessage="No facility types yet. Add types before creating locations."
      />

      <ConfirmDeleteDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setPending(null);
        }}
        title={
          pending ? `Delete facility type “${pending.label}”?` : "Delete facility type?"
        }
        description={
          pending
            ? `Removes “${pending.label}” (${pending.slug}) from the catalog. Deletion is blocked if any location uses this type — deactivate it instead.`
            : undefined
        }
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </>
  );
}
