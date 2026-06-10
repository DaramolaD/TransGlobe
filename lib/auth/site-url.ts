import { headers } from "next/headers";

const LOCALHOST_FALLBACK = "http://localhost:3000";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

function originFromHost(host: string, proto?: string | null): string {
  const hostname = host.split(",")[0].trim();
  const protocol =
    proto ??
    (hostname.startsWith("localhost") || hostname.startsWith("127.0.0.1")
      ? "http"
      : "https");
  return `${protocol}://${hostname}`;
}

/**
 * Canonical site URL for auth emails and redirects (server-side).
 *
 * Priority:
 * 1. NEXT_PUBLIC_SITE_URL — production custom domain (set on Vercel)
 * 2. VERCEL_URL — auto on Vercel when explicit URL not set
 * 3. Request Host — local dev / server actions during a request
 * 4. localhost — last resort for offline scripts
 */
export async function resolveSiteUrl(): Promise<string> {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return stripTrailingSlash(explicit);

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;

  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    if (host) {
      return originFromHost(host, h.get("x-forwarded-proto"));
    }
  } catch {
    // Not in a request context (e.g. build-time script)
  }

  return LOCALHOST_FALLBACK;
}

/** Same resolution using an incoming Request (route handlers). */
export function resolveSiteUrlFromRequest(request: Request): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return stripTrailingSlash(explicit);

  return new URL(request.url).origin;
}

/** @deprecated Use resolveSiteUrl() on the server. Client-only helper. */
export function getSiteUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return LOCALHOST_FALLBACK;
}

export async function getPasswordResetRedirectUrl(): Promise<string> {
  const site = await resolveSiteUrl();
  return `${site}/auth/callback?next=${encodeURIComponent("/login/reset-password")}`;
}

export async function getEmailConfirmRedirectUrl(): Promise<string> {
  const site = await resolveSiteUrl();
  return `${site}/auth/callback?next=${encodeURIComponent("/app")}`;
}

/** Add these under Supabase → Authentication → Redirect URLs */
export function supabaseAuthRedirectUrls(siteUrl: string): string[] {
  const base = stripTrailingSlash(siteUrl);
  return [`${base}/auth/callback`, `${base}/auth/callback/**`];
}
