export function profileDetailHref(
  profileId: string,
  audience: "team" | "customer"
): string {
  return audience === "customer"
    ? `/app/superadmin/customers/${profileId}`
    : `/app/superadmin/users/${profileId}`;
}
