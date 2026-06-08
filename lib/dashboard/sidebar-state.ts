/** Must match `SIDEBAR_COOKIE_NAME` in `components/ui/sidebar.tsx` */
export const SIDEBAR_STATE_COOKIE = "sidebar_state";

export function parseSidebarOpenCookie(value: string | undefined): boolean {
  if (value === undefined) return true;
  return value === "true";
}
