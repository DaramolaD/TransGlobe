"use client";

import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DetailModalShell } from "@/components/dashboard/DetailModalShell";
import { DetailFieldList } from "@/components/dashboard/DetailFieldList";
import { DETAIL_KIND_CONFIG } from "@/lib/dashboard/detail-kinds";
import type { DataTableDetail } from "./DataTable";

function shipmentFields(detail: DataTableDetail) {
  const routeRow = detail.subtitle
    ? [{ label: "Route", value: detail.subtitle }]
    : [];
  return [...routeRow, ...detail.fields];
}

export function DataTableDetailModal({
  detail,
  open,
  onOpenChange,
}: {
  detail: DataTableDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!detail) return null;

  const kindMeta = detail.kind ? DETAIL_KIND_CONFIG[detail.kind] : null;
  const Icon = kindMeta?.icon ?? FileText;

  const footer = detail.href ? (
    <Button asChild className="w-full sm:w-auto">
      <Link href={detail.href} onClick={() => onOpenChange(false)}>
        {detail.hrefLabel ?? "View full details"}
        <ArrowUpRight className="ml-1.5 h-4 w-4" />
      </Link>
    </Button>
  ) : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DetailModalShell
        headerClass={kindMeta?.headerClass ?? "bg-muted/40"}
        icon={Icon}
        iconClass={
          kindMeta?.iconClass ?? "bg-muted text-muted-foreground ring-border"
        }
        label={kindMeta?.label ?? "Details"}
        srTitle={detail.title}
        footer={footer}
      >
        <div className="space-y-3">
          {detail.kind === "shipment" ? (
            <DetailFieldList fields={shipmentFields(detail)} />
          ) : detail.kind === "pickup" ? (
            <>
              <div className="space-y-1">
                <p className="text-xl font-bold leading-snug truncate">{detail.title}</p>
                {detail.subtitle ? (
                  <p className="text-sm font-medium text-muted-foreground tabular-nums">
                    {detail.subtitle}
                  </p>
                ) : null}
              </div>
              <DetailFieldList fields={detail.fields} />
            </>
          ) : (
            <>
              <div className="space-y-1">
                <p className="text-xl font-bold leading-snug truncate">{detail.title}</p>
                {detail.subtitle ? (
                  <p className="text-sm text-muted-foreground truncate">{detail.subtitle}</p>
                ) : null}
              </div>
              <DetailFieldList fields={detail.fields} />
            </>
          )}
        </div>
      </DetailModalShell>
    </Dialog>
  );
}
