"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Menu, 
  X,
  ArrowRight,
  ChevronDown,
  Plane,
  Ship,
  Truck,
  Train,
  Globe,
  Users,
  BarChart3,
  Shield,
  Zap,
  Clock,
  MapPin,
  Award,
  ShoppingCart,
  Factory,
  Car,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { IconTile, iconToneAt } from "@/components/IconTile";
import { BrandMark } from "@/components/branding/BrandMark";
import type { SiteBrand } from "@/lib/branding/types";
import { cn } from "@/lib/utils";

const navItemClass = (
  active: boolean,
  open?: boolean,
  opts?: { block?: boolean }
) =>
  cn(
    "nav-link text-sm rounded-lg",
    opts?.block
      ? "flex w-full py-3 px-3"
      : "inline-flex items-center h-9 px-4",
    "hover:!bg-[var(--nav-hover)] hover:!text-graphite-dark focus:!bg-[var(--nav-hover)] focus:!text-graphite-dark data-[state=open]:!bg-[var(--nav-open)] data-[state=open]:!text-graphite-dark",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-graphite-mid/25 focus-visible:ring-offset-2",
    active && "nav-link-active",
    !active && open && "nav-link-open"
  );

export default function Header({ brand }: { brand?: SiteBrand }) {
  const brandName = brand?.name ?? "SwiftCargo";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const navigation = [
    {
      name: "Home",
      href: "/",
      simple: true,
    },
    {
      name: "Services",
      href: "/services",
      dropdown: true,
      content: {
        title: "Our Services",
        description:
          "Comprehensive logistics solutions tailored to your business needs",
        items: [
          {
            icon: Plane,
            title: "Air Freight",
            description: "Express worldwide air cargo with real-time tracking",
            href: "/services/#air-freight",
            features: [
              "24/7 Monitoring",
              "Customs Clearance",
              "Real-time Tracking",
            ],
          },
          {
            icon: Ship,
            title: "Sea Freight",
            description: "Cost-effective ocean freight for large shipments",
            href: "/services/#sea-freight",
            features: ["Bulk Capacity", "Global Reach", "Warehousing"],
          },
          {
            icon: Truck,
            title: "Road Freight",
            description: "Reliable ground transportation across continents",
            href: "/services/#road-freight",
            features: ["Door-to-Door", "Flexible Routes", "High Capacity"],
          },
          {
            icon: Train,
            title: "Rail Freight",
            description:
              "Efficient rail solutions for cross-continental transport",
            href: "/services/#rail-freight",
            features: ["High Volume", "Eco-friendly", "Reliable Schedule"],
          },
        ],
      },
    },
    {
      name: "Solutions",
      href: "/solutions",
      dropdown: true,
      content: {
        title: "Industry Solutions",
        description:
          "Tailored logistics solutions for specific industries and technologies",
        items: [
          {
            icon: ShoppingCart,
            title: "E-commerce & Retail",
            description: "End-to-end logistics for online retailers and stores",
            href: "/solutions/#ecommerce-retail",
            features: [
              "Same-day Delivery",
              "Returns Management",
              "Inventory Optimization",
            ],
          },
          {
            icon: Factory,
            title: "Manufacturing",
            description: "Supply chain solutions for industrial production",
            href: "/solutions/#manufacturing",
            features: [
              "Just-in-time Inventory",
              "Quality Control",
              "Lead Time Optimization",
            ],
          },
          {
            icon: Car,
            title: "Automotive",
            description: "Specialized logistics for vehicle manufacturing",
            href: "/solutions/#automotive",
            features: [
              "Parts Distribution",
              "Vehicle Transport",
              "Aftermarket Support",
            ],
          },
          {
            icon: Heart,
            title: "Healthcare & Pharma",
            description: "Temperature-controlled medical logistics",
            href: "/solutions/#healthcare-pharma",
            features: [
              "Cold Chain Logistics",
              "Regulatory Compliance",
              "Emergency Response",
            ],
          },
          {
            icon: Zap,
            title: "AI-Powered Analytics",
            description: "Machine learning for logistics optimization",
            href: "/solutions/#ai-analytics",
            features: [
              "Predictive Analytics",
              "Route Optimization",
              "Cost Analysis",
            ],
          },
          {
            icon: Globe,
            title: "Real-time Tracking",
            description: "Live visibility into your shipments",
            href: "/solutions/#real-time-tracking",
            features: ["GPS Tracking", "Status Updates", "ETA Predictions"],
          },
          {
            icon: Shield,
            title: "Security & Compliance",
            description: "Advanced security and regulatory compliance",
            href: "/solutions/#security-compliance",
            features: [
              "Cargo Insurance",
              "Regulatory Compliance",
              "Security Protocols",
            ],
          },
          {
            icon: Clock,
            title: "Predictive ETA",
            description: "Accurate delivery time predictions",
            href: "/solutions/#predictive-eta",
            features: [
              "ML Algorithms",
              "Real-time Updates",
              "Traffic Analysis",
            ],
          },
          {
            icon: Users,
            title: "Success Stories",
            description: "Real case studies from our clients",
            href: "/solutions/#techcorp-electronics",
            features: [
              "TechCorp Electronics",
              "Global Fashion Retail",
              "PharmaCare Solutions",
            ],
          },
        ],
      },
    },
    {
      name: "Company",
      href: "/about",
      dropdown: true,
      content: {
        title: "About SwiftCargo",
        description: "Your trusted partner in global logistics",
        items: [
          {
            icon: Users,
            title: "Our Team",
            description: "Meet the experts behind our success",
            href: "/about/#david-chen",
            features: ["Industry Veterans", "Global Network", "24/7 Support"],
          },
          {
            icon: Clock,
            title: "Our Story",
            description: "25+ years of logistics excellence",
            href: "/about/#story",
            features: ["Founded 1999", "Global Expansion", "Innovation Focus"],
          },
          {
            icon: Award,
            title: "Awards & Recognition",
            description: "Industry recognition for excellence",
            href: "/about/#awards",
            features: [
              "Logistics Excellence",
              "Innovation Award",
              "Best Air Freight",
            ],
          },
          {
            icon: MapPin,
            title: "Company Timeline",
            description: "Key milestones in our journey",
            href: "/about/#company-founded",
            features: [
              "1999 Founded",
              "2005 Global Expansion",
              "2024 Innovation Hub",
            ],
          },
        ],
      },
    },
    {
      name: "Resources",
      href: "/resources",
      dropdown: true,
      content: {
        title: "Resources & Insights",
        description: "Stay updated with industry trends and best practices",
        items: [
          {
            icon: BarChart3,
            title: "Industry Reports",
            description: "Latest logistics industry insights and market analysis",
            href: "/resources/#reports",
            features: ["Q4 2024 Report", "Supply Chain Resilience", "E-commerce Trends"],
          },
          {
            icon: Users,
            title: "Case Studies",
            description: "Real success stories from our clients across industries",
            href: "/resources/#case-studies",
            features: ["TechCorp Electronics", "Global Fashion Retail", "PharmaCare Solutions"],
          },
          {
            icon: Zap,
            title: "Best Practices",
            description: "Expert tips and proven methodologies for logistics optimization",
            href: "/resources/#best-practices",
            features: ["Inventory Optimization", "Route Optimization", "Supplier Management"],
          },
          {
            icon: Globe,
            title: "Global Insights",
            description: "Regional expertise and market opportunities worldwide",
            href: "/resources/#global-insights",
            features: ["Asia-Pacific", "Europe", "North America", "Africa"],
          },
        ],
      },
    },
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.button
            type="button"
            key="mobile-nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeMobileMenu}
            aria-label="Close menu"
            className="fixed inset-0 z-40 xl:hidden bg-graphite-dark/20 backdrop-blur-[6px] supports-[backdrop-filter]:bg-white/35"
          />
        )}
      </AnimatePresence>

    <header className="fixed top-0 w-full z-50 nav-shell backdrop-blur-md supports-[backdrop-filter]:bg-white/90">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <BrandMark
              name={brandName}
              logoUrl={brand?.logoUrl}
              textClassName="text-xl text-graphite-dark"
            />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center">
            <NavigationMenu className="nav-menu max-w-none">
              <NavigationMenuList className="gap-0.5">
                {navigation.map((item) => {
                  const active = isActive(item.href);
                  return (
                  <NavigationMenuItem key={item.name}>
                    {item.dropdown ? (
                      <NavigationMenuTrigger
                        className={cn(
                          navItemClass(active),
                          "border-0 gap-1"
                        )}
                      >
                        {item.name}
                      </NavigationMenuTrigger>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className={navItemClass(active)}
                          aria-current={active ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      </NavigationMenuLink>
                    )}

                    {item.dropdown && (
                      <NavigationMenuContent>
                        <div className="w-[900px] p-8 bg-white border border-platinum-light shadow-[0_16px_48px_rgba(10,14,20,0.12)] rounded-2xl">
                          <div className="grid grid-cols-3 gap-10">
                            <div className="col-span-1 space-y-6">
                              <div className="space-y-3">
                                <p className="type-eyebrow text-platinum-dark">
                                  {item.name}
                                </p>
                                <h3 className="text-2xl font-bold text-graphite-dark leading-tight">
                                  {item.content.title}
                                </h3>
                                <p className="text-platinum-dark text-sm leading-relaxed">
                                  {item.content.description}
                                </p>
                              </div>
                              <Link
                                href={item.href}
                                className="type-link inline-flex items-center gap-2 group"
                              >
                                View all {item.name}
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                              </Link>
                            </div>

                            <div className="col-span-2 grid grid-cols-2 gap-4">
                              {item.content.items.map((subItem, subIndex) => (
                                <NavigationMenuLink asChild key={subItem.title}>
                                  <Link
                                    href={subItem.href}
                                    className="group block p-5 rounded-xl border border-platinum-light bg-platinum-off/60 hover:bg-[var(--nav-hover)] hover:!text-graphite-dark hover:border-graphite-mid/15 transition-colors no-underline"
                                  >
                                    <IconTile
                                      icon={subItem.icon}
                                      tone={iconToneAt(subIndex)}
                                      size="sm"
                                      className="mb-4"
                                    />
                                    <h4 className="font-semibold text-graphite-dark text-sm mb-1.5">
                                      {subItem.title}
                                    </h4>
                                    <p className="text-platinum-dark text-xs leading-relaxed line-clamp-2">
                                      {subItem.description}
                                    </p>
                                  </Link>
                                </NavigationMenuLink>
                              ))}
                            </div>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    )}
                  </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden xl:flex items-center gap-3">
            <Link href="/login">
              <span className="nav-link inline-flex px-4 py-2 text-sm">
                Sign in
              </span>
            </Link>
            <Link href="/contact">
              <span className="nav-link inline-flex px-4 py-2 text-sm">
                Contact
              </span>
            </Link>
            <Link href="/contact">
              <motion.span
                className="btn-cta btn-cta-sm !py-2 !px-5 inline-flex"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.99 }}
              >
                Get Quote
              </motion.span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="xl:hidden p-2"
            onClick={() => (isMenuOpen ? closeMobileMenu() : setIsMenuOpen(true))}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-graphite-dark" />
            ) : (
              <Menu className="w-6 h-6 text-graphite-dark" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="xl:hidden mt-4 pt-4 border-t border-platinum-light bg-white rounded-xl"
            >
              <div className="space-y-4">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.dropdown ? (
                      <div className="space-y-3">
                        <button
                          type="button"
                          onClick={() => toggleDropdown(item.name)}
                          className={cn(
                            "flex items-center justify-between w-full py-3 px-3 rounded-lg",
                            navItemClass(
                              isActive(item.href),
                              openDropdown === item.name,
                              { block: true }
                            )
                          )}
                        >
                          <span>{item.name}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              openDropdown === item.name ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {openDropdown === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pl-4 space-y-2 border-l border-platinum-light"
                            >
                              <div className="pt-2 pb-2 space-y-1">
                                <h4 className="font-semibold text-graphite-dark text-sm">
                                  {item.content.title}
                                </h4>
                                <p className="text-platinum-dark text-xs leading-relaxed">
                                  {item.content.description}
                                </p>
                              </div>

                              {item.content.items.map((subItem, subIndex) => (
                                <Link
                                  key={subItem.title}
                                  href={subItem.href}
                                  onClick={closeMobileMenu}
                                  className="flex items-start gap-3 py-2.5 pl-2 rounded-lg nav-link"
                                >
                                  <IconTile
                                    icon={subItem.icon}
                                    tone={iconToneAt(subIndex)}
                                    size="sm"
                                    className="!w-9 !h-9 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <h5 className="font-medium text-graphite-dark text-sm">
                                      {subItem.title}
                                    </h5>
                                    <p className="text-platinum-dark text-xs leading-relaxed mt-0.5 line-clamp-2">
                                      {subItem.description}
                                    </p>
                                  </div>
                                </Link>
                              ))}

                              <div className="pt-2 pb-2 pl-2">
                                <Link
                                  href={item.href}
                                  onClick={closeMobileMenu}
                                  className="type-link inline-flex items-center gap-2 text-sm"
                                >
                                  View all {item.name}
                                  <ArrowRight className="w-4 h-4" />
                                </Link>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={navItemClass(isActive(item.href), false, {
                          block: true,
                        })}
                        aria-current={isActive(item.href) ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                
                <div className="pt-4 pb-2 grid gap-2 border-t border-platinum-light">
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="btn-secondary w-full text-center !py-2.5"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/contact"
                    onClick={closeMobileMenu}
                    className="btn-secondary w-full text-center !py-2.5"
                  >
                    Contact
                  </Link>
                  <Link href="/contact" onClick={closeMobileMenu}>
                    <span className="btn-cta btn-cta-sm w-full inline-flex justify-center gap-2">
                      Get Quote
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
    </>
  );
}
