import { PageHeader } from "@/components/dashboard/PageHeader";
import { listFacilityTypesForStaff } from "@/lib/actions/facility-types";
import { listFacilityLocations } from "@/lib/actions/facilities";
import { FacilityLocationsTable } from "./FacilityLocationsTable";
import { FacilityTypeFormDialog } from "./FacilityTypeFormDialog";
import { FacilityTypesTable } from "./FacilityTypesTable";

export default async function FacilityLocationsPage() {
  const [
    { data: facilityTypes, error: typesError },
    { data: locations, error: locationsError },
  ] = await Promise.all([
    listFacilityTypesForStaff(true),
    listFacilityLocations(true),
  ]);

  const migrationHint = (
    <>
      Apply migrations{" "}
      <code className="text-xs">20250601000000_tracking_facilities.sql</code> and{" "}
      <code className="text-xs">20250602000000_facility_types_catalog.sql</code> if
      this is a new environment.
    </>
  );

  return (
    <div className="space-y-10">
      <PageHeader
        title="Facility locations"
        description="Manage facility types, then add warehouses and hubs with map coordinates for tracking."
      />

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Facility types</h2>
            <p className="text-sm text-muted-foreground">
              Categories used when creating locations (warehouse, hub, port, or custom).
            </p>
          </div>
          <FacilityTypeFormDialog />
        </div>
        {typesError ? (
          <p className="text-sm text-destructive rounded-lg border border-destructive/30 p-4">
            Could not load facility types: {typesError}. {migrationHint}
          </p>
        ) : (
          <FacilityTypesTable types={facilityTypes} />
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Locations</h2>
          <p className="text-sm text-muted-foreground">
            Click a row to preview a facility. Use Edit to change coordinates or deactivate
            a location.
          </p>
        </div>
        {locationsError ? (
          <p className="text-sm text-destructive rounded-lg border border-destructive/30 p-4">
            Could not load locations: {locationsError}. {migrationHint}
          </p>
        ) : (
          <FacilityLocationsTable
            locations={locations}
            facilityTypes={facilityTypes}
          />
        )}
      </section>
    </div>
  );
}
