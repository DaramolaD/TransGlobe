"use client";

import { createContext, useContext } from "react";
import type { SiteBrand } from "@/lib/branding/types";

const BrandContext = createContext<SiteBrand | null>(null);

export function BrandProvider({
  brand,
  children,
}: {
  brand: SiteBrand;
  children: React.ReactNode;
}) {
  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>;
}

export function useBrand(): SiteBrand {
  const brand = useContext(BrandContext);
  if (!brand) {
    throw new Error("useBrand must be used within BrandProvider");
  }
  return brand;
}
