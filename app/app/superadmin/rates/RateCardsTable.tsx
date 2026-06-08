"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ConfirmDeleteDialog } from "@/components/dashboard/ConfirmDeleteDialog";
import { Button } from "@/components/ui/button";
import { deleteRateCard } from "@/lib/actions/rate-cards";
import type { RateCard, ServiceTypeCatalog } from "@/lib/types/database";
import { RateCardFormDialog } from "./RateCardFormDialog";
import { toast } from "sonner";

export function RateCardsTable({
  cards,
  serviceTypes,
}: {
  cards: RateCard[];
  serviceTypes: ServiceTypeCatalog[];
}) {
  const labelBySlug = Object.fromEntries(serviceTypes.map((t) => [t.slug, t.label]));
  const activeTypes = serviceTypes.filter((t) => t.is_active);
  const router = useRouter();
  const [pending, setPending] = useState<RateCard | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!pending) return;
    setDeleting(true);
    const r = await deleteRateCard(pending.id);
    setDeleting(false);
    if (r.error) toast.error(r.error);
    else {
      toast.success("Rate card deleted");
      setPending(null);
      router.refresh();
    }
  }

  return (
    <>
      <DataTable
        showIndex
        columns={[
          { key: "name", label: "Name" },
          { key: "service", label: "Service" },
          { key: "price", label: "$/kg" },
          { key: "min", label: "Min charge" },
          { key: "active", label: "Active" },
          { key: "actions", label: "", className: "w-[140px] text-right" },
        ]}
        rows={cards.map((r) => ({
          name: <span className="font-medium">{r.name}</span>,
          service: (
            <span className="text-sm text-muted-foreground">
              {labelBySlug[r.service_type] ?? r.service_type.replace(/_/g, " ")}
            </span>
          ),
          price: (
            <span className="tabular-nums text-sm">${Number(r.price_per_kg).toFixed(2)}</span>
          ),
          min: (
            <span className="tabular-nums text-sm text-muted-foreground">
              ${Number(r.min_charge ?? 0).toFixed(2)}
            </span>
          ),
          active: r.is_active ? (
            <StatusBadge status="active" />
          ) : (
            <StatusBadge status="inactive" />
          ),
          actions: (
            <div
              className="flex items-center justify-end gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <RateCardFormDialog card={r} serviceTypes={activeTypes} />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-destructive hover:text-destructive"
                onClick={() => setPending(r)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ),
        }))}
        emptyMessage="No rate cards yet. Add one to power the public estimator."
      />

      <ConfirmDeleteDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setPending(null);
        }}
        title={pending ? `Delete rate card “${pending.name}”?` : "Delete rate card?"}
        description={
          pending
            ? `This removes pricing for ${labelBySlug[pending.service_type] ?? pending.service_type}. The public estimator will no longer use this card for that service.`
            : undefined
        }
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </>
  );
}
