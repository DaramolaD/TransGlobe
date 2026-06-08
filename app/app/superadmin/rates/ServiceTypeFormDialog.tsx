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
import { Textarea } from "@/components/ui/textarea";
import {
  scrollableDialogBodyClass,
  scrollableDialogContentClass,
} from "@/lib/dashboard/scrollable-dialog";
import { upsertServiceType } from "@/lib/actions/service-types";
import { slugifyServiceType } from "@/lib/service-types/utils";
import type { ServiceTypeCatalog } from "@/lib/types/database";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ServiceTypeFormDialog({ type }: { type?: ServiceTypeCatalog }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState(type?.label ?? "");
  const [slug, setSlug] = useState(type?.slug ?? "");
  const [deliveryHint, setDeliveryHint] = useState(type?.delivery_hint ?? "");
  const [description, setDescription] = useState(type?.description ?? "");
  const [sortOrder, setSortOrder] = useState(type ? String(type.sort_order) : "0");
  const [isActive, setIsActive] = useState(type?.is_active ?? true);

  function reset() {
    setLabel(type?.label ?? "");
    setSlug(type?.slug ?? "");
    setDeliveryHint(type?.delivery_hint ?? "");
    setDescription(type?.description ?? "");
    setSortOrder(type ? String(type.sort_order) : "0");
    setIsActive(type?.is_active ?? true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const r = await upsertServiceType({
      id: type?.id,
      label,
      slug: type ? type.slug : slug || slugifyServiceType(label),
      delivery_hint: deliveryHint,
      description,
      sort_order: parseInt(sortOrder, 10) || 0,
      is_active: isActive,
    });
    setLoading(false);
    if (r.error) toast.error(r.error);
    else {
      toast.success(type ? "Service type updated" : "Service type created");
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <>
      {type ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8"
          onClick={() => {
            reset();
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
          variant="outline"
          onClick={() => {
            reset();
            setOpen(true);
          }}
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add service type
        </Button>
      )}

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (v) reset();
        }}
      >
        <DialogContent className={cn(scrollableDialogContentClass, "sm:max-w-md")}>
          <DialogHeader className="shrink-0 border-b px-6 py-4 space-y-1">
            <DialogTitle>{type ? "Edit service type" : "New service type"}</DialogTitle>
            <DialogDescription>
              Shown on the cost estimator and portal booking. Add a matching rate card for
              pricing.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="flex flex-col flex-1 min-h-0">
            <div className={cn(scrollableDialogBodyClass, "px-6 py-4 space-y-4")}>
              <div className="space-y-2">
                <Label htmlFor="st-label">Display name</Label>
                <Input
                  id="st-label"
                  value={label}
                  onChange={(e) => {
                    setLabel(e.target.value);
                    if (!type && !slug) setSlug(slugifyServiceType(e.target.value));
                  }}
                  placeholder="e.g. Cold chain"
                  required
                />
              </div>
              {!type ? (
                <div className="space-y-2">
                  <Label htmlFor="st-slug">Code (slug)</Label>
                  <Input
                    id="st-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase())}
                    placeholder="e.g. cold_chain"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Lowercase letters, numbers, underscores. Cannot be changed later.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <Label>Code</Label>
                  <p className="font-mono text-sm text-muted-foreground">{type.slug}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="st-delivery">Typical delivery time</Label>
                <Input
                  id="st-delivery"
                  value={deliveryHint}
                  onChange={(e) => setDeliveryHint(e.target.value)}
                  placeholder="e.g. 3-7 days"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="st-desc">Description (optional)</Label>
                <Textarea
                  id="st-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Short note for customers"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="st-sort">Position on customer lists</Label>
                <Input
                  id="st-sort"
                  type="number"
                  min={0}
                  step={1}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  placeholder="e.g. 10"
                />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Controls the order services appear on the cost estimator and booking
                  page. <strong>Smaller number = shown higher</strong> (e.g. 10 before
                  20). Use 10, 20, 30 so you can insert a new option between two
                  existing ones later without renumbering everything.
                </p>
              </div>
              <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-xs text-muted-foreground">
                    Inactive types are hidden from the website and booking.
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
                {loading ? "Saving…" : type ? "Save changes" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
