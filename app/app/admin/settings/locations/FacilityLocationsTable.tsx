"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ConfirmDeleteDialog } from "@/components/dashboard/ConfirmDeleteDialog";
import { facilityDetailRow } from "@/lib/dashboard/table-details";
import { deleteFacilityLocation } from "@/lib/actions/facilities";
import { facilityTypeLabel } from "@/lib/facility-types/utils";
import type { FacilityTypeCatalog } from "@/lib/types/database";
import type { FacilityLocationRow } from "@/lib/types/tracking";
import { FacilityLocationFormDialog } from "./FacilityLocationFormDialog";
import { toast } from "sonner";

export function FacilityLocationsTable({
  locations,
  facilityTypes,
}: {
  locations: FacilityLocationRow[];
  facilityTypes: FacilityTypeCatalog[];
}) {
  const router = useRouter();
  const [pending, setPending] = useState<FacilityLocationRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!pending) return;
    setDeleting(true);
    const r = await deleteFacilityLocation(pending.id);
    setDeleting(false);
    if (r.error) toast.error(r.error);
    else {
      toast.success("Location removed");
      setPending(null);
      router.refresh();
    }
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <FacilityLocationFormDialog facilityTypes={facilityTypes} />
      </div>

      <DataTable
        showIndex
        columns={[
          { key: "name", label: "Name" },
          { key: "type", label: "Type" },
          { key: "region", label: "City / region" },
          { key: "coords", label: "Coordinates" },
          { key: "active", label: "Status" },
          { key: "actions", label: "", className: "w-[140px] text-right" },
        ]}
        rows={locations.map((row) => ({
          _id: row.id,
          _detail: facilityDetailRow(row),
          name: <span className="font-medium">{row.name}</span>,
          type: (
            <span className="text-sm text-muted-foreground">
              {facilityTypeLabel(row.facility_type, facilityTypes)}
            </span>
          ),
          region: (
            <span className="text-sm text-muted-foreground">
              {[row.city, row.state, row.country].filter(Boolean).join(", ") || "—"}
            </span>
          ),
          coords: (
            <span className="font-mono text-xs tabular-nums">
              {row.latitude.toFixed(4)}, {row.longitude.toFixed(4)}
            </span>
          ),
          active: row.is_active ? (
            <StatusBadge status="active" />
          ) : (
            <StatusBadge status="inactive" />
          ),
          actions: (
            <div
              className="flex items-center justify-end gap-1"
              data-no-row-click
              onClick={(e) => e.stopPropagation()}
            >
              <FacilityLocationFormDialog location={row} facilityTypes={facilityTypes} />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-destructive hover:text-destructive"
                onClick={() => setPending(row)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ),
        }))}
        emptyMessage="No facilities yet. Add a warehouse or hub to attach real map coordinates to tracking updates."
      />

      <ConfirmDeleteDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setPending(null);
        }}
        title={pending ? `Delete “${pending.name}”?` : "Delete location?"}
        description="Only unused locations can be deleted. Deactivate instead if tracking events reference this place."
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </>
  );
}
