import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureUserProfile } from "@/lib/auth/ensure-profile";

import { resolveSiteUrlFromRequest } from "@/lib/auth/site-url";

/**
 * Handles Supabase auth redirects (password recovery, email confirm, magic link).
 * Allowlist in Supabase → Authentication → URL Configuration (see DEV_CREDENTIALS.md).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = resolveSiteUrlFromRequest(request);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/app";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      await ensureUserProfile(
        data.user.id,
        data.user.email,
        data.user.user_metadata?.full_name
      );
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  const err =
    searchParams.get("error_description") ||
    searchParams.get("error") ||
    "auth_callback_failed";
  return NextResponse.redirect(
    new URL(`/login?error=${encodeURIComponent(err)}`, origin)
  );
}
