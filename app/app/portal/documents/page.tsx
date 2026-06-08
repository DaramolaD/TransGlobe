import Link from "next/link";
import { FileText, Mail, Shield, Upload } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DOC_TYPES = [
  { title: "Bill of lading", desc: "Proof of carriage for sea and air freight" },
  { title: "Commercial invoice", desc: "Customs valuation and duties" },
  { title: "Packing list", desc: "Contents and weights per carton" },
  { title: "Customs declaration", desc: "Import/export clearance forms" },
];

export default function PortalDocumentsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Documents"
        description="Keep shipping paperwork organized — bills of lading, invoices, customs forms, and more."
      />

      <Card className="border-dashed bg-muted/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload documents
          </CardTitle>
          <CardDescription>
            Online uploads are not available in your portal yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Need to send paperwork for a shipment? Email our team with your tracking number
            and we will attach files to your account.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/app/portal/support">
              <Mail className="h-4 w-4 mr-2" />
              Contact support
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-sm font-semibold mb-3">Common document types</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {DOC_TYPES.map((d) => (
            <Card key={d.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {d.title}
                </CardTitle>
                <CardDescription className="text-xs">{d.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground flex items-center gap-2">
        <Shield className="h-3 w-3 shrink-0" />
        Documents you share with us are handled securely and only used for your shipments.
      </p>
    </div>
  );
}
