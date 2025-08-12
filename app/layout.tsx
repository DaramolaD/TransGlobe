import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SwiftCargo - Premium Global Logistics Solutions",
  description: "SwiftCargo delivers innovative logistics solutions that connect businesses globally. From air freight to sea cargo, we ensure your shipments reach their destination safely and on time.",
  keywords: "logistics, freight, shipping, air freight, sea freight, road freight, rail freight, supply chain, global shipping, customs clearance",
  authors: [{ name: "SwiftCargo Team" }],
  creator: "SwiftCargo",
  publisher: "SwiftCargo",
  robots: "index, follow",
  openGraph: {
    title: "SwiftCargo - Premium Global Logistics Solutions",
    description: "Innovative logistics solutions for global business success",
    url: "https://swiftcargo.com",
    siteName: "SwiftCargo",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SwiftCargo Logistics Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwiftCargo - Premium Global Logistics Solutions",
    description: "Innovative logistics solutions for global business success",
    images: ["/og-image.jpg"],
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3B82F6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased`}>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
