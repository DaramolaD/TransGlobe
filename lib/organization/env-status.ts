export type IntegrationEnvStatus = {
  key: string;
  label: string;
  description: string;
  configured: boolean;
  envVar: string;
  required: boolean;
};

export function getIntegrationEnvStatus(): IntegrationEnvStatus[] {
  return [
    {
      key: "supabase_url",
      label: "Supabase project",
      description: "Auth, database, and realtime for tracking events",
      configured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      envVar: "NEXT_PUBLIC_SUPABASE_URL",
      required: true,
    },
    {
      key: "supabase_anon",
      label: "Supabase anon key",
      description: "Browser and server client access",
      configured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      envVar: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      required: true,
    },
    {
      key: "service_role",
      label: "Service role key",
      description: "Role promotion, public forms, and admin bypass when RLS blocks",
      configured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      envVar: "SUPABASE_SERVICE_ROLE_KEY",
      required: false,
    },
    {
      key: "mapbox",
      label: "Mapbox",
      description: "Live driver map, facility waypoints, and public tracking map",
      configured: Boolean(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN),
      envVar: "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN",
      required: false,
    },
    {
      key: "site_url",
      label: "Site URL",
      description: "Auth email redirects and absolute links in production",
      configured: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
      envVar: "NEXT_PUBLIC_SITE_URL",
      required: false,
    },
  ];
}
