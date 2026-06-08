import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { organizationDisplayName } from "@/lib/data/organization";
import { parseOrganizationSettings } from "@/lib/organization/settings";
import type { Organization } from "@/lib/types/database";

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium leading-snug">{value}</p>
    </div>
  );
}

export function PlatformSettingsOverview({ org }: { org: Organization | null }) {
  const name = organizationDisplayName(org);
  const s = parseOrganizationSettings(org?.settings);
  const legalName = s.legal_name?.trim();
  const showLegalName = Boolean(legalName && legalName !== name);

  const paymentTerms =
    s.payment_terms_days === 0 ? "Due on receipt" : `Net ${s.payment_terms_days}`;
  const dispatchRule = s.dispatch_requires_paid_invoice
    ? "Paid invoice required"
    : "Open dispatch";

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted/40">
            {org?.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={org.logo_url} alt="" className="h-full w-full object-contain" />
            ) : (
              <Building2 className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h2 className="text-lg font-semibold tracking-tight">{name}</h2>
              <Badge variant={org?.is_active ? "default" : "secondary"} className="text-xs">
                {org?.is_active ? "Active" : "Suspended"}
              </Badge>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {s.tagline || "Global freight · Air, sea & road logistics"}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetaItem label="Regions" value={s.operating_regions} />
          <MetaItem label="Headquarters" value={s.headquarters} />
          <MetaItem label="Support" value={s.support_email} />
          <MetaItem label="Phone" value={s.support_phone} />
          {showLegalName ? <MetaItem label="Legal entity" value={legalName!} /> : null}
          <MetaItem label="Control tower" value={s.ops_hours} />
        </div>

        <Separator className="my-5" />

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-mono text-foreground">{s.tracking_prefix}</span>
            {" · "}
            <span className="font-mono text-foreground">{s.default_currency}</span>
            {" · "}
            <span className="text-foreground">{paymentTerms}</span>
            {" · "}
            <span className="text-foreground">{dispatchRule}</span>
          </p>
          {org?.id ? (
            <p className="text-xs text-muted-foreground">
              Workspace <span className="font-mono text-foreground">{org.id.slice(0, 8)}</span>
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
