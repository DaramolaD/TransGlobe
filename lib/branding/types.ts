/** Public marketing site brand — safe to pass into client components */
export type SiteBrand = {
  name: string;
  logoUrl: string | null;
  tagline: string;
  region: string;
  headquarters: string;
  supportEmail: string;
  supportPhone: string;
  opsHours: string;
  legalName: string;
  customsBrokerContact: string;
  cargoInsurancePartner: string;
};
