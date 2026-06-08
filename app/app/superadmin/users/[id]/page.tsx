import { ProfileDetailPageContent } from "@/components/dashboard/ProfileDetailPageContent";

export default async function SuperadminTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <ProfileDetailPageContent
      profileId={id}
      audience="team"
      backHref="/app/superadmin/users"
      backLabel="Back to team"
    />
  );
}
