"use client";

import type { LucideIcon } from "lucide-react";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  scrollableDialogBodyClass,
  scrollableDialogContentClass,
} from "@/lib/dashboard/scrollable-dialog";
import { cn } from "@/lib/utils";

type DetailModalShellProps = {
  headerClass: string;
  icon: LucideIcon;
  iconClass: string;
  label: string;
  /** Accessible name when the visible title lives in the body */
  srTitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "md" | "lg";
};

export function DetailModalShell({
  headerClass,
  icon: Icon,
  iconClass,
  label,
  srTitle,
  children,
  footer,
  maxWidth = "md",
}: DetailModalShellProps) {
  return (
    <DialogContent
      className={cn(
        scrollableDialogContentClass,
        "bg-background",
        maxWidth === "lg" ? "sm:max-w-lg md:max-w-xl" : "sm:max-w-md"
      )}
    >
      <DialogHeader className="space-y-0 shrink-0 border-b border-border/60">
        <div className={cn("flex items-center gap-3 px-6 py-3.5", headerClass)}>
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 bg-background/90 shadow-sm",
              iconClass
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <DialogTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </DialogTitle>
            {srTitle ? <span className="sr-only">{srTitle}</span> : null}
          </div>
        </div>
      </DialogHeader>

      <div className={scrollableDialogBodyClass}>
        <div className="px-6 py-5">{children}</div>
      </div>

      {footer ? (
        <DialogFooter className="shrink-0 border-t border-border/60 bg-muted/30 px-6 py-4 sm:justify-end gap-2">
          {footer}
        </DialogFooter>
      ) : null}
    </DialogContent>
  );
}
