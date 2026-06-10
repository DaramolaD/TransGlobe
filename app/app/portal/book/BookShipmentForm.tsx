"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plane,
  Ship,
  Truck,
  Train,
  Zap,
  Shield,
  Package,
  Plus,
  Trash2,
  MapPin,
  User,
  FileText,
  Calendar,
  ChevronRight,
  ChevronLeft,
  ImagePlus,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SuccessModal } from "@/components/ui/success-modal";
import {
  createShipment,
  type BookingPackage,
  type CreateShipmentInput,
} from "@/lib/actions/shipments";
import type { ServiceType } from "@/lib/types/database";
import type { BookingPlatformConfig } from "@/lib/organization/booking-config";
import { iconForServiceSlug } from "@/lib/service-types/icons";
import { toast } from "sonner";

type BookableService = {
  slug: string;
  label: string;
  delivery_hint?: string | null;
};

const FALLBACK_BOOK_SERVICES: BookableService[] = [
  { slug: "air", label: "Air freight", delivery_hint: "2-5 business days" },
  { slug: "sea", label: "Ocean freight", delivery_hint: "15-30 days" },
  { slug: "road", label: "Road freight", delivery_hint: "3-7 days" },
  { slug: "rail", label: "Rail freight", delivery_hint: "5-10 days" },
  { slug: "express", label: "Express courier", delivery_hint: "1-2 days" },
  { slug: "standard", label: "Standard parcel", delivery_hint: "4-8 days" },
];

const STEPS = [
  { id: "service", label: "Service", icon: Plane },
  { id: "parties", label: "Shipper & recipient", icon: User },
  { id: "packages", label: "Packages", icon: Package },
  { id: "review", label: "Review", icon: CheckCircle2 },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const emptyAddress = () => ({
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
});

const emptyPackage = (): BookingPackage & { previewUrl?: string } => ({
  description: "",
  quantity: 1,
  weightKg: undefined,
  lengthCm: undefined,
  widthCm: undefined,
  heightCm: undefined,
  declaredValue: undefined,
  packageType: "general",
  imageName: undefined,
  previewUrl: undefined,
});

type DefaultShipper = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
};

function FieldGrid({
  children,
  cols = 2,
}: {
  children: React.ReactNode;
  cols?: 2 | 3;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        cols === 2 && "sm:grid-cols-2",
        cols === 3 && "sm:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {children}
    </div>
  );
}

