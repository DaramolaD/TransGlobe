"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Pencil, Users } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { DetailModalShell } from "@/components/dashboard/DetailModalShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { updateLeadDetails } from "@/lib/actions/leads";
import { LEAD_CATEGORY_LABELS, LEAD_STATUS_LABELS, leadDisplayName } from "@/lib/leads/utils";
import { assigneeLabel } from "@/components/leads/lead-helpers";
import type { Lead, LeadCategory, LeadStatus } from "@/lib/types/database";
import { LeadDetailActions } from "./LeadDetailActions";
import { LeadActivityList } from "./LeadActivityList";
import { toast } from "sonner";

type Assignee = { id: string; full_name: string | null; email: string };

const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "converted", "lost"];

function ViewField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium mt-0.5 break-words">{value}</p>
    </div>
  );
}

const EMPTY_FORM = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  company: "",
  service_interest: "",
  message: "",
  status: "new" as LeadStatus,
  category: "sales" as LeadCategory,
};

function leadToForm(lead: Lead) {
  return {
    first_name: lead.first_name,
    last_name: lead.last_name,
    email: lead.email,
    phone: lead.phone ?? "",
    company: lead.company ?? "",
    service_interest: lead.service_interest ?? "",
    message: lead.message ?? "",
    status: lead.status,
    category: lead.category ?? ("sales" as LeadCategory),
  };
}

export function LeadEditModal({
  lead,
  open,
  onOpenChange,
  assignees,
  canManage,
  basePath,
}: {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignees: Assignee[];
  canManage: boolean;
  basePath: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activityKey, setActivityKey] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!lead) return;
    setForm(leadToForm(lead));
    setEditing(false);
  }, [lead, open]);

  if (!lead) return null;

  async function saveDetails(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const r = await updateLeadDetails(lead!.id, {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone || null,
      company: form.company || null,
      service_interest: form.service_interest || null,
      message: form.message || null,
      status: form.status,
      category: canManage ? form.category : undefined,
    });
    setSaving(false);

    if (r.error) toast.error(r.error);
    else {
      toast.success("Lead saved");
      setActivityKey((k) => k + 1);
      setEditing(false);
      router.refresh();
    }
  }

  function handleChanged() {
    setActivityKey((k) => k + 1);
    router.refresh();
  }

  function patch<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function cancelEdit() {
    if (!lead) return;
    setForm(leadToForm(lead));
    setEditing(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DetailModalShell
        maxWidth="lg"
        headerClass="bg-blue-50 dark:bg-blue-950/30"
        icon={Users}
        iconClass="text-blue-700 ring-blue-200 dark:text-blue-300"
        label={editing ? "Edit lead" : "Lead"}
        srTitle={leadDisplayName(lead)}
        footer={
          <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href={`${basePath}/${lead.id}`} onClick={() => onOpenChange(false)}>
                Open full page
                <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            {!editing ? (
              <Button type="button" className="w-full sm:w-auto" onClick={() => setEditing(true)}>
                <Pencil className="mr-1.5 h-4 w-4" />
                Edit
              </Button>
            ) : null}
          </div>
        }
      >
        <div className="space-y-5">
          {!editing ? (
            <>
              <div>
                <h2 className="text-xl font-semibold leading-snug">{leadDisplayName(lead)}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{lead.email}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={LEAD_STATUS_LABELS[lead.status]} />
                <StatusBadge status={LEAD_CATEGORY_LABELS[lead.category ?? "sales"]} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <ViewField label="Phone" value={lead.phone ?? "—"} />
                <ViewField label="Company" value={lead.company ?? "—"} />
                <ViewField label="Service interest" value={lead.service_interest ?? "—"} />
                <ViewField label="Assigned to" value={assigneeLabel(lead)} />
                <ViewField label="Source" value={lead.source ?? "—"} />
                <ViewField
                  label="Created"
                  value={new Date(lead.created_at).toLocaleString()}
                />
                <ViewField
                  label="Updated"
                  value={new Date(lead.updated_at).toLocaleString()}
                />
                {lead.last_contacted_at ? (
                  <ViewField
                    label="Last contact"
                    value={new Date(lead.last_contacted_at).toLocaleString()}
                  />
                ) : null}
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Message</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap rounded-md border bg-muted/20 p-3">
                  {lead.message ?? "No message provided."}
                </p>
              </div>
            </>
          ) : (
            <form onSubmit={saveDetails} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="lead-first">First name</Label>
                  <Input
                    id="lead-first"
                    value={form.first_name}
                    onChange={(e) => patch("first_name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lead-last">Last name</Label>
                  <Input
                    id="lead-last"
                    value={form.last_name}
                    onChange={(e) => patch("last_name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="lead-email">Email</Label>
                  <Input
                    id="lead-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => patch("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lead-phone">Phone</Label>
                  <Input
                    id="lead-phone"
                    value={form.phone}
                    onChange={(e) => patch("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lead-company">Company</Label>
                  <Input
                    id="lead-company"
                    value={form.company}
                    onChange={(e) => patch("company", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="lead-service">Service interest</Label>
                  <Input
                    id="lead-service"
                    value={form.service_interest}
                    onChange={(e) => patch("service_interest", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => patch("status", v as LeadStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {LEAD_STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {canManage ? (
                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select
                      value={form.category}
                      onValueChange={(v) => patch("category", v as LeadCategory)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(LEAD_CATEGORY_LABELS) as LeadCategory[]).map((c) => (
                          <SelectItem key={c} value={c}>
                            {LEAD_CATEGORY_LABELS[c]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lead-message">Message</Label>
                <Textarea
                  id="lead-message"
                  rows={3}
                  value={form.message}
                  onChange={(e) => patch("message", e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {!editing ? (
            <>
              <Separator />

              <LeadDetailActions
                lead={lead}
                assignees={assignees}
                canManage={canManage}
                onChanged={handleChanged}
              />

              <Separator />

              <div>
                <p className="text-sm font-medium mb-2">Activity</p>
                <LeadActivityList key={activityKey} leadId={lead.id} />
              </div>
            </>
          ) : null}
        </div>
      </DetailModalShell>
    </Dialog>
  );
}
