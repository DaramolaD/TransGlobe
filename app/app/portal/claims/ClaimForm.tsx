"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClaim } from "@/lib/actions/claims";
import { toast } from "sonner";

export function ClaimForm() {
  const [loading, setLoading] = useState(false);
  const [shipmentRef, setShipmentRef] = useState("");
  const [type, setType] = useState("damage");
  const [description, setDescription] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!shipmentRef.trim()) {
      toast.error("Enter your tracking number");
      return;
    }
    setLoading(true);
    const r = await createClaim({ shipmentId: shipmentRef.trim(), claimType: type, description });
    setLoading(false);
    if (r.error) toast.error(r.error);
    else {
      toast.success("Claim submitted");
      setDescription("");
    }
  }

  return (
    <form onSubmit={submit} className="max-w-lg space-y-4 border rounded-lg p-4">
      <p className="text-sm font-medium">Open a new claim</p>
      <div className="space-y-2">
        <Label>Tracking number</Label>
        <Input
          value={shipmentRef}
          onChange={(e) => setShipmentRef(e.target.value)}
          placeholder="e.g. SC-123456"
        />
      </div>
      <div className="space-y-2">
        <Label>Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="damage">Damage</SelectItem>
            <SelectItem value="loss">Loss</SelectItem>
            <SelectItem value="delay">Delay</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea required value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <Button type="submit" disabled={loading}>
        Submit claim
      </Button>
    </form>
  );
}
