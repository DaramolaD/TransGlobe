import { cn } from "@/lib/utils";

/** Shared layout for dashboard modals that need a fixed header/footer and scrollable body */
export const scrollableDialogContentClass = cn(
  "gap-0 p-0 overflow-hidden flex flex-col",
  "max-h-[min(90vh,720px)] w-[calc(100%-2rem)] sm:max-w-md"
);

export const scrollableDialogBodyClass =
  "flex-1 min-h-0 overflow-y-auto overscroll-contain bg-background";
