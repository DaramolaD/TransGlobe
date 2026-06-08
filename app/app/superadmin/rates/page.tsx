import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { RateCardFormDialog } from "./RateCardFormDialog";
import { RateCardsTable } from "./RateCardsTable";
import { ServiceTypeFormDialog } from "./ServiceTypeFormDialog";
import { ServiceTypesTable } from "./ServiceTypesTable";
import type { RateCard, ServiceTypeCatalog } from "@/lib/types/database";

export default async function SuperadminRatesPage() {
  const supabase = await createClient();

  const [{ data: cards }, { data: serviceTypes }] = await Promise.all([
    supabase.from("rate_cards").select("*").order("service_type", { ascending: true }),
    supabase
      .from("service_types")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("label", { ascending: true }),
  ]);

  const types = (serviceTypes ?? []) as ServiceTypeCatalog[];
  const activeTypes = types.filter((t) => t.is_active);

  return (
    <div className="space-y-10">
      <PageHeader
        title="Pricing"
        description="Service types appear on the estimator and portal booking. Rate cards set $/kg for each service."
      />

      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold">Service types</h2>
            <p className="text-sm text-muted-foreground">
              Create or remove transport modes customers can choose. Use{" "}
              <span className="font-medium text-foreground">list position</span> to put
              your most important options (e.g. Air) at the top of the estimator and
              booking screens.
            </p>
          </div>
          <ServiceTypeFormDialog />
        </div>
        <ServiceTypesTable types={types} />
      </section>

      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold">Rate cards</h2>
            <p className="text-sm text-muted-foreground">
              One active rate per service type powers the estimator and invoice defaults.
            </p>
          </div>
          <RateCardFormDialog serviceTypes={activeTypes} />
        </div>
        <RateCardsTable cards={(cards ?? []) as RateCard[]} serviceTypes={types} />
      </section>
    </div>
  );
}
