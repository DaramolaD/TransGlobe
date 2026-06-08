"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function OverviewTableFooter({
  total,
  page,
  pageSize,
  onPageChange,
  summaryLabel,
  embedded = false,
  summaryOnly = false,
  totalCount,
}: {
  /** Rows shown in the table */
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  /** Plural label, e.g. "team members" → "2 team members" */
  summaryLabel: string;
  embedded?: boolean;
  /** Overview snapshot tables — no pagination controls */
  summaryOnly?: boolean;
  /** Full count in database when table shows a preview cap */
  totalCount?: number;
}) {
  if (total === 0) return null;

  const fullTotal = totalCount ?? total;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const rangeStart = (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, total);
  const needsPagination = !summaryOnly && total > pageSize;
  const isPreview = summaryOnly && fullTotal > total;

  return (
    <div
      className={cn(
        "border-t px-4 py-3",
        embedded ? "bg-muted/10" : "bg-muted/20"
      )}
    >
      {!needsPagination ? (
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          {isPreview ? (
            <>
              Latest{" "}
              <span className="font-medium text-foreground tabular-nums">{total}</span> of{" "}
              <span className="font-medium text-foreground tabular-nums">{fullTotal}</span>{" "}
              {summaryLabel}
            </>
          ) : (
            <>
              <span className="font-medium text-foreground tabular-nums">{total}</span>{" "}
              {summaryLabel}
            </>
          )}
        </p>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="text-sm text-muted-foreground text-center sm:text-left shrink-0">
            Showing{" "}
            <span className="font-medium text-foreground tabular-nums">
              {rangeStart}–{rangeEnd}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground tabular-nums">{total}</span>
          </p>

          <nav
            className="flex items-center justify-center gap-0 rounded-md border border-border/80 bg-background shadow-sm"
            aria-label="Overview table pagination"
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 rounded-none rounded-l-md px-3 text-xs font-normal text-muted-foreground hover:text-foreground disabled:opacity-40"
              disabled={safePage <= 1}
              onClick={() => onPageChange(Math.max(1, safePage - 1))}
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-0.5" />
              Previous
            </Button>

            <span
              className="flex h-8 items-center border-x border-border/80 px-4 text-xs font-medium text-muted-foreground whitespace-nowrap"
              aria-live="polite"
            >
              Page{" "}
              <span className="mx-1 tabular-nums text-foreground">{safePage}</span>
              of{" "}
              <span className="ml-1 tabular-nums text-foreground">{totalPages}</span>
            </span>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 rounded-none rounded-r-md px-3 text-xs font-normal text-muted-foreground hover:text-foreground disabled:opacity-40"
              disabled={safePage >= totalPages}
              onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
            >
              Next
              <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
}
