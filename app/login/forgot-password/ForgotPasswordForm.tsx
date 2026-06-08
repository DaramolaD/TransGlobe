"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { requestPasswordReset } from "@/lib/actions/auth";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const configured = isSupabaseConfigured();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!configured) return;

    setLoading(true);
    try {
      const result = await requestPasswordReset(email);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      setSent(true);
      toast.success("Check your email for the reset link.");
    } catch {
      toast.error("Unable to reach the authentication server. Try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 font-bold text-xl mb-2"
        >
          <Package className="h-7 w-7 text-primary" />
          SwiftCargo
        </Link>
        <CardTitle>Forgot password</CardTitle>
        <CardDescription>
          We&apos;ll email you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!configured && (
          <p className="text-sm text-destructive mb-4">Supabase is not configured.</p>
        )}

        {sent ? (
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              If an account exists for <strong className="text-foreground">{email}</strong>,
              you will receive an email shortly. Open the link and choose a new password.
            </p>
            <p className="text-xs">
              The link expires after a short time. If you don&apos;t see the email, check spam.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to sign in
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || !configured}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send reset link
            </Button>
            <p className="text-center text-sm">
              <Link href="/login" className="text-primary hover:underline inline-flex items-center gap-1">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to sign in
              </Link>
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
