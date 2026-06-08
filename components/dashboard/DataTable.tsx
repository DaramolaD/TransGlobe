"use client";

import { useCallback, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DataTableDetailKind } from "@/lib/dashboard/detail-kinds";
import { DataTableDetailModal } from "./DataTableDetailModal";
import { OverviewTableFooter } from "./OverviewTableFooter";

export type { DataTableDetailKind };

export type DataTableColumn = {
  key: string;
  label: string;
  className?: string;
  /** Default true for text columns; set false for badges, menus, etc. */
  truncate?: boolean;
};

export type DataTableDetailField = {
  label: string;
  value: React.ReactNode;
};

export type DataTableDetail = {
  /** Shown at top of modal so users know what they opened */
  kind?: DataTableDetailKind;
  title: string;
  subtitle?: string;
  fields: DataTableDetailField[];
  href?: string;
  hrefLabel?: string;
};

const ROW_META_KEYS = [
  "_id",
  "_href",
  "_detail",
  "_disableRowClick",
  "_searchText",
] as const;

/** Row cells plus optional meta — meta keys are not rendered as columns */
export type DataTableRow = {
  _id?: string;
  /** Full page link — shown as button inside detail modal */
  _href?: string;
  /** Opens detail modal on row click */
  _detail?: DataTableDetail;
  /** Skip opening detail modal on row click (use row actions menu instead) */
  _disableRowClick?: boolean;
  [key: string]: React.ReactNode | DataTableDetail | boolean | undefined;
};

function isDataTableDetail(value: unknown): value is DataTableDetail {
  return (
    typeof value === "object" &&
    value !== null &&
    "title" in value &&
    "fields" in value &&
    Array.isArray((value as DataTableDetail).fields)
  );
}

