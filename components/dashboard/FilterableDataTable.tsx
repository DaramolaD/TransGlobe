"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Columns3, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, type DataTableColumn, type DataTableRow } from "./DataTable";

const NON_TOGGLE_KEYS = new Set([
  "menu",
  "actions",
  "billing",
  "invoice",
  "open",
]);

function loadVisibleKeys(storageKey: string, allKeys: string[]): string[] {
  if (typeof window === "undefined") return allKeys;
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return allKeys;
    const parsed = JSON.parse(raw) as string[];
    const valid = parsed.filter((k) => allKeys.includes(k));
    return valid.length ? valid : allKeys;
  } catch {
    return allKeys;
  }
}

export function FilterableDataTable({
  storageKey,
  columns,
  rows,
  searchPlaceholder = "Search table…",
  getSearchText,
  defaultVisibleKeys,
  toolbarExtra,
  ...tableProps
}: {
  storageKey: string;
  columns: DataTableColumn[];
  rows: DataTableRow[];
  searchPlaceholder?: string;
  /** Plain-text blob used for client-side filter */
  getSearchText?: (row: DataTableRow) => string;
  defaultVisibleKeys?: string[];
  toolbarExtra?: React.ReactNode;
} & Omit<
  React.ComponentProps<typeof DataTable>,
  "columns" | "rows"
>) {
  const toggleableKeys = useMemo(
    () =>
      columns
        .map((c) => c.key)
        .filter((k) => !NON_TOGGLE_KEYS.has(k)),
    [columns]
  );

  const defaultKeys = defaultVisibleKeys ?? toggleableKeys;

  const [query, setQuery] = useState("");
  const [visibleKeys, setVisibleKeys] = useState<string[]>(defaultKeys);

  useEffect(() => {
    setVisibleKeys(loadVisibleKeys(storageKey, defaultKeys));
  }, [storageKey, defaultKeys]);

  const persistVisible = useCallback(
    (keys: string[]) => {
      setVisibleKeys(keys);
      try {
        localStorage.setItem(storageKey, JSON.stringify(keys));
      } catch {
        /* ignore */
      }
    },
    [storageKey]
  );

  const visibleColumns = useMemo(
    () =>
      columns.filter(
        (c) => NON_TOGGLE_KEYS.has(c.key) || visibleKeys.includes(c.key)
      ),
    [columns, visibleKeys]
  );

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => {
      const text = getSearchText?.(row) ?? "";
      return text.toLowerCase().includes(q);
    });
  }, [rows, query, getSearchText]);

  function toggleColumn(key: string, checked: boolean) {
    const next = checked
      ? [...new Set([...visibleKeys, key])]
      : visibleKeys.filter((k) => k !== key);
    if (next.length === 0) return;
    persistVisible(next);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9 pr-9"
            aria-label="Search table"
          />
          {query ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full w-9"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {toolbarExtra}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="sm" className="gap-2">
                <Columns3 className="h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Show columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {toggleableKeys.map((key) => {
                const col = columns.find((c) => c.key === key);
                return (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={visibleKeys.includes(key)}
                    onCheckedChange={(checked) => toggleColumn(key, checked === true)}
                  >
                    {col?.label ?? key}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {query ? (
        <p className="text-xs text-muted-foreground">
          {filteredRows.length} of {rows.length} rows match
        </p>
      ) : null}
      <DataTable columns={visibleColumns} rows={filteredRows} {...tableProps} />
    </div>
  );
}
