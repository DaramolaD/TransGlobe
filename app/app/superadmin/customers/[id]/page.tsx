import { ProfileDetailPageContent } from "@/components/dashboard/ProfileDetailPageContent";

export default async function SuperadminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <ProfileDetailPageContent
      profileId={id}
      audience="customer"
      backHref="/app/superadmin/customers"
      backLabel="Back to customers"
    />
  );
}
