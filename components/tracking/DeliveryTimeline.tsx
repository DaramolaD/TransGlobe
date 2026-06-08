"use client";

import { Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export type DeliveryTimelineStep = {
  id: string;
  title: string;
  /** e.g. "today 12:30 PM" or city line */
  subtitle?: string;
  detail?: React.ReactNode;
  state: "completed" | "current" | "upcoming";
};

export function DeliveryTimeline({
  steps,
  className,
}: {
  steps: DeliveryTimelineStep[];
  className?: string;
}) {
  if (steps.length === 0) return null;

  return (
    <ol className={cn("relative space-y-0", className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isCurrent = step.state === "current";

        return (
          <li key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast ? (
              <span
                className="absolute left-[11px] top-7 bottom-0 w-0.5 bg-border"
                aria-hidden
              />
            ) : null}

            <div className="relative z-10 shrink-0 pt-0.5">
              <TimelineNode state={step.state} />
            </div>

            <div
              className={cn(
                "min-w-0 flex-1 -mt-0.5 rounded-lg transition-colors",
                isCurrent && "bg-primary/5 border border-primary/15 px-4 py-3 -ml-1"
              )}
            >
              <p
                className={cn(
                  "text-sm font-semibold leading-snug",
                  isCurrent ? "text-foreground" : "text-foreground/90"
                )}
              >
                {step.title}
              </p>
              {step.subtitle ? (
                <p className="text-xs text-muted-foreground mt-0.5">{step.subtitle}</p>
              ) : null}
              {step.detail ? <div className="mt-3">{step.detail}</div> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function TimelineNode({ state }: { state: DeliveryTimelineStep["state"] }) {
  if (state === "completed") {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background shadow-sm">
        <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden />
      </span>
    );
  }
  if (state === "current") {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-4 ring-primary/15">
        <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden />
      </span>
    );
  }
  return (
    <span
      className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted-foreground/25 bg-background"
      aria-hidden
    />
  );
}

/** Format event time like the reference UI: "today 12:30 PM" */
export function friendlyEventTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (sameDay) return `today ${format(d, "h:mm a")}`;
  return format(d, "MMM d · h:mm a");
}
