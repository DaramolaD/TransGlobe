import type { ProfileActivityProfile } from "@/lib/profile-activity";
import { formatTableDate } from "@/lib/dashboard/table-details";

export type ProfileMetaItem = {
  label: string;
  value: React.ReactNode;
};

export function buildProfileMetaItems(
  profile: Pick<
    ProfileActivityProfile,
    | "id"
    | "email"
    | "phone"
    | "company_name"
    | "created_at"
    | "updated_at"
  >
): ProfileMetaItem[] {
  const items: ProfileMetaItem[] = [
    {
      label: "Account ID",
      value: (
        <span
          className="font-mono text-xs break-all leading-relaxed"
          title={profile.id}
        >
          {profile.id}
        </span>
      ),
    },
    {
      label: "Email",
      value: (
        <span className="truncate inline-block max-w-full align-bottom">
          {profile.email ?? "—"}
        </span>
      ),
    },
    {
      label: "Phone",
      value: profile.phone?.trim() ? profile.phone : "—",
    },
  ];

  if (profile.company_name?.trim()) {
    items.push({ label: "Company", value: profile.company_name });
  }

  items.push({
    label: "Joined",
    value: <span className="tabular-nums">{formatTableDate(profile.created_at)}</span>,
  });

  if (profile.updated_at && profile.updated_at !== profile.created_at) {
    items.push({
      label: "Last updated",
      value: <span className="tabular-nums">{formatTableDate(profile.updated_at)}</span>,
    });
  }

  return items;
}

export function formatServiceType(service?: string | null) {
  if (!service) return "—";
  return service.replace(/_/g, " ");
}
