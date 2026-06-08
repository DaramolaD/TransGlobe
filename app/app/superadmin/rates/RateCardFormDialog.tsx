"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { upsertRateCard } from "@/lib/actions/rate-cards";
import type { RateCard, ServiceTypeCatalog } from "@/lib/types/database";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function RateCardFormDialog({
  card,
  serviceTypes,
}: {
  card?: RateCard;
  serviceTypes: ServiceTypeCatalog[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(card?.name ?? "");
  const defaultSlug = serviceTypes[0]?.slug ?? "air";
  const [serviceType, setServiceType] = useState(card?.service_type ?? defaultSlug);
  const [pricePerKg, setPricePerKg] = useState(
    card ? String(card.price_per_kg) : ""
  );
  const [minCharge, setMinCharge] = useState(
    card ? String(card.min_charge ?? 0) : "0"
  );
  const [isActive, setIsActive] = useState(card?.is_active ?? true);

  function resetFromCard() {
    setName(card?.name ?? "");
    setServiceType(card?.service_type ?? defaultSlug);
    setPricePerKg(card ? String(card.price_per_kg) : "");
    setMinCharge(card ? String(card.min_charge ?? 0) : "0");
    setIsActive(card?.is_active ?? true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const r = await upsertRateCard({
      id: card?.id,
      name,
      service_type: serviceType,
      price_per_kg: parseFloat(pricePerKg),
      min_charge: parseFloat(minCharge) || 0,
      is_active: isActive,
    });
    setLoading(false);
    if (r.error) toast.error(r.error);
    else {
      toast.success(card ? "Rate card updated" : "Rate card created");
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <>
      {card ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8"
          onClick={() => {
            resetFromCard();
            setOpen(true);
          }}
        >
          <Pencil className="h-3.5 w-3.5 mr-1" />
          Edit
        </Button>
      ) : (
        <Button
          type="button"
          size="sm"
          onClick={() => {
            resetFromCard();
            setOpen(true);
          }}
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add rate card
        </Button>
      )}

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (v && card) resetFromCard();
        }}
      >
        <DialogContent className={cn(scrollableDialogContentClass, "sm:max-w-md")}>
          <DialogHeader className="shrink-0 border-b px-6 py-4 space-y-1">
            <DialogTitle>{card ? "Edit rate card" : "New rate card"}</DialogTitle>
            <DialogDescription>
              Active cards drive the public cost estimator and default invoice
              amounts when no quote price exists.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="flex flex-col flex-1 min-h-0">
            <div className={cn(scrollableDialogBodyClass, "px-6 py-4 space-y-4")}>
              <div className="space-y-2">
                <Label htmlFor="rate-name">Display name</Label>
                <Input
                  id="rate-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Air Standard"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Service type</Label>
                <Select
                  value={serviceType}
                  onValueChange={setServiceType}
                  disabled={!!card || serviceTypes.length === 0}
                >
                  <SelectTrigger className="!w-full">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((o) => (
                      <SelectItem key={o.slug} value={o.slug}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {serviceTypes.length === 0 ? (
                  <p className="text-xs text-destructive">
                    Add an active service type before creating a rate card.
                  </p>
                ) : null}
                {card ? (
                  <p className="text-xs text-muted-foreground">
                    Service type cannot change after creation. Add a new card instead.
                  </p>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rate-kg">Price per kg (USD)</Label>
                  <Input
                    id="rate-kg"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate-min">Minimum charge (USD)</Label>
                  <Input
                    id="rate-min"
                    type="number"
                    min="0"
                    step="0.01"
                    value={minCharge}
                    onChange={(e) => setMinCharge(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-xs text-muted-foreground">
                    Only active cards are used on the website estimator.
                  </p>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </div>
            <div className="shrink-0 flex justify-end gap-2 border-t px-6 py-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving…" : card ? "Save changes" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
