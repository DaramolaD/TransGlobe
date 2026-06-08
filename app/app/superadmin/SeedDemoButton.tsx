"use client";

import { Button } from "@/components/ui/button";
import { seedDemoShipment } from "@/lib/actions/shipments";
import { toast } from "sonner";

export function SeedDemoButton() {
  async function seed() {
    const r = await seedDemoShipment();
    if (r.error) toast.error(r.error);
    else toast.success(`Demo tracking: ${r.tracking}`);
  }

  return (
    <Button variant="outline" size="sm" onClick={seed}>
      Add demo shipment
    </Button>
  );
}
