"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  Truck,
  Receipt,
  Bell,
  Plug,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { updatePlatformSettings } from "@/lib/actions/organization";
import {
  DEFAULT_PLATFORM_SETTINGS,
  MAP_VISIBILITY_LABELS,
  type PlatformSettings,
} from "@/lib/organization/settings";
import type { IntegrationEnvStatus } from "@/lib/organization/env-status";
import type { Organization } from "@/lib/types/database";
import { organizationDisplayName } from "@/lib/organization/display";
import { toast } from "sonner";

function SettingRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:items-start sm:gap-6 py-4 border-b last:border-b-0">
      <div className="space-y-1">
        <p className="text-sm font-medium">{label}</p>
        {hint ? <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p> : null}
      </div>
      <div>{children}</div>
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onCheckedChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b last:border-b-0">
      <div className="space-y-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export function PlatformSettingsForm({
  org,
  settings,
  envStatus,
}: {
  org: Organization | null;
  settings: PlatformSettings;
  envStatus: IntegrationEnvStatus[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(org?.name ?? organizationDisplayName(org));
  const [logoUrl, setLogoUrl] = useState(org?.logo_url ?? "");
  const [s, setS] = useState<PlatformSettings>(settings);

  function patch<K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) {
    setS((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const r = await updatePlatformSettings({
      name,
      logo_url: logoUrl || null,
      settings: s,
    });
    setLoading(false);
    if (r.error) toast.error(r.error);
    else {
      toast.success("Platform settings saved");
      router.refresh();
    }
  }

  const sampleTracking = `${s.tracking_prefix || "SWC"}-260531-K7M2NP`;
  const sampleInvoice = `${s.invoice_prefix || "INV"}-260531-A1B2C3D4`;

  return (
    <form onSubmit={submit} className="space-y-6">
      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/50 p-1">
          <TabsTrigger value="company" className="gap-1.5 text-xs sm:text-sm">
            <Building2 className="h-3.5 w-3.5" />
            Company
          </TabsTrigger>
          <TabsTrigger value="tracking" className="gap-1.5 text-xs sm:text-sm">
            <MapPin className="h-3.5 w-3.5" />
            Tracking
          </TabsTrigger>
          <TabsTrigger value="operations" className="gap-1.5 text-xs sm:text-sm">
            <Truck className="h-3.5 w-3.5" />
            Operations
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-1.5 text-xs sm:text-sm">
            <Receipt className="h-3.5 w-3.5" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 text-xs sm:text-sm">
            <Bell className="h-3.5 w-3.5" />
            Notifications
          </TabsTrigger>
          
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Freight operator profile</CardTitle>
              <CardDescription>
                Shown on customer portal, tracking receipts, and internal dashboards.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-2">
              <SettingRow
                label="Brand name"
                hint="Customer-facing name (e.g. SwiftCargo, TransGlobe Logistics)"
              >
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </SettingRow>
              <SettingRow label="Legal entity name" hint="For invoices and contracts">
                <Input
                  value={s.legal_name}
                  onChange={(e) => patch("legal_name", e.target.value)}
                  placeholder={name || "SwiftCargo Inc."}
                />
              </SettingRow>
              <SettingRow label="Tagline" hint="Short line under logo in dashboards">
                <Input
                  value={s.tagline}
                  onChange={(e) => patch("tagline", e.target.value)}
                  placeholder={DEFAULT_PLATFORM_SETTINGS.tagline}
                />
              </SettingRow>
              <SettingRow label="Logo URL" hint="HTTPS image URL for portal header">
                <Input
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://cdn.example.com/logo.svg"
                />
              </SettingRow>
              <SettingRow
                label="Headquarters"
                hint="Primary control tower or registered office"
              >
                <Input
                  value={s.headquarters}
                  onChange={(e) => patch("headquarters", e.target.value)}
                />
              </SettingRow>
              <SettingRow
                label="Operating corridors"
                hint="Regions and trade lanes you serve"
              >
                <Input
                  value={s.operating_regions}
                  onChange={(e) => patch("operating_regions", e.target.value)}
                  placeholder="West Africa · EU · US East Coast"
                />
              </SettingRow>
              <SettingRow label="Customer support email">
                <Input
                  type="email"
                  value={s.support_email}
                  onChange={(e) => patch("support_email", e.target.value)}
                />
              </SettingRow>
              <SettingRow label="Operations phone">
                <Input
                  value={s.support_phone}
                  onChange={(e) => patch("support_phone", e.target.value)}
                />
              </SettingRow>
              <SettingRow label="Control tower hours">
                <Input
                  value={s.ops_hours}
                  onChange={(e) => patch("ops_hours", e.target.value)}
                  placeholder="24/7 · Mon–Fri 8am–8pm EST"
                />
              </SettingRow>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tracking & map visibility</CardTitle>
              <CardDescription>
                How shipment IDs are generated and what customers see on live maps.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-2">
              <SettingRow
                label="Tracking ID prefix"
                hint={`New bookings get IDs like ${sampleTracking}`}
              >
                <Input
                  value={s.tracking_prefix}
                  onChange={(e) =>
                    patch("tracking_prefix", e.target.value.toUpperCase().slice(0, 6))
                  }
                  className="font-mono uppercase max-w-[8rem]"
                  maxLength={6}
                />
              </SettingRow>
              <SettingRow
                label="Default map mode"
                hint="Applied to new shipments; admins can override per shipment"
              >
                <Select
                  value={s.default_map_visibility}
                  onValueChange={(v) =>
                    patch("default_map_visibility", v as PlatformSettings["default_map_visibility"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(MAP_VISIBILITY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow
                label="GPS publish interval (seconds)"
                hint="How often driver apps send location updates (15–300s)"
              >
                <Input
                  type="number"
                  min={15}
                  max={300}
                  step={5}
                  value={s.gps_publish_interval_sec}
                  onChange={(e) =>
                    patch("gps_publish_interval_sec", parseInt(e.target.value, 10) || 30)
                  }
                  className="max-w-[8rem]"
                />
              </SettingRow>
              <ToggleRow
                label="Public tracking page"
                hint="Allow anyone with a tracking number to search at /tracking"
                checked={s.public_tracking_enabled}
                onCheckedChange={(v) => patch("public_tracking_enabled", v)}
              />
              <ToggleRow
                label="Show driver first name on public map"
                hint="Privacy-safe label only — never full contact details"
                checked={s.show_driver_name_public}
                onCheckedChange={(v) => patch("show_driver_name_public", v)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Operations defaults</CardTitle>
              <CardDescription>
                Dispatch rules, units, and booking behavior for your network.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-2">
              <SettingRow label="Default currency" hint="Quotes, invoices, and rate cards">
                <Input
                  value={s.default_currency}
                  onChange={(e) =>
                    patch("default_currency", e.target.value.toUpperCase().slice(0, 3))
                  }
                  className="font-mono uppercase max-w-[6rem]"
                  maxLength={3}
                />
              </SettingRow>
              <SettingRow label="Weight unit" hint="Displayed on booking and BOL forms">
                <Select
                  value={s.weight_unit}
                  onValueChange={(v) => patch("weight_unit", v as PlatformSettings["weight_unit"])}
                >
                  <SelectTrigger className="max-w-[10rem]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="lb">Pounds (lb)</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Timezone" hint="Cut-off times and SLA calculations">
                <Input
                  value={s.timezone}
                  onChange={(e) => patch("timezone", e.target.value)}
                  placeholder="America/New_York"
                />
              </SettingRow>
              <SettingRow
                label="Default Incoterms"
                hint="Pre-filled on portal booking (DAP, DDP, FOB, etc.)"
              >
                <Input
                  value={s.default_incoterms}
                  onChange={(e) => patch("default_incoterms", e.target.value.toUpperCase())}
                  className="max-w-[8rem] font-mono uppercase"
                  maxLength={5}
                />
              </SettingRow>
              <SettingRow label="Quote validity (days)" hint="Estimator and sent quotes expire after">
                <Input
                  type="number"
                  min={1}
                  max={90}
                  value={s.quote_validity_days}
                  onChange={(e) =>
                    patch("quote_validity_days", parseInt(e.target.value, 10) || 14)
                  }
                  className="max-w-[8rem]"
                />
              </SettingRow>
              <ToggleRow
                label="Dispatch requires paid invoice"
                hint="Drivers cannot be assigned until billing is settled (recommended)"
                checked={s.dispatch_requires_paid_invoice}
                onCheckedChange={(v) => patch("dispatch_requires_paid_invoice", v)}
              />
              <ToggleRow
                label="Auto-confirm portal bookings"
                hint="Skip manual admin approval when customers book online"
                checked={s.portal_booking_auto_confirm}
                onCheckedChange={(v) => patch("portal_booking_auto_confirm", v)}
              />
              <ToggleRow
                label="Require HS code on international bookings"
                hint="Customs classification for cross-border lanes"
                checked={s.require_hs_code}
                onCheckedChange={(v) => patch("require_hs_code", v)}
              />
              <ToggleRow
                label="Suggest nearest available driver"
                hint="Highlight closest driver on dispatch (does not auto-assign)"
                checked={s.auto_assign_nearest_driver}
                onCheckedChange={(v) => patch("auto_assign_nearest_driver", v)}
              />
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Claims & customs</CardTitle>
              <CardDescription>SLA and partner contacts for exceptions</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-2">
              <SettingRow
                label="Claims response SLA (business days)"
                hint="Target time to acknowledge damage or loss claims"
              >
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={s.claims_sla_days}
                  onChange={(e) =>
                    patch("claims_sla_days", parseInt(e.target.value, 10) || 5)
                  }
                  className="max-w-[8rem]"
                />
              </SettingRow>
              <SettingRow label="Cargo insurance partner">
                <Input
                  value={s.cargo_insurance_partner}
                  onChange={(e) => patch("cargo_insurance_partner", e.target.value)}
                  placeholder="Allianz Trade · Marsh · local underwriter"
                />
              </SettingRow>
              <SettingRow label="Customs broker contact">
                <Input
                  value={s.customs_broker_contact}
                  onChange={(e) => patch("customs_broker_contact", e.target.value)}
                  placeholder="broker@clearance.example.com"
                />
              </SettingRow>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Billing & revenue</CardTitle>
              <CardDescription>
                Invoice numbering and payment terms for shippers.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-2">
              <SettingRow
                label="Invoice prefix"
                hint={`Auto-generated numbers use format like ${sampleInvoice}`}
              >
                <Input
                  value={s.invoice_prefix}
                  onChange={(e) =>
                    patch("invoice_prefix", e.target.value.toUpperCase().slice(0, 8))
                  }
                  className="font-mono uppercase max-w-[8rem]"
                  maxLength={8}
                />
              </SettingRow>
              <SettingRow label="Payment terms (days)" hint="Due date = invoice date + N days">
                <Select
                  value={String(s.payment_terms_days)}
                  onValueChange={(v) => patch("payment_terms_days", parseInt(v, 10))}
                >
                  <SelectTrigger className="max-w-[12rem]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Due on receipt</SelectItem>
                    <SelectItem value="15">Net 15</SelectItem>
                    <SelectItem value="30">Net 30</SelectItem>
                    <SelectItem value="45">Net 45</SelectItem>
                    <SelectItem value="60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Default tax rate (%)" hint="Applied to new invoices when configured">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={s.default_tax_rate}
                  onChange={(e) =>
                    patch("default_tax_rate", parseFloat(e.target.value) || 0)
                  }
                  className="max-w-[8rem]"
                />
              </SettingRow>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer milestone alerts</CardTitle>
              <CardDescription>
                Email/SMS triggers when connected (Resend, Twilio, etc.). Flags control which
                events fire.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-2">
              <ToggleRow
                label="Pickup confirmed"
                hint="When cargo is collected from shipper"
                checked={s.notify_on_pickup}
                onCheckedChange={(v) => patch("notify_on_pickup", v)}
              />
              <ToggleRow
                label="In transit"
                hint="Departed origin hub or main linehaul leg"
                checked={s.notify_on_in_transit}
                onCheckedChange={(v) => patch("notify_on_in_transit", v)}
              />
              <ToggleRow
                label="Customs clearance"
                hint="Held or released at border"
                checked={s.notify_on_customs}
                onCheckedChange={(v) => patch("notify_on_customs", v)}
              />
              <ToggleRow
                label="Delivered"
                hint="POD captured and shipment closed"
                checked={s.notify_on_delivery}
                onCheckedChange={(v) => patch("notify_on_delivery", v)}
              />
              <ToggleRow
                label="Exception / delay"
                hint="Weather, customs hold, or failed delivery attempt"
                checked={s.notify_on_exception}
                onCheckedChange={(v) => patch("notify_on_exception", v)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t -mx-1 px-1">
        <p className="text-xs text-muted-foreground">
          Changes apply tenant-wide. Tracking prefix affects <strong>new</strong> shipments only.
        </p>
        <Button type="submit" disabled={loading} className="gap-2 shrink-0">
          <Save className="h-4 w-4" />
          {loading ? "Saving…" : "Save platform settings"}
        </Button>
      </div>
    </form>
  );
}