function AddressFields({
  prefix,
  address,
  onChange,
}: {
  prefix: string;
  address: ReturnType<typeof emptyAddress>;
  onChange: (next: ReturnType<typeof emptyAddress>) => void;
}) {
  return (
    <FieldGrid cols={2}>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor={`${prefix}-line1`}>Street address</Label>
        <Input
          id={`${prefix}-line1`}
          required
          value={address.line1}
          onChange={(e) => onChange({ ...address, line1: e.target.value })}
          placeholder="123 Main Street"
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor={`${prefix}-line2`}>Apartment, suite, etc.</Label>
        <Input
          id={`${prefix}-line2`}
          value={address.line2}
          onChange={(e) => onChange({ ...address, line2: e.target.value })}
          placeholder="Suite 400"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-city`}>City</Label>
        <Input
          id={`${prefix}-city`}
          required
          value={address.city}
          onChange={(e) => onChange({ ...address, city: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-state`}>State / province</Label>
        <Input
          id={`${prefix}-state`}
          value={address.state}
          onChange={(e) => onChange({ ...address, state: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-postal`}>Postal code</Label>
        <Input
          id={`${prefix}-postal`}
          value={address.postalCode}
          onChange={(e) => onChange({ ...address, postalCode: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-country`}>Country</Label>
        <Input
          id={`${prefix}-country`}
          required
          value={address.country}
          onChange={(e) => onChange({ ...address, country: e.target.value })}
          placeholder="United States"
        />
      </div>
    </FieldGrid>
  );
}

export function BookShipmentForm({
  defaultShipper,
  platformConfig,
}: {
  defaultShipper?: DefaultShipper;
  platformConfig: BookingPlatformConfig;
}) {
  const weightLabel =
    platformConfig.weightUnit === "lb" ? "Weight (lb)" : "Weight (kg)";
  const router = useRouter();
  const [step, setStep] = useState<StepId>("service");
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [bookedTracking, setBookedTracking] = useState<string | null>(null);
  const [bookedShipmentId, setBookedShipmentId] = useState<string | null>(null);

  const [serviceType, setServiceType] = useState<ServiceType>("air");
  const [bookableServices, setBookableServices] =
    useState<BookableService[]>(FALLBACK_BOOK_SERVICES);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/service-types", { cache: "no-store" })
      .then((res) => res.json())
      .then((body: { types?: BookableService[] }) => {
        if (cancelled || !body.types?.length) return;
        setBookableServices(body.types);
        setServiceType((prev) =>
          body.types!.some((t) => t.slug === prev) ? prev : body.types![0].slug
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  const [express, setExpress] = useState(false);
  const [insurance, setInsurance] = useState(false);
  const [insuredValue, setInsuredValue] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [incoterms, setIncoterms] = useState(platformConfig.defaultIncoterms);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [goodsDescription, setGoodsDescription] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [schedulePickup, setSchedulePickup] = useState(true);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const [shipper, setShipper] = useState({
    name: defaultShipper?.name ?? "",
    company: defaultShipper?.company ?? "",
    phone: defaultShipper?.phone ?? "",
    email: defaultShipper?.email ?? "",
    address: emptyAddress(),
  });

  const [recipient, setRecipient] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    address: emptyAddress(),
  });

  const [packages, setPackages] = useState([emptyPackage()]);

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  function updatePackage(index: number, next: Partial<BookingPackage & { previewUrl?: string }>) {
    setPackages((prev) => prev.map((pkg, i) => (i === index ? { ...pkg, ...next } : pkg)));
  }

  function addPackage() {
    setPackages((prev) => [...prev, emptyPackage()]);
  }

  function removePackage(index: number) {
    setPackages((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  function handlePackageImage(index: number, file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2 MB.");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    updatePackage(index, { imageName: file.name, previewUrl });
  }

  function validateStep(current: StepId): boolean {
    if (current === "service") return true;

    if (current === "parties") {
      if (!shipper.name || !shipper.phone || !shipper.email || !shipper.address.line1 || !shipper.address.city || !shipper.address.country) {
        toast.error("Complete all required shipper fields.");
        return false;
      }
      if (!recipient.name || !recipient.phone || !recipient.email || !recipient.address.line1 || !recipient.address.city || !recipient.address.country) {
        toast.error("Complete all required recipient fields.");
        return false;
      }
      return true;
    }

    if (current === "packages") {
      if (packages.some((p) => !p.description.trim())) {
        toast.error("Each package needs a description.");
        return false;
      }
      if (insurance && !insuredValue) {
        toast.error("Enter an insured value for shipment protection.");
        return false;
      }
      if (schedulePickup && !pickupDate) {
        toast.error("Select a pickup date or disable scheduled pickup.");
        return false;
      }
      if (platformConfig.requireHsCode && !hsCode.trim()) {
        toast.error("HS code is required for international bookings.");
        return false;
      }
      return true;
    }

    return true;
  }

  function goNext() {
    if (!validateStep(step)) return;
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next.id);
  }

  function goBack() {
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev.id);
  }

  async function submit() {
    if (!validateStep("packages")) return;

    setLoading(true);
    const payload: CreateShipmentInput = {
      serviceType,
      express,
      insurance,
      insuredValue: insuredValue ? parseFloat(insuredValue) : undefined,
      referenceNumber: referenceNumber || undefined,
      goodsDescription: goodsDescription || undefined,
      hsCode: hsCode || undefined,
      incoterms,
      estimatedDelivery: estimatedDelivery || undefined,
      shipper,
      recipient,
      packages: packages.map(({ previewUrl: _preview, ...pkg }) => pkg),
      schedulePickup,
      pickupDate: schedulePickup ? pickupDate : undefined,
      pickupTime: schedulePickup ? pickupTime : undefined,
      specialInstructions: specialInstructions || undefined,
    };

    try {
      const result = await createShipment(payload);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setBookedTracking(result.shipment?.tracking_number ?? null);
      setBookedShipmentId(result.shipment?.id ?? null);
      setSuccessOpen(true);
    } catch {
      toast.error("Could not complete your booking. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setSuccessOpen(false);
    setBookedTracking(null);
    setBookedShipmentId(null);
    setStep("service");
    setExpress(false);
    setInsurance(false);
    setInsuredValue("");
    setReferenceNumber("");
    setIncoterms("DAP");
    setEstimatedDelivery("");
    setGoodsDescription("");
    setHsCode("");
    setSchedulePickup(true);
    setPickupDate("");
    setPickupTime("");
    setSpecialInstructions("");
    setRecipient({
      name: "",
      company: "",
      phone: "",
      email: "",
      address: emptyAddress(),
    });
    setPackages([emptyPackage()]);
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="grid gap-2 sm:grid-cols-4">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const active = s.id === step;
          const done = i < stepIndex;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => i <= stepIndex && setStep(s.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                active && "border-primary bg-primary/5 text-primary",
                done && !active && "border-emerald-200 bg-emerald-50 text-emerald-700",
                !active && !done && "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="font-medium">{s.label}</span>
            </button>
          );
        })}
      </div>

      {step === "service" && (
        <Card>
          <CardHeader>
            <CardTitle>Service & routing</CardTitle>
            <CardDescription>
              Choose how your shipment travels — similar to DHL Express, FedEx, or Maersk booking flows.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {bookableServices.map((option) => {
                const Icon = iconForServiceSlug(option.slug);
                const selected = serviceType === option.slug;
                return (
                  <button
                    key={option.slug}
                    type="button"
                    onClick={() => setServiceType(option.slug)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-all hover:border-primary/50",
                      selected && "border-primary bg-primary/5 ring-1 ring-primary"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{option.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {option.delivery_hint ?? "—"}
                    </p>
                  </button>
                );
              })}
            </div>

            <Separator />

            <FieldGrid cols={2}>
              <div className="space-y-2">
                <Label htmlFor="reference">
                  Your PO or order number{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="reference"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="e.g. PO-2026-0042"
                />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A number you already use at work — purchase order, sales order, or job code.
                  This is <strong>not</strong> your tracking number (we create that after you
                  book). If you add one here, it appears on your invoice so finance can match
                  this shipment to your paperwork.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="incoterms">Incoterms</Label>
                <Select value={incoterms} onValueChange={setIncoterms}>
                  <SelectTrigger id="incoterms">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXW">EXW — Ex Works</SelectItem>
                    <SelectItem value="FOB">FOB — Free on Board</SelectItem>
                    <SelectItem value="CIF">CIF — Cost, Insurance & Freight</SelectItem>
                    <SelectItem value="DAP">DAP — Delivered at Place</SelectItem>
                    <SelectItem value="DDP">DDP — Delivered Duty Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-date">Requested delivery date</Label>
                <Input
                  id="delivery-date"
                  type="date"
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                />
              </div>
            </FieldGrid>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <Checkbox
                  id="express"
                  checked={express}
                  onCheckedChange={(v) => setExpress(v === true)}
                />
                <div>
                  <Label htmlFor="express" className="flex items-center gap-2 cursor-pointer">
                    <Zap className="h-4 w-4 text-amber-500" />
                    Express priority
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Priority handling and faster transit where available.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <Checkbox
                  id="insurance"
                  checked={insurance}
                  onCheckedChange={(v) => setInsurance(v === true)}
                />
                <div className="flex-1">
                  <Label htmlFor="insurance" className="flex items-center gap-2 cursor-pointer">
                    <Shield className="h-4 w-4 text-primary" />
                    Shipment protection
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Insure goods against loss or damage in transit.
                  </p>
                  {insurance && (
                    <Input
                      className="mt-3"
                      type="number"
                      min="0"
                      placeholder="Declared value (USD)"
                      value={insuredValue}
                      onChange={(e) => setInsuredValue(e.target.value)}
                    />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "parties" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Shipper (From)
              </CardTitle>
              <CardDescription>Pickup contact and origin address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldGrid cols={2}>
                <div className="space-y-2">
                  <Label>Contact name</Label>
                  <Input required value={shipper.name} onChange={(e) => setShipper({ ...shipper, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input value={shipper.company} onChange={(e) => setShipper({ ...shipper, company: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input required type="tel" value={shipper.phone} onChange={(e) => setShipper({ ...shipper, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input required type="email" value={shipper.email} onChange={(e) => setShipper({ ...shipper, email: e.target.value })} />
                </div>
              </FieldGrid>
              <AddressFields
                prefix="shipper"
                address={shipper.address}
                onChange={(address) => setShipper({ ...shipper, address })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                Recipient (To)
              </CardTitle>
              <CardDescription>Delivery contact and destination address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldGrid cols={2}>
                <div className="space-y-2">
                  <Label>Contact name</Label>
                  <Input required value={recipient.name} onChange={(e) => setRecipient({ ...recipient, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input value={recipient.company} onChange={(e) => setRecipient({ ...recipient, company: e.target.value })} />
                </div>
      <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input required type="tel" value={recipient.phone} onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })} />
      </div>
      <div className="space-y-2">
                  <Label>Email</Label>
                  <Input required type="email" value={recipient.email} onChange={(e) => setRecipient({ ...recipient, email: e.target.value })} />
                </div>
              </FieldGrid>
              <AddressFields
                prefix="recipient"
                address={recipient.address}
                onChange={(address) => setRecipient({ ...recipient, address })}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {step === "packages" && (
        <div className="space-y-6">
          {packages.map((pkg, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>Package {index + 1}</CardTitle>
                  <CardDescription>Contents, dimensions, and optional photo.</CardDescription>
                </div>
                {packages.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removePackage(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <FieldGrid cols={2}>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Contents description</Label>
                    <Input
                      required
                      value={pkg.description}
                      onChange={(e) => updatePackage(index, { description: e.target.value })}
                      placeholder="Electronics — laptop accessories"
                    />
      </div>
      <div className="space-y-2">
                    <Label>Package type</Label>
                    <Select
                      value={pkg.packageType ?? "general"}
                      onValueChange={(v) => updatePackage(index, { packageType: v })}
                    >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
                        <SelectItem value="general">General goods</SelectItem>
                        <SelectItem value="documents">Documents</SelectItem>
                        <SelectItem value="fragile">Fragile</SelectItem>
                        <SelectItem value="perishable">Perishable</SelectItem>
                        <SelectItem value="hazardous">Dangerous goods</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={pkg.quantity}
                      onChange={(e) => updatePackage(index, { quantity: parseInt(e.target.value, 10) || 1 })}
                    />
      </div>
      <div className="space-y-2">
        <Label>{weightLabel}</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={pkg.weightKg ?? ""}
                      onChange={(e) => updatePackage(index, { weightKg: parseFloat(e.target.value) || undefined })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Declared value (USD)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={pkg.declaredValue ?? ""}
                      onChange={(e) => updatePackage(index, { declaredValue: parseFloat(e.target.value) || undefined })}
                    />
                  </div>
                </FieldGrid>

                <div>
                  <Label className="mb-2 block">Dimensions (cm) — L × W × H</Label>
                  <FieldGrid cols={3}>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Length"
                      value={pkg.lengthCm ?? ""}
                      onChange={(e) => updatePackage(index, { lengthCm: parseFloat(e.target.value) || undefined })}
                    />
                    <Input
                      type="number"
                      min="0"
                      placeholder="Width"
                      value={pkg.widthCm ?? ""}
                      onChange={(e) => updatePackage(index, { widthCm: parseFloat(e.target.value) || undefined })}
                    />
                    <Input
                      type="number"
                      min="0"
                      placeholder="Height"
                      value={pkg.heightCm ?? ""}
                      onChange={(e) => updatePackage(index, { heightCm: parseFloat(e.target.value) || undefined })}
                    />
                  </FieldGrid>
                </div>

                <div className="rounded-lg border border-dashed p-4">
                  <Label className="flex items-center gap-2 mb-3">
                    <ImagePlus className="h-4 w-4" />
                    Package photo (optional)
                  </Label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {pkg.previewUrl ? (
                      <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                        <Image
                          src={pkg.previewUrl}
                          alt={`Package ${index + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-md border bg-muted/40">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePackageImage(index, e.target.files?.[0] ?? null)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload a photo of the packed item for customs or damage reference (max 2 MB).
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button type="button" variant="outline" onClick={addPackage} className="gap-2">
            <Plus className="h-4 w-4" />
            Add another package
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Customs & goods information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Detailed goods description</Label>
                <Textarea
                  value={goodsDescription}
                  onChange={(e) => setGoodsDescription(e.target.value)}
                  placeholder="Describe contents for customs clearance (material, use, brand, model…)"
                  rows={3}
                />
              </div>
              <FieldGrid cols={2}>
                <div className="space-y-2">
                  <Label>
                    Customs product code (HS)
                    {platformConfig.requireHsCode ? (
                      <span className="text-destructive"> * required</span>
                    ) : (
                      <span className="font-normal text-muted-foreground"> (optional)</span>
                    )}
                  </Label>
                  <Input
                    value={hsCode}
                    onChange={(e) => setHsCode(e.target.value)}
                    placeholder="e.g. 8471.30 for laptops"
                    required={platformConfig.requireHsCode}
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    A standard code border agencies use to know <em>what</em> you are shipping
                    (duties and clearance). Ask your supplier or customs broker if unsure.
                    {platformConfig.requireHsCode
                      ? " Your operator requires this for bookings."
                      : " Leave blank if you do not ship internationally or do not have a code yet."}
                  </p>
                </div>
              </FieldGrid>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Pickup & instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Schedule pickup from shipper address</p>
                  <p className="text-sm text-muted-foreground">
                    Creates a linked pickup on your Pickups page and ties it to this shipment&apos;s
                    tracking number. A driver collects on your chosen date.
                  </p>
                </div>
                <Switch checked={schedulePickup} onCheckedChange={setSchedulePickup} />
              </div>
              {schedulePickup && (
                <FieldGrid cols={2}>
                  <div className="space-y-2">
                    <Label>Pickup date</Label>
                    <Input type="date" required={schedulePickup} value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
      </div>
      <div className="space-y-2">
                    <Label>Preferred time window</Label>
                    <Select value={pickupTime} onValueChange={setPickupTime}>
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
                </FieldGrid>
              )}
              <div className="space-y-2">
                <Label>Special handling instructions</Label>
                <Textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Leave with reception, call before delivery, temperature requirements…"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === "review" && (
        <Card>
          <CardHeader>
            <CardTitle>Review your booking</CardTitle>
            <CardDescription>Confirm details before submitting — like a DHL shipment summary screen.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="font-semibold mb-2">Service</p>
                <p className="capitalize">{serviceType.replace(/_/g, " ")}</p>
                {express && <p className="text-muted-foreground">Express priority</p>}
                {insurance && <p className="text-muted-foreground">Insured for ${insuredValue || "0"}</p>}
                {referenceNumber && (
                  <p className="text-muted-foreground">Your PO / order: {referenceNumber}</p>
                )}
              </div>
              <div className="rounded-lg border p-4">
                <p className="font-semibold mb-2">Route</p>
                <p>{shipper.address.city}, {shipper.address.country}</p>
                <p className="text-muted-foreground">→</p>
                <p>{recipient.address.city}, {recipient.address.country}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="font-semibold mb-2">Shipper</p>
                <p>{shipper.name}</p>
                <p className="text-muted-foreground">{shipper.email}</p>
                <p className="text-muted-foreground">{shipper.phone}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="font-semibold mb-2">Recipient</p>
                <p>{recipient.name}</p>
                <p className="text-muted-foreground">{recipient.email}</p>
                <p className="text-muted-foreground">{recipient.phone}</p>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <p className="font-semibold mb-2">Packages ({packages.length})</p>
              <ul className="space-y-2">
                {packages.map((pkg, i) => (
                  <li key={i} className="flex justify-between gap-4 border-b pb-2 last:border-0 last:pb-0">
                    <span>
                      {pkg.description} × {pkg.quantity}
                      {pkg.packageType && pkg.packageType !== "general" && (
                        <span className="text-muted-foreground"> ({pkg.packageType})</span>
                      )}
                    </span>
                    <span className="text-muted-foreground shrink-0">
                      {pkg.weightKg ? `${pkg.weightKg} kg` : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {(goodsDescription || hsCode || schedulePickup) && (
              <div className="rounded-lg border p-4">
                <p className="font-semibold mb-2">Additional details</p>
                {goodsDescription && <p className="text-muted-foreground">{goodsDescription}</p>}
                {hsCode && (
                  <p className="text-muted-foreground">Customs code (HS): {hsCode}</p>
                )}
                {schedulePickup && pickupDate && (
                  <p className="text-muted-foreground">
                    Pickup: {pickupDate} {pickupTime && `(${pickupTime})`}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between gap-4 pt-2">
        <Button type="button" variant="outline" onClick={goBack} disabled={stepIndex === 0} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        {step !== "review" ? (
          <Button type="button" onClick={goNext} className="gap-2">
            Continue
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" onClick={submit} disabled={loading} className="gap-2">
            {loading ? "Booking…" : "Confirm & book shipment"}
      </Button>
        )}
      </div>

      <SuccessModal
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Shipment booked successfully"
        description="Your booking is confirmed. Save your tracking number and we'll notify you when pickup is scheduled."
        highlightLabel="Tracking number"
        highlightValue={bookedTracking ?? undefined}
        details={[
          {
            label: "Service",
            value: serviceType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          },
          {
            label: "Route",
            value: `${shipper.address.city || "Origin"} → ${recipient.address.city || "Destination"}`,
          },
          {
            label: "Packages",
            value: String(packages.reduce((sum, p) => sum + (p.quantity || 1), 0)),
          },
          ...(schedulePickup && pickupDate
            ? [{ label: "Pickup", value: pickupDate }]
            : []),
        ]}
        primaryAction={{
          label: "Go to dashboard",
          href: "/app/portal",
          onClick: () => router.refresh(),
        }}
        secondaryAction={{
          label: "Track shipment",
          href: bookedShipmentId
            ? `/app/portal/track/${bookedShipmentId}`
            : "/app/portal/track",
        }}
        tertiaryAction={{
          label: "Book another shipment",
          onClick: resetForm,
        }}
      />
    </div>
  );
}