function extractRowCells(row: DataTableRow): Record<string, React.ReactNode> {
  const cells: Record<string, React.ReactNode> = {};
  for (const [key, value] of Object.entries(row)) {
    if ((ROW_META_KEYS as readonly string[]).includes(key)) continue;
    if (isDataTableDetail(value)) continue;
    if (value !== undefined) cells[key] = value as React.ReactNode;
  }
  return cells;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

/** Columns that should not get ellipsis wrapping */
const NO_TRUNCATE_COLUMN_KEYS = new Set([
  "menu",
  "actions",
  "billing",
  "invoice",
  "invoiceStatus",
  "open",
  "status",
  "tracking",
  "review",
]);

const DEFAULT_COLUMN_MAX: Partial<Record<string, string>> = {
  route: "max-w-[220px]",
  customer: "max-w-[160px]",
  driver: "max-w-[140px]",
  email: "max-w-[200px]",
  name: "max-w-[180px]",
  company: "max-w-[160px]",
  description: "max-w-[240px]",
  notes: "max-w-[240px]",
  summary: "max-w-[240px]",
  type: "max-w-[120px]",
  service: "max-w-[120px]",
  total: "max-w-[100px]",
  amount: "max-w-[100px]",
  number: "max-w-[120px]",
  shipment: "max-w-[140px]",
  date: "max-w-[110px]",
  due: "max-w-[110px]",
  address: "max-w-[220px]",
};

function shouldTruncateColumn(column: DataTableColumn): boolean {
  if (column.truncate === false) return false;
  if (column.truncate === true) return true;
  return !NO_TRUNCATE_COLUMN_KEYS.has(column.key);
}

function cellTitle(value: React.ReactNode): string | undefined {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  return undefined;
}

function renderCellContent(
  column: DataTableColumn,
  value: React.ReactNode
): React.ReactNode {
  if (!shouldTruncateColumn(column)) {
    return value;
  }

  return (
    <div
      className="min-w-0 max-w-full truncate"
      title={cellTitle(value)}
    >
      {value}
    </div>
  );
}

export const OVERVIEW_PREVIEW_ROWS = 5;

export function DataTable({
  columns,
  rows,
  emptyMessage = "No data yet.",
  showIndex = true,
  pageSize: defaultPageSize = 10,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  embedded = false,
  compact = false,
  variant = "default",
  summaryLabel,
  paginate = true,
  maxRows,
  totalCount,
  onRowClick,
}: {
  columns: DataTableColumn[];
  rows: DataTableRow[];
  emptyMessage?: string;
  showIndex?: boolean;
  pageSize?: number;
  pageSizeOptions?: readonly number[];
  /** Inside OverviewTablePanel — no outer card chrome */
  embedded?: boolean;
  /** Tighter rows for dashboard overview panels */
  compact?: boolean;
  /** Lightweight footer for overview dashboards only */
  variant?: "default" | "overview";
  /** Plural noun for single-page summary, e.g. "team members" */
  summaryLabel?: string;
  /** When false, show all rows and summary-only footer (overview team/customer) */
  paginate?: boolean;
  /** Cap visible rows (e.g. 5 on overview previews) */
  maxRows?: number;
  /** Full record count when preview is capped */
  totalCount?: number;
  /** Custom row handler (e.g. profile preview dialog) */
  onRowClick?: (row: DataTableRow) => void;
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeDetail, setActiveDetail] = useState<DataTableDetail | null>(null);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

  const safePage = Math.min(page, totalPages);

  const pageRows = useMemo(() => {
    let visible = rows;
    if (!paginate) {
      if (maxRows != null) visible = rows.slice(0, maxRows);
    } else {
      const start = (safePage - 1) * pageSize;
      visible = rows.slice(start, start + pageSize);
    }
    return visible;
  }, [rows, safePage, pageSize, paginate, maxRows]);

  function openDetail(detail: DataTableDetail) {
    setActiveDetail(detail);
    setDetailOpen(true);
  }

  function activateRow(row: DataTableRow) {
    if (onRowClick) {
      onRowClick(row);
      return;
    }
    const _detail = row._detail;
    const _href = row._href;
    if (_detail) {
      openDetail({
        ..._detail,
        href: _detail.href ?? _href,
        hrefLabel: _detail.hrefLabel ?? "View full details",
      });
      return;
    }
    if (_href) {
      const cells = extractRowCells(row);
      openDetail({
        kind: undefined,
        title: "Details",
        fields: columns
          .filter((c) => cells[c.key] != null && cells[c.key] !== "")
          .map((c) => ({
            label: c.label,
            value: cells[c.key],
          })),
        href: _href,
      });
    }
  }

  function handleBodyClick(e: React.MouseEvent<HTMLTableSectionElement>) {
    const target = e.target as HTMLElement;
    if (
      target.closest(
        "a, button, input, select, textarea, [role='menuitem'], [data-no-row-click]"
      )
    ) {
      return;
    }

    const tr = target.closest<HTMLTableRowElement>("tr[data-row-index]");
    if (!tr) return;

    const index = Number(tr.dataset.rowIndex);
    if (Number.isNaN(index) || index < 0 || index >= pageRows.length) return;

    const row = pageRows[index];
    if (row._disableRowClick) return;

    const clickable =
      Boolean(onRowClick) ||
      Boolean((row._detail || row._href) && !row._disableRowClick);

    if (!clickable) return;
    activateRow(row);
  }

  function handlePageSizeChange(value: string) {
    setPageSize(Number(value));
    setPage(1);
  }

  if (rows.length === 0) {
    return (
      <div
        className={cn(
          "py-12 text-center",
          embedded
            ? "bg-muted/10"
            : "rounded-xl border border-dashed bg-muted/20"
        )}
      >
        <p className="text-sm text-muted-foreground px-4">{emptyMessage}</p>
      </div>
    );
  }

  const rangeStart = (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, rows.length);

  return (
    <>
      <div
        className={cn(
          "min-w-0 w-full max-w-full",
          !embedded && "rounded-xl border bg-card shadow-sm overflow-hidden"
        )}
      >
        <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
        <Table className="w-full min-w-[640px] table-fixed">
          <TableHeader>
            <TableRow
              className={cn(
                "hover:bg-transparent border-b",
                embedded ? "bg-muted/25" : "bg-muted/40"
              )}
            >
              {showIndex && (
                <TableHead className="w-12 pl-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  S/N
                </TableHead>
              )}
              {columns.map((c) => (
                <TableHead
                  key={c.key}
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                    DEFAULT_COLUMN_MAX[c.key],
                    c.className
                  )}
                >
                  {c.label}
                </TableHead>
              ))}
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody onClick={handleBodyClick}>
            {pageRows.map((row, i) => {
              const cells = extractRowCells(row);
              const _id = row._id;
              const _detail = row._detail;
              const _href = row._href;
              const serial = rangeStart + i;
              const clickable =
                Boolean(onRowClick) ||
                Boolean((_detail || _href) && !row._disableRowClick);

              return (
                <TableRow
                  key={_id ?? `${safePage}-${i}`}
                  data-row-index={i}
                  data-clickable={clickable ? "true" : undefined}
                  className={cn(
                    "group border-b border-border/50 transition-colors",
                    i % 2 === 1 && "bg-muted/15",
                    compact && "hover:bg-muted/40",
                    clickable &&
                      "cursor-pointer hover:bg-primary/5 active:bg-primary/10"
                  )}
                  onKeyDown={(e) => {
                    if (!clickable) return;
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      activateRow(row);
                    }
                  }}
                  tabIndex={clickable ? 0 : undefined}
                >
                  {showIndex && (
                    <TableCell className="pl-4 text-muted-foreground tabular-nums">
                      {serial}
                    </TableCell>
                  )}
                  {columns.map((c) => {
                    const isAction =
                      c.key === "actions" ||
                      c.key === "billing" ||
                      c.key === "menu" ||
                      c.key === "invoice" ||
                      c.key === "open";
                    const truncate = shouldTruncateColumn(c);

                    return (
                    <TableCell
                      key={c.key}
                      className={cn(
                        compact ? "py-3" : "py-3.5",
                        DEFAULT_COLUMN_MAX[c.key],
                        truncate && "max-w-0",
                        c.className
                      )}
                      data-no-row-click={isAction ? true : undefined}
                    >
                      {isAction ? (
                        <div data-no-row-click>{cells[c.key]}</div>
                      ) : (
                        renderCellContent(c, cells[c.key])
                      )}
                    </TableCell>
                    );
                  })}
                  <TableCell className="pr-4 text-muted-foreground">
                    {clickable ? (
                      <ChevronRight className="h-4 w-4 opacity-40 transition-opacity group-hover:opacity-100" />
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        </div>

        {variant === "overview" && summaryLabel ? (
          <OverviewTableFooter
            total={pageRows.length}
            totalCount={totalCount ?? rows.length}
            page={safePage}
            pageSize={pageSize}
            onPageChange={setPage}
            summaryLabel={summaryLabel}
            embedded={embedded}
            summaryOnly={!paginate}
          />
        ) : (
          <div
            className={cn(
              "border-t px-3 py-2.5 sm:px-4",
              embedded ? "bg-muted/10" : "bg-muted/20"
            )}
          >
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <p className="text-sm text-muted-foreground text-center sm:text-left shrink-0">
                Showing{" "}
                <span className="font-medium text-foreground tabular-nums">
                  {rangeStart}–{rangeEnd}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground tabular-nums">
                  {rows.length}
                </span>
              </p>

              <div className="flex items-center justify-center gap-2 sm:gap-3 shrink-0">
                <div className="inline-flex h-9 items-center gap-2 rounded-lg border bg-background px-2.5 shadow-sm">
                  <label
                    htmlFor="data-table-page-size"
                    className="text-xs font-medium text-muted-foreground whitespace-nowrap"
                  >
                    Per page
                  </label>
                  <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                    <SelectTrigger
                      id="data-table-page-size"
                      className="h-7 w-[3.25rem] border-0 bg-transparent px-1 shadow-none focus:ring-0"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end">
                      {pageSizeOptions.map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div
                  className="inline-flex h-9 items-center rounded-lg border bg-background shadow-sm"
                  role="navigation"
                  aria-label="Table pagination"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 rounded-r-none px-2.5 gap-1 text-xs"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </Button>
                  <span
                    className="flex h-9 min-w-[3.25rem] items-center justify-center border-x px-2 text-xs font-medium tabular-nums text-muted-foreground"
                    aria-live="polite"
                  >
                    {safePage}/{totalPages}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 rounded-l-none px-2.5 gap-1 text-xs"
                    disabled={safePage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <DataTableDetailModal
        detail={activeDetail}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
}
