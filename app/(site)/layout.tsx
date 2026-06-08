import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { BrandProvider } from "@/components/branding/BrandProvider";
import { getSiteBrand } from "@/lib/branding/site-brand";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getSiteBrand();
  return {
    title: {
      default: `${brand.name} — Global Logistics`,
      template: `%s | ${brand.name}`,
    },
    description: `${brand.name} delivers freight, tracking, and supply chain solutions worldwide.`,
  };
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const brand = await getSiteBrand();

  return (
    <BrandProvider brand={brand}>
      <Header brand={brand} />
      <main>{children}</main>
      <Footer brand={brand} />
      <ChatWidget brand={brand} />
    </BrandProvider>
  );
}
