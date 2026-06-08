/** Canonical site URL for auth redirects (password reset, email confirm). */
export function getSiteUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export function getPasswordResetRedirectUrl(): string {
  const site = getSiteUrl();
  return `${site}/auth/callback?next=${encodeURIComponent("/login/reset-password")}`;
}

export function getEmailConfirmRedirectUrl(): string {
  const site = getSiteUrl();
  return `${site}/auth/callback?next=${encodeURIComponent("/app")}`;
}
