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
  Award
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

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const navigation = [
    { 
      name: "Home", 
      href: "/",
      simple: true
    },
    { 
      name: "Services", 
      href: "/services",
      dropdown: true,
      content: {
        title: "Our Services",
        description: "Comprehensive logistics solutions tailored to your business needs",
        items: [
          {
            icon: Plane,
            title: "Air Freight",
            description: "Express worldwide air cargo with real-time tracking",
            href: "/services/air-freight",
            features: ["24/7 Monitoring", "Customs Clearance", "Real-time Tracking"]
          },
          {
            icon: Ship,
            title: "Sea Freight",
            description: "Cost-effective ocean freight for large shipments",
            href: "/services/sea-freight",
            features: ["Bulk Capacity", "Global Reach", "Warehousing"]
          },
          {
            icon: Truck,
            title: "Road Freight",
            description: "Reliable ground transportation across continents",
            href: "/services/road-freight",
            features: ["Door-to-Door", "Flexible Routes", "High Capacity"]
          },
          {
            icon: Train,
            title: "Rail Freight",
            description: "Efficient rail solutions for cross-continental transport",
            href: "/services/rail-freight",
            features: ["High Volume", "Eco-friendly", "Reliable Schedule"]
          }
        ]
      }
    },
    { 
      name: "Solutions", 
      href: "/solutions",
      dropdown: true,
      content: {
        title: "Business Solutions",
        description: "Innovative logistics solutions for modern businesses",
        items: [
          {
            icon: Globe,
            title: "Global Supply Chain",
            description: "End-to-end supply chain management worldwide",
            href: "/solutions/supply-chain",
            features: ["Multi-modal", "Real-time Visibility", "Risk Management"]
          },
          {
            icon: BarChart3,
            title: "Analytics & Insights",
            description: "Data-driven logistics optimization",
            href: "/solutions/analytics",
            features: ["Performance Metrics", "Predictive Analytics", "Cost Optimization"]
          },
          {
            icon: Shield,
            title: "Risk Management",
            description: "Comprehensive risk mitigation strategies",
            href: "/solutions/risk-management",
            features: ["Insurance Coverage", "Compliance", "Contingency Planning"]
          },
          {
            icon: Users,
            title: "Enterprise Solutions",
            description: "Custom solutions for large organizations",
            href: "/solutions/enterprise",
            features: ["Dedicated Teams", "Custom Integration", "Priority Support"]
          }
        ]
      }
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
            href: "/about/team",
            features: ["Industry Veterans", "Global Network", "24/7 Support"]
          },
          {
            icon: Award,
            title: "Our Story",
            description: "25+ years of logistics excellence",
            href: "/about/story",
            features: ["Founded 1999", "Global Expansion", "Innovation Focus"]
          },
          {
            icon: MapPin,
            title: "Global Presence",
            description: "Serving 150+ countries worldwide",
            href: "/about/global-presence",
            features: ["150+ Countries", "Local Expertise", "Cultural Understanding"]
          },
          {
            icon: Clock,
            title: "Timeline",
            description: "Key milestones in our journey",
            href: "/about/timeline",
            features: ["1999 Founded", "2005 Global Expansion", "2024 Innovation Hub"]
          }
        ]
      }
    },
    { 
      name: "Resources", 
      href: "/blog",
      dropdown: true,
      content: {
        title: "Resources & Insights",
        description: "Stay updated with industry trends and best practices",
        items: [
          {
            icon: BarChart3,
            title: "Industry Reports",
            description: "Latest logistics industry insights",
            href: "/resources/reports",
            features: ["Quarterly Updates", "Market Analysis", "Trend Reports"]
          },
          {
            icon: Users,
            title: "Case Studies",
            description: "Real success stories from our clients",
            href: "/resources/case-studies",
            features: ["Client Success", "Problem Solving", "Results Driven"]
          },
          {
            icon: Zap,
            title: "Best Practices",
            description: "Expert tips for logistics optimization",
            href: "/resources/best-practices",
            features: ["Efficiency Tips", "Cost Savings", "Risk Mitigation"]
          },
          {
            icon: Globe,
            title: "Global Insights",
            description: "Regional logistics expertise and trends",
            href: "/resources/global-insights",
            features: ["Regional Focus", "Cultural Context", "Local Expertise"]
          }
        ]
      }
    },
    { 
      name: "Contact", 
      href: "/contact",
      simple: true
    }
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-custom border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-10 h-10 bg-gradient rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-display font-bold text-gradient">SwiftCargo</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="space-x-1">
            {navigation.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    {item.dropdown ? (
                      <NavigationMenuTrigger className="bg-transparent hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 data-[state=open]:bg-gradient-to-r data-[state=open]:from-primary/10 data-[state=open]:to-primary/5 border-none shadow-none px-4 py-2 h-auto text-foreground/80 hover:text-foreground data-[state=open]:text-foreground rounded-lg transition-all duration-300 hover:scale-105">
                        {item.name}
                      </NavigationMenuTrigger>
                    ) : (
                      <NavigationMenuLink asChild>
              <Link
                href={item.href}
                          className={`block px-4 py-2 text-foreground/80 hover:text-foreground transition-all duration-300 font-medium rounded-lg hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:scale-105 ${
                            isActive(item.href) ? "text-primary bg-gradient-to-r from-primary/10 to-primary/5" : ""
                }`}
              >
                {item.name}
              </Link>
                      </NavigationMenuLink>
                    )}
                    
                    {item.dropdown && (
                      <NavigationMenuContent>
                        <div className="w-[900px] p-8 bg-white/95 backdrop-blur-xl border border-border/20 shadow-2xl rounded-2xl">
                          <div className="grid grid-cols-3 gap-10">
                            {/* Left Column - Title and Description */}
                            <div className="col-span-1 space-y-6">
                              <div className="space-y-4">
                                <h3 className="text-3xl font-bold text-foreground leading-tight">
                                  {item.content.title}
                                </h3>
                                <p className="text-muted-foreground text-base leading-relaxed">
                                  {item.content.description}
                                </p>
                              </div>
                              <div className="pt-4">
                                <Link 
                                  href={item.href}
                                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm transition-colors group"
                                >
                                  <span className="mr-2">View All {item.name}</span>
                                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                              </div>
                            </div>
                            
                            {/* Right Column - Service Items */}
                            <div className="col-span-2 grid grid-cols-2 gap-6">
                              {item.content.items.map((subItem) => (
                                <NavigationMenuLink asChild key={subItem.title}>
                                  <Link
                                    href={subItem.href}
                                    className="group p-6 rounded-xl bg-gradient-to-br from-white/50 to-white/20 hover:from-white/80 hover:to-white/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-white/30 hover:border-primary/20 backdrop-blur-sm"
                                  >
                                    <div className="space-y-4">
                                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110">
                                        <subItem.icon className="w-6 h-6 text-primary group-hover:text-primary/80 transition-colors" />
                                      </div>
                                      <div className="space-y-3">
                                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors text-base">
                                          {subItem.title}
                                        </h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground/80 transition-colors">
                                          {subItem.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                          {subItem.features.slice(0, 2).map((feature) => (
                                            <span
                                              key={feature}
                                              className="inline-block px-3 py-1.5 bg-gradient-to-r from-primary/10 to-primary/20 text-primary/80 group-hover:from-primary/20 group-hover:to-primary/30 group-hover:text-primary transition-all duration-300 text-xs rounded-lg font-medium border border-primary/10 group-hover:border-primary/20"
                                            >
                                              {feature}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                </NavigationMenuLink>
                              ))}
                            </div>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/contact">
              <motion.button
                className="px-6 py-2 text-foreground hover:text-primary transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.button>
            </Link>
            <Link href="/contact">
              <motion.button
                className="px-6 py-2 bg-gradient text-white rounded-lg font-medium shadow-glow"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Quote
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
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
              className="md:hidden mt-4 pt-4 border-t border-border/50"
            >
              <div className="space-y-4">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.dropdown ? (
                      <div className="space-y-3">
                        <button
                          onClick={() => toggleDropdown(item.name)}
                          className="flex items-center justify-between w-full py-3 px-3 font-medium text-foreground/80 hover:text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 transition-all duration-300 rounded-lg"
                        >
                          <span>{item.name}</span>
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform duration-200 ${
                              openDropdown === item.name ? 'rotate-180' : ''
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
                              className="pl-4 space-y-3 border-l border-border/30"
                            >
                              {/* Mobile Dropdown Header */}
                              <div className="pt-2 pb-3 space-y-2">
                                <h4 className="font-semibold text-foreground text-sm">
                                  {item.content.title}
                                </h4>
                                <p className="text-muted-foreground text-xs leading-relaxed">
                                  {item.content.description}
                                </p>
                              </div>
                              
                              {/* Mobile Dropdown Items */}
                              {item.content.items.map((subItem) => (
                                <Link
                                  key={subItem.title}
                                  href={subItem.href}
                                  onClick={() => {
                                    setIsMenuOpen(false);
                                    setOpenDropdown(null);
                                  }}
                                  className="block py-3 pl-4 space-y-2 group rounded-lg hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 transition-all duration-300"
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300">
                                      <subItem.icon className="w-4 h-4 text-primary group-hover:text-primary/80 transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">
                                        {subItem.title}
                                      </h5>
                                      <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                                        {subItem.description}
                                      </p>
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {subItem.features.slice(0, 2).map((feature) => (
                                                                                  <span
                                          key={feature}
                                          className="inline-block px-2 py-1 bg-gradient-to-r from-primary/10 to-primary/20 text-primary/80 text-xs rounded-md border border-primary/10"
                                        >
                                            {feature}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                              
                              {/* Mobile View All Link */}
                              <div className="pt-2 pb-3 pl-4">
                                <Link 
                                  href={item.href}
                                  onClick={() => {
                                    setIsMenuOpen(false);
                                    setOpenDropdown(null);
                                  }}
                                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                                >
                                  View All {item.name}
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                        className={`block py-3 transition-colors font-medium ${
                      isActive(item.href)
                        ? "text-primary"
                        : "text-foreground/80 hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                    )}
                  </div>
                ))}
                
                <div className="pt-6 space-y-3 border-t border-border/30">
                  <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                    <motion.button
                      className="w-full px-6 py-3 text-foreground hover:text-primary transition-colors font-medium border border-border/50 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Contact Us
                    </motion.button>
                  </Link>
                  <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                    <motion.button
                      className="w-full px-6 py-3 bg-gradient text-white rounded-lg font-medium shadow-glow flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Get Quote</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
