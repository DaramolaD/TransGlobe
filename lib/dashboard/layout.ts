/**
 * Centered dashboard content column.
 * max-w-7xl (1280px) — common SaaS admin width (readable forms + medium tables).
 * Use max-w-screen-2xl (1536px) on individual pages if a view needs extra table width.
 */
export const DASHBOARD_CONTENT_MAX = "max-w-7xl";

/** Shared horizontal padding for header + main */
export const DASHBOARD_CONTENT_PAD = "px-4 md:px-6";

/** Centers page content inside the sidebar inset */
export const dashboardContentClass = `mx-auto w-full ${DASHBOARD_CONTENT_MAX} ${DASHBOARD_CONTENT_PAD}`;
