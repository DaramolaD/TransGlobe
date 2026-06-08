/** Rethrow Next.js redirect/notFound errors — they must not be caught as failures. */
export function isNextNavigationError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const digest = (error as { digest?: unknown }).digest;
  return (
    typeof digest === "string" &&
    (digest.startsWith("NEXT_REDIRECT") || digest.startsWith("NEXT_NOT_FOUND"))
  );
}

export function rethrowNavigationError(error: unknown): void {
  if (isNextNavigationError(error)) throw error;
}
