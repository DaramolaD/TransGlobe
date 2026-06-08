"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { signIn, signUp } from "@/lib/actions/auth";
import { rethrowNavigationError } from "@/lib/errors/navigation";
import { toast } from "sonner";

function LoginFormInner() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const configured = isSupabaseConfigured();

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!configured) return;
    setLoading(true);
    try {
      const result = await signIn(email, password);
      if (result?.error) toast.error(result.error);
    } catch (err) {
      rethrowNavigationError(err);
      toast.error("Unable to reach the authentication server. Try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!configured) return;
    setLoading(true);
    try {
      const result = await signUp(email, password, fullName);
      if (result?.error) toast.error(result.error);
      else if (result?.success) toast.success(result.message);
    } catch (err) {
      rethrowNavigationError(err);
      toast.error("Unable to reach the authentication server. Try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Link href="/" className="inline-flex items-center justify-center gap-2 font-bold text-xl mb-2">
          <Package className="h-7 w-7 text-primary" />
          SwiftCargo
        </Link>
        <CardTitle>Sign in to your account</CardTitle>
        <CardDescription>Customer portal, operations, and driver apps</CardDescription>
      </CardHeader>
      <CardContent>
        {!configured && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <p className="font-medium">Supabase not configured</p>
            <p className="mt-1">
              Copy <code className="text-xs">.env.example</code> to{" "}
              <code className="text-xs">.env.local</code> and run{" "}
              <code className="text-xs">supabase/migrations/20250524000000_initial_platform.sql</code>
            </p>
          </div>
        )}
        {error === "config" && (
          <p className="text-sm text-destructive mb-4">Missing environment configuration.</p>
        )}
        {error === "inactive" && (
          <p className="text-sm text-destructive mb-4">Your account has been deactivated.</p>
        )}
        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/login/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={loading || !configured}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <PasswordInput id="signup-password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={loading || !configured}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link href="/" className="text-primary hover:underline">
            Back to website
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={<div className="w-full max-w-md h-96 animate-pulse bg-muted rounded-lg" />}>
      <LoginFormInner />
    </Suspense>
  );
}
