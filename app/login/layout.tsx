import { BrandProvider } from "@/components/branding/BrandProvider";
import { getSiteBrand } from "@/lib/branding/site-brand";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const brand = await getSiteBrand();
  return <BrandProvider brand={brand}>{children}</BrandProvider>;
}
