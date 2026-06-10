"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { toast } from "sonner";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) {
      setChecking(false);
      return;
    }

    const supabase = createClient();

    async function verifySession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setReady(true);
        setChecking(false);
        return;
      }

      const hash = window.location.hash;
      if (hash.includes("type=recovery") || hash.includes("access_token")) {
        const { data: { session: s } } = await supabase.auth.getSession();
        if (s) {
          setReady(true);
          setChecking(false);
          return;
        }
      }

      setChecking(false);
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setReady(true);
        setChecking(false);
      }
    });

    void verifySession();
    return () => sub.subscription.unsubscribe();
  }, [configured]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password updated. Redirecting…");
    router.push("/app");
    router.refresh();
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
        <CardTitle>Set new password</CardTitle>
        <CardDescription>Choose a strong password for your account.</CardDescription>
      </CardHeader>
      <CardContent>
        {checking && (
          <p className="text-sm text-muted-foreground text-center py-6">Verifying link…</p>
        )}

        {!checking && !ready && (
          <div className="space-y-4 text-sm">
            <p className="text-destructive">
              This reset link is invalid or has expired.
            </p>
            <p className="text-muted-foreground">
              Request a new link from the forgot password page. Links expire after a
              short time — open the email on the same device or browser if possible.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login/forgot-password">Request new link</Link>
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/login">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to sign in
              </Link>
            </Button>
          </div>
        )}

        {!checking && ready && (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <PasswordInput
                id="new-password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <PasswordInput
                id="confirm-password"
                required
                minLength={6}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update password
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
