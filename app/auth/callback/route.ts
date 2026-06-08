import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureUserProfile } from "@/lib/auth/ensure-profile";

/**
 * Handles Supabase auth redirects (password recovery, email confirm, magic link).
 * Configure in Supabase Dashboard → Authentication → URL Configuration:
 * - Site URL: http://localhost:3000 (or your production domain)
 * - Redirect URLs: http://localhost:3000/auth/callback
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
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
