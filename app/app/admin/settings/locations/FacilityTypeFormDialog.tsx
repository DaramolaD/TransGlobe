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
import { upsertFacilityType } from "@/lib/actions/facility-types";
import { slugifyFacilityType } from "@/lib/facility-types/utils";
import type { FacilityTypeCatalog } from "@/lib/types/database";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function FacilityTypeFormDialog({ type }: { type?: FacilityTypeCatalog }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState(type?.label ?? "");
  const [slug, setSlug] = useState(type?.slug ?? "");
  const [description, setDescription] = useState(type?.description ?? "");
  const [sortOrder, setSortOrder] = useState(type ? String(type.sort_order) : "0");
  const [isActive, setIsActive] = useState(type?.is_active ?? true);

  function reset() {
    setLabel(type?.label ?? "");
    setSlug(type?.slug ?? "");
    setDescription(type?.description ?? "");
    setSortOrder(type ? String(type.sort_order) : "0");
    setIsActive(type?.is_active ?? true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const r = await upsertFacilityType({
      id: type?.id,
      label,
      slug: type ? type.slug : slug || slugifyFacilityType(label),
      description,
      sort_order: parseInt(sortOrder, 10) || 0,
      is_active: isActive,
    });
    setLoading(false);
    if (r.error) toast.error(r.error);
    else {
      toast.success(type ? "Facility type updated" : "Facility type created");
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
          Add facility type
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
            <DialogTitle>{type ? "Edit facility type" : "New facility type"}</DialogTitle>
            <DialogDescription>
              Types appear when adding locations and on tracking maps. Deactivate instead
              of deleting if locations already use a type.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="flex flex-col flex-1 min-h-0">
            <div className={cn(scrollableDialogBodyClass, "px-6 py-4 space-y-4")}>
              <div className="space-y-2">
                <Label htmlFor="ft-label">Display name</Label>
                <Input
                  id="ft-label"
                  value={label}
                  onChange={(e) => {
                    setLabel(e.target.value);
                    if (!type && !slug) setSlug(slugifyFacilityType(e.target.value));
                  }}
                  placeholder="e.g. Cross-dock"
                  required
                />
              </div>
              {!type ? (
                <div className="space-y-2">
                  <Label htmlFor="ft-slug">Code (slug)</Label>
                  <Input
                    id="ft-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase())}
                    placeholder="e.g. cross_dock"
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
                <Label htmlFor="ft-desc">Description (optional)</Label>
                <Textarea
                  id="ft-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Short note for admins"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ft-sort">Sort order</Label>
                <Input
                  id="ft-sort"
                  type="number"
                  min={0}
                  step={1}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  placeholder="e.g. 10"
                />
                <p className="text-xs text-muted-foreground">
                  Smaller numbers appear first in type dropdowns.
                </p>
              </div>
              <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-xs text-muted-foreground">
                    Inactive types are hidden when adding new locations.
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
