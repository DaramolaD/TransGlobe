import Link from "next/link";
import { AlertTriangle, Calendar, CheckCircle2, Clock, Shield, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  type ClaimSlaInfo,
  type ClaimSlaState,
  claimNextStep,
} from "@/lib/claims/sla";

function slaStateLabel(state: ClaimSlaState): string {
  switch (state) {
    case "on_track":
      return "On track";
    case "due_soon":
      return "Due soon";
    case "overdue":
      return "Overdue";
    case "closed":
      return "Closed";
  }
}

function slaStateStyles(state: ClaimSlaState): string {
  switch (state) {
    case "on_track":
      return "bg-emerald-50 text-emerald-800 ring-emerald-200";
    case "due_soon":
      return "bg-amber-50 text-amber-900 ring-amber-200";
    case "overdue":
      return "bg-red-50 text-red-800 ring-red-200";
    case "closed":
      return "bg-muted text-muted-foreground ring-border";
  }
}

function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ClaimSlaPanel({
  sla,
  claimStatus,
  insurancePartner,
  customsBroker,
}: {
  sla: ClaimSlaInfo;
  claimStatus: string;
  insurancePartner?: string | null;
  customsBroker?: string | null;
}) {
  const hasPartners = Boolean(insurancePartner?.trim() || customsBroker?.trim());

  return (
    <div className="space-y-4">
      <Card className="border-primary/15">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Response deadline
              </CardTitle>
              <CardDescription className="mt-1.5 leading-relaxed">
                Your team should <strong>acknowledge and start working</strong> this claim
                within {sla.slaDays} days of filing. This target is set in Super Admin →
                Settings → Claims.
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={cn("shrink-0 font-medium ring-1", slaStateStyles(sla.state))}
            >
              {slaStateLabel(sla.state)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Filed
              </p>
              <p className="text-sm font-medium mt-1">{formatDate(sla.filedAt)}</p>
            </div>
            <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Respond by
              </p>
              <p className="text-sm font-medium mt-1">{formatDate(sla.dueAt)}</p>
            </div>
            <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Time left
              </p>
              <p className="text-sm font-medium mt-1">
                {sla.state === "closed"
                  ? "Claim closed"
                  : sla.state === "overdue"
                    ? `${sla.daysOverdue} day${sla.daysOverdue === 1 ? "" : "s"} past target`
                    : sla.daysRemaining === 0
                      ? "Due today"
                      : `${sla.daysRemaining} day${sla.daysRemaining === 1 ? "" : "s"} remaining`}
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed rounded-md bg-muted/40 px-3 py-2">
            {sla.state === "overdue"
              ? "This claim is past the response target. Prioritize customer contact and move status to Investigating if you have not already."
              : sla.state === "due_soon"
                ? "The response window is almost up. Acknowledge the customer and begin investigation."
                : sla.state === "closed"
                  ? "No further SLA applies — the claim is finished."
                  : "You are within the response window. Use the status menu (top right) to move this claim forward."}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            What to do next
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {claimNextStep(claimStatus)}
          </p>
        </CardContent>
      </Card>

      {hasPartners ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              Partner contacts
            </CardTitle>
            <CardDescription>
              Reference contacts for insurance or customs — from platform settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
            {insurancePartner?.trim() ? (
              <div className="rounded-lg border px-3 py-2.5">
                <p className="text-xs text-muted-foreground">Cargo insurance</p>
                <p className="font-medium mt-0.5">{insurancePartner}</p>
              </div>
            ) : null}
            {customsBroker?.trim() ? (
              <div className="rounded-lg border px-3 py-2.5">
                <p className="text-xs text-muted-foreground">Customs broker</p>
                <p className="font-medium mt-0.5">{customsBroker}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <Truck className="h-3 w-3 shrink-0" />
        Change the SLA length under{" "}
        <Link href="/app/superadmin/settings" className="text-primary underline-offset-4 hover:underline">
          Platform settings → Claims
        </Link>
        .
      </p>
    </div>
  );
}
