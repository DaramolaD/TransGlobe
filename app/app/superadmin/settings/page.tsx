import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDefaultOrganization, organizationDisplayName } from "@/lib/data/organization";
import { parseOrganizationSettings } from "@/lib/organization/settings";
import { getIntegrationEnvStatus } from "@/lib/organization/env-status";
import { PlatformSettingsForm } from "./PlatformSettingsForm";
import { PlatformSettingsOverview } from "./PlatformSettingsOverview";

export default async function SuperadminSettingsPage() {
  const org = await getDefaultOrganization();
  const name = organizationDisplayName(org);
  const settings = parseOrganizationSettings(org?.settings);
  const envStatus = getIntegrationEnvStatus();
  const missingRequired = envStatus.filter((e) => e.required && !e.configured);

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Platform settings"
        description={`How ${name} appears to customers and staff - tracking, dispatch rules, and billing.`}
      />

      <PlatformSettingsOverview org={org} />

      {missingRequired.length > 0 ? (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-destructive">Setup incomplete</CardTitle>
            <CardDescription>
              Add missing environment variables before going live:{" "}
              {missingRequired.map((e) => e.envVar).join(", ")}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <PlatformSettingsForm org={org} settings={settings} envStatus={envStatus} />
    </div>
  );
}
