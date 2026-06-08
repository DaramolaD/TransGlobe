"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignAllNewLeads, assignLead, bulkAssignLeads } from "@/lib/actions/leads";
import { toast } from "sonner";

type Assignee = { id: string; full_name: string | null; email: string };

export function LeadAssignModal({
  open,
  onOpenChange,
  assignees,
  leadIds,
  mode,
  singleLeadId,
  onComplete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignees: Assignee[];
  leadIds?: string[];
  mode?: "selected" | "all_new" | "single";
  singleLeadId?: string;
  onComplete?: () => void;
}) {
  const router = useRouter();
  const [assigneeId, setAssigneeId] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!assigneeId) {
      toast.error("Choose a sales person");
      return;
    }
    setLoading(true);

    let result: { error?: string; success?: boolean; count?: number } = {};
    if (mode === "single" && singleLeadId) {
      result = await assignLead(singleLeadId, assigneeId);
    } else if (mode === "all_new") {
      result = await assignAllNewLeads(assigneeId);
    } else if (leadIds?.length) {
      result = await bulkAssignLeads(leadIds, assigneeId);
    } else {
      toast.error("No leads selected");
      setLoading(false);
      return;
    }

    setLoading(false);
    if (result.error) toast.error(result.error);
    else {
      toast.success(
        mode === "all_new"
          ? `Assigned ${result.count ?? 0} new lead(s)`
          : "Lead assignment saved"
      );
      onOpenChange(false);
      onComplete?.();
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign leads</DialogTitle>
          <DialogDescription>
            {mode === "all_new"
              ? "Assign every unassigned lead with status New."
              : mode === "single"
                ? "Assign this lead to a team member."
                : `Assign ${leadIds?.length ?? 0} selected lead(s).`}
          </DialogDescription>
        </DialogHeader>
        <Select value={assigneeId} onValueChange={setAssigneeId}>
          <SelectTrigger>
            <SelectValue placeholder="Select sales person" />
          </SelectTrigger>
          <SelectContent>
            {assignees.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.full_name ?? a.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={loading}>
            {loading ? "Saving…" : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
