import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PortalSupportPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Support"
        description="Our operations team is available for shipment updates, claims, and customs questions."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </CardTitle>
            <CardDescription>Typical response within 4 business hours</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">ops@swiftcargo.com</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone
            </CardTitle>
            <CardDescription>Mon–Fri 8:00–18:00 local time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">+1 (800) 555-CARGO</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Live chat
          </CardTitle>
          <CardDescription>Available on our public website</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/contact">Contact form</Link>
          </Button>
          <Button asChild>
            <Link href="/app/portal/claims">File a claim</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
