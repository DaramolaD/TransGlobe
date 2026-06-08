"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addLeadNote,
  updateLeadCategory,
  updateLeadStatus,
} from "@/lib/actions/leads";
import { LEAD_CATEGORY_LABELS, LEAD_STATUS_LABELS } from "@/lib/leads/utils";
import type { Lead, LeadCategory, LeadStatus } from "@/lib/types/database";
import { LeadAssignModal } from "./LeadAssignModal";
import { toast } from "sonner";

type Assignee = { id: string; full_name: string | null; email: string };

const STATUS_FLOW: LeadStatus[] = ["new", "contacted", "qualified", "converted", "lost"];

export function LeadDetailActions({
  lead,
  assignees,
  canManage,
  onChanged,
}: {
  lead: Lead;
  assignees: Assignee[];
  canManage: boolean;
  onChanged?: () => void;
}) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  function refresh() {
    router.refresh();
    onChanged?.();
  }

  async function setStatus(status: LeadStatus) {
    setLoading(true);
    const r = await updateLeadStatus(lead.id, status);
    setLoading(false);
    if (r.error) toast.error(r.error);
    else {
      toast.success("Status updated");
      refresh();
    }
  }

  async function saveNote() {
    setLoading(true);
    const r = await addLeadNote(lead.id, note);
    setLoading(false);
    if (r.error) toast.error(r.error);
    else {
      toast.success("Note added");
      setNote("");
      refresh();
    }
  }

  async function setCategory(category: LeadCategory) {
    const r = await updateLeadCategory(lead.id, category);
    if (r.error) toast.error(r.error);
    else {
      toast.success("Category updated");
      refresh();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {STATUS_FLOW.filter((s) => s !== lead.status).map((s) => (
          <Button
            key={s}
            size="sm"
            variant={s === "converted" ? "default" : "outline"}
            disabled={loading || lead.status === "converted"}
            onClick={() => setStatus(s)}
          >
            {LEAD_STATUS_LABELS[s]}
          </Button>
        ))}
      </div>

      {canManage ? (
        <div>
          <Button size="sm" variant="outline" onClick={() => setAssignOpen(true)}>
            Assign
          </Button>
        </div>
      ) : null}

      {canManage ? (
        <div className="space-y-2 max-w-xs">
          <Label>Category</Label>
          <Select
            defaultValue={lead.category ?? "sales"}
            onValueChange={(v) => setCategory(v as LeadCategory)}
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

      <div className="space-y-2">
        <Label htmlFor="lead-note">Add note</Label>
        <Textarea
          id="lead-note"
          rows={3}
          placeholder="Follow-up details, call summary…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button size="sm" disabled={loading || !note.trim()} onClick={saveNote}>
          Save note
        </Button>
      </div>

      {canManage ? (
        <LeadAssignModal
          open={assignOpen}
          onOpenChange={setAssignOpen}
          assignees={assignees}
          mode="single"
          singleLeadId={lead.id}
        />
      ) : null}
    </div>
  );
}
