"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  scrollableDialogBodyClass,
  scrollableDialogContentClass,
} from "@/lib/dashboard/scrollable-dialog";
import { upsertFacilityLocation } from "@/lib/actions/facilities";
import { sortFacilityTypes } from "@/lib/facility-types/utils";
import type { FacilityTypeCatalog } from "@/lib/types/database";
import type { FacilityLocationRow, FacilityType } from "@/lib/types/tracking";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function defaultTypeSlug(
  location: FacilityLocationRow | undefined,
  types: FacilityTypeCatalog[]
): FacilityType {
  if (location?.facility_type) return location.facility_type;
  const active = sortFacilityTypes(types).filter((t) => t.is_active);
  return active[0]?.slug ?? types[0]?.slug ?? "hub";
}

export function FacilityLocationFormDialog({
  location,
  facilityTypes,
  trigger,
}: {
  location?: FacilityLocationRow;
  facilityTypes: FacilityTypeCatalog[];
  trigger?: ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(location?.name ?? "");
  const activeTypes = sortFacilityTypes(facilityTypes).filter((t) => t.is_active);
  const [facilityType, setFacilityType] = useState<FacilityType>(() =>
    defaultTypeSlug(location, facilityTypes)
  );
  const [addressLine, setAddressLine] = useState(location?.address_line ?? "");
  const [city, setCity] = useState(location?.city ?? "");
  const [state, setState] = useState(location?.state ?? "");
  const [country, setCountry] = useState(location?.country ?? "US");
  const [postalCode, setPostalCode] = useState(location?.postal_code ?? "");
  const [latitude, setLatitude] = useState(
    location ? String(location.latitude) : ""
  );
  const [longitude, setLongitude] = useState(
    location ? String(location.longitude) : ""
  );
  const [isActive, setIsActive] = useState(location?.is_active ?? true);
  const [notes, setNotes] = useState(location?.notes ?? "");

  function reset() {
    setName(location?.name ?? "");
    setFacilityType(defaultTypeSlug(location, facilityTypes));
    setAddressLine(location?.address_line ?? "");
    setCity(location?.city ?? "");
    setState(location?.state ?? "");
    setCountry(location?.country ?? "US");
    setPostalCode(location?.postal_code ?? "");
    setLatitude(location ? String(location.latitude) : "");
    setLongitude(location ? String(location.longitude) : "");
    setIsActive(location?.is_active ?? true);
    setNotes(location?.notes ?? "");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const r = await upsertFacilityLocation({
      id: location?.id,
      name,
      facility_type: facilityType,
      address_line: addressLine,
      city,
      state,
      country,
      postal_code: postalCode,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      is_active: isActive,
      notes,
    });
    setLoading(false);
    if (r.error) toast.error(r.error);
    else {
      toast.success(location ? "Location updated" : "Location added");
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v) reset();
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button" size="sm" className="gap-2">
            {location ? (
              <>
                <Pencil className="h-4 w-4" />
                Edit
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add location
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className={cn(scrollableDialogContentClass, "sm:max-w-lg")}>
        <DialogHeader className="shrink-0 border-b px-6 py-4 space-y-1">
          <DialogTitle>{location ? "Edit facility" : "Add facility"}</DialogTitle>
          <DialogDescription>
            Warehouses and hubs appear on the tracking map when you attach them to
            status updates. Latitude and longitude are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col flex-1 min-h-0">
          <div className={cn(scrollableDialogBodyClass, "px-6 py-4")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="fac-name">Name</Label>
                <Input
                  id="fac-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Regional hub — Chicago"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={facilityType}
                  onValueChange={(v) => setFacilityType(v as FacilityType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(activeTypes.length ? activeTypes : facilityTypes).map((t) => (
                      <SelectItem key={t.slug} value={t.slug}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fac-city">City</Label>
                <Input
                  id="fac-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fac-state">State / province</Label>
                <Input
                  id="fac-state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fac-country">Country</Label>
                <Input
                  id="fac-country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="fac-address">Address</Label>
                <Input
                  id="fac-address"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fac-lat">Latitude</Label>
                <Input
                  id="fac-lat"
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fac-lng">Longitude</Label>
                <Input
                  id="fac-lng"
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  required
                />
              </div>
              <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                <Switch
                  id="fac-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="fac-active" className="font-normal">
                  Active (selectable on shipments)
                </Label>
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="fac-notes">Notes</Label>
                <Input
                  id="fac-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="shrink-0 flex justify-end gap-2 border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
