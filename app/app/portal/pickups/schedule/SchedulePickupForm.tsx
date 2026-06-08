"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Package, Loader2 } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { schedulePickup } from "@/lib/actions/pickups";
import { SuccessModal } from "@/components/ui/success-modal";
import { toast } from "sonner";

type DefaultContact = {
  name?: string;
  email?: string;
  phone?: string;
};

export function SchedulePickupForm({ defaultContact }: { defaultContact?: DefaultContact }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [scheduledSummary, setScheduledSummary] = useState<string | null>(null);

  const [pickupType, setPickupType] = useState("package");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupCity, setPickupCity] = useState("");
  const [pickupState, setPickupState] = useState("");
  const [pickupZip, setPickupZip] = useState("");
  const [pickupCountry, setPickupCountry] = useState("");
  const [contactName, setContactName] = useState(defaultContact?.name ?? "");
  const [contactPhone, setContactPhone] = useState(defaultContact?.phone ?? "");
  const [contactEmail, setContactEmail] = useState(defaultContact?.email ?? "");
  const [packageCount, setPackageCount] = useState("1");
  const [packageWeight, setPackageWeight] = useState("");
  const [packageDimensions, setPackageDimensions] = useState("");
  const [serviceType, setServiceType] = useState("standard");
  const [specialInstructions, setSpecialInstructions] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!pickupDate || !pickupTime || !pickupAddress || !pickupCity || !pickupCountry) {
      toast.error("Please complete all required pickup fields.");
      return;
    }

    setLoading(true);
    const result = await schedulePickup({
      pickupType,
      pickupDate,
      pickupTime,
      pickupAddress,
      pickupCity,
      pickupState: pickupState || undefined,
      pickupZip: pickupZip || undefined,
      pickupCountry,
      contactName,
      contactPhone,
      contactEmail,
      packageCount: parseInt(packageCount, 10) || 1,
      packageWeight: packageWeight || undefined,
      packageDimensions: packageDimensions || undefined,
      serviceType,
      specialInstructions: specialInstructions || undefined,
    });
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    setScheduledSummary(
      `${result.pickup?.pickup_city ?? pickupCity} · ${result.pickup?.pickup_date ?? pickupDate}`
    );
    setSuccessOpen(true);
  }

  return (
    <>
      <form onSubmit={submit} className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              When & what
            </CardTitle>
            <CardDescription>Pickup window and package details.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Pickup type</Label>
              <Select value={pickupType} onValueChange={setPickupType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="package">Package</SelectItem>
                  <SelectItem value="pallet">Pallet</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Service</Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="freight">Freight</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pickup date</Label>
              <Input type="date" required value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Time window</Label>
              <Select value={pickupTime} onValueChange={setPickupTime} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select window" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00-12:00">Morning (8 AM – 12 PM)</SelectItem>
                  <SelectItem value="12:00-17:00">Afternoon (12 PM – 5 PM)</SelectItem>
                  <SelectItem value="17:00-20:00">Evening (5 PM – 8 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Package count</Label>
              <Input type="number" min="1" value={packageCount} onChange={(e) => setPackageCount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Total weight (kg)</Label>
              <Input type="number" min="0" step="0.1" value={packageWeight} onChange={(e) => setPackageWeight(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Dimensions (optional)</Label>
              <Input
                placeholder="e.g. 40 x 30 x 20 cm"
                value={packageDimensions}
                onChange={(e) => setPackageDimensions(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Pickup location
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Street address</Label>
              <Input required value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input required value={pickupCity} onChange={(e) => setPickupCity(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>State / province</Label>
              <Input value={pickupState} onChange={(e) => setPickupState(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Postal code</Label>
              <Input value={pickupZip} onChange={(e) => setPickupZip(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input required value={pickupCountry} onChange={(e) => setPickupCountry(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input required value={contactName} onChange={(e) => setContactName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input required type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Email</Label>
              <Input required type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Special instructions</Label>
              <Textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Gate code, loading dock, contact on arrival…"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm pickup
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/app/portal/pickups")}>
            Cancel
          </Button>
        </div>
      </form>

      <SuccessModal
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Pickup scheduled"
        description="Your pickup request is in the queue. Operations will confirm the window shortly."
        highlightLabel="Scheduled for"
        highlightValue={scheduledSummary ?? undefined}
        primaryAction={{
          label: "View pickups",
          href: "/app/portal/pickups",
          onClick: () => router.refresh(),
        }}
        secondaryAction={{
          label: "Book a shipment",
          href: "/app/portal/book",
        }}
      />
    </>
  );
}
