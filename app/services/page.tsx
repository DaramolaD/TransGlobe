"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plane, 
  Ship, 
  Truck, 
  Train,
  Package,
  Check,
  ArrowRight,
  Clock,
  MapPin,
  Shield,
  Zap,
  Globe,
  DollarSign,
  Calculator,
  Search,
  Users,
  Award
} from "lucide-react";

export default function ServicesPage() {
  // Smooth scroll to anchor on page load if hash exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
          // Update URL without hash
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    }
  }, []);
  const services = [
    {
      id: "air-freight",
      icon: Plane,
      title: "Air Freight",
      description: "Express worldwide air cargo services with real-time tracking and customs clearance.",
      features: [
        "24/7 Monitoring & Support",
        "Customs Clearance",
        "Real-time Tracking",
        "Insurance Coverage",
        "Express & Standard Options",
        "Temperature Control Available"
      ],
      deliveryTime: "2-5 days",
      bestFor: "Urgent shipments, high-value items, perishable goods",
      startingPrice: "$15/kg",
      coverage: "Global coverage to 150+ countries"
    },
    {
      id: "sea-freight",
      icon: Ship,
      title: "Sea Freight",
      description: "Cost-effective ocean freight solutions for large shipments and bulk cargo.",
      features: [
        "FCL & LCL Options",
        "Bulk Cargo Handling",
        "Warehousing Services",
        "Port-to-Port & Door-to-Door",
        "Container Tracking",
        "Cost-effective for large volumes"
      ],
      deliveryTime: "15-30 days",
      bestFor: "Large shipments, bulk cargo, non-urgent items",
      startingPrice: "$3/kg",
      coverage: "Major ports worldwide"
    },
    {
      id: "road-freight",
      icon: Truck,
      title: "Road Freight",
      description: "Reliable ground transportation with door-to-door delivery across continents.",
      features: [
        "Door-to-Door Service",
        "Flexible Route Planning",
        "High Capacity Options",
        "Regional & Cross-border",
        "Real-time GPS Tracking",
        "Multiple Vehicle Types"
      ],
      deliveryTime: "3-7 days",
      bestFor: "Regional shipments, cross-border trade, heavy equipment",
      startingPrice: "$8/kg",
      coverage: "North America, Europe, Asia"
    },
    {
      id: "rail-freight",
      icon: Train,
      title: "Rail Freight",
      description: "Efficient rail solutions for cross-continental and regional cargo transport.",
      features: [
        "High Volume Capacity",
        "Eco-friendly Transport",
        "Reliable Schedules",
        "Cost-effective Long Distance",
        "Bulk Cargo Specialized",
        "Intermodal Solutions"
      ],
      deliveryTime: "5-10 days",
      bestFor: "Bulk cargo, long-distance shipments, eco-conscious clients",
      startingPrice: "$5/kg",
      coverage: "Major rail networks globally"
    }
  ];

  const additionalServices = [
    {
      id: "warehousing",
      icon: Package,
      title: "Warehousing & Distribution",
      description: "Strategic warehousing solutions with inventory management and order fulfillment.",
      features: ["Strategic Locations", "Inventory Management", "Order Fulfillment", "Cross-docking"]
    },
    {
      id: "cargo-insurance",
      icon: Shield,
      title: "Cargo Insurance",
      description: "Comprehensive insurance coverage for all types of cargo and shipments.",
      features: ["All-risk Coverage", "Custom Policies", "Fast Claims Processing", "24/7 Support"]
    },
    {
      id: "customs-clearance",
      icon: Calculator,
      title: "Customs Clearance",
      description: "Expert customs clearance services to ensure smooth international shipments.",
      features: ["Document Preparation", "Regulatory Compliance", "Duty Calculation", "Fast Processing"]
    },
    {
      id: "real-time-tracking",
      icon: Search,
      title: "Real-time Tracking",
      description: "Advanced tracking system providing complete visibility of your shipments.",
      features: ["GPS Tracking", "Status Updates", "Mobile App", "Email Notifications"]
    }
  ];

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
        >
            <h1 className="text-5xl lg:text-7xl font-display font-bold mb-6">
            Our{" "}
            <span className="text-gradient">Services</span>
          </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              From air freight to sea cargo, we provide comprehensive logistics solutions 
              tailored to your business needs. Discover how we can help you reach customers worldwide.
          </p>
        </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
              <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Core{" "}
              <span className="text-gradient">Logistics Services</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive suite of logistics services covers every aspect of global 
              shipping, from express air freight to cost-effective sea cargo solutions.
            </p>
              </motion.div>

          <div className="space-y-12">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                id={service.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-border/50 hover:shadow-glow transition-all duration-300"
              >
                <div className="flex flex-wrap items-start gap-8">
                  {/* Service Icon & Title */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="w-20 h-20 bg-gradient rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6">
                    <service.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-display font-bold mb-4">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  
                  {/* Service Details */}
                  <div className="flex-1 pt-10 space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                        <div>
                          <div className="font-semibold">Delivery Time</div>
                          <div className="text-sm text-muted-foreground">{service.deliveryTime}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-primary flex-shrink-0" />
                        <div>
                          <div className="font-semibold">Starting Price</div>
                          <div className="text-sm text-muted-foreground">{service.startingPrice}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                        <div>
                          <div className="font-semibold">Coverage</div>
                          <div className="text-sm text-muted-foreground">{service.coverage}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Package className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                          <div className="font-semibold">Best For</div>
                          <div className="text-sm text-muted-foreground">{service.bestFor}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex-1 pt-10">
                    <h4 className="font-semibold mb-4">Key Features</h4>
                      <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center space-x-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                {/* CTA Button */}
                <div className="mt-8 pt-8 border-t border-border/50 text-center">
                  <motion.button
                    className="px-8 py-3 bg-gradient text-white rounded-lg font-semibold shadow-glow hover:shadow-glow-orange transition-all duration-300 hover:scale-105"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Quote for {service.title}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Additional{" "}
              <span className="text-gradient">Services</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Beyond core logistics, we offer specialized services to enhance your 
              shipping experience and ensure complete supply chain solutions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <motion.div
                key={service.title}
                id={service.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-glow hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-white" />
                </div>

                  <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                  <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                  
                  <button className="text-primary hover:text-primary/80 font-medium flex items-center space-x-2 group-hover:translate-x-1 transition-all">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
                      </div>
                    </div>
      </section>

      {/* Service Comparison */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
                  <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Service{" "}
              <span className="text-gradient">Comparison</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Compare our different service options to find the perfect solution 
              for your shipping needs and budget.
            </p>
              </motion.div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 font-semibold">Service Type</th>
                    <th className="text-center p-4 font-semibold">Delivery Time</th>
                    <th className="text-center p-4 font-semibold">Starting Price</th>
                    <th className="text-center p-4 font-semibold">Best For</th>
                    <th className="text-center p-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.title} id={`${service.id}-comparison`} className="border-b border-border/30 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 !m-0 bg-gradient rounded-lg flex items-center justify-center">
                            <service.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold">{service.title}</div>
                            <div className="text-sm text-muted-foreground">{service.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-4">
                        <div className="font-semibold">{service.deliveryTime}</div>
                      </td>
                      <td className="text-center p-4">
                        <div className="font-semibold text-primary">{service.startingPrice}</div>
                      </td>
                      <td className="text-center p-4">
                        <div className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                          {service.bestFor}
                        </div>
                      </td>
                      <td className="text-center p-4">
                        <motion.button
                          className="px-4 py-2 bg-gradient text-white rounded-lg text-sm font-medium shadow-glow hover:shadow-glow-orange transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Get Quote
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
                  </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Why Choose Our{" "}
              <span className="text-gradient">Services?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We combine decades of experience with cutting-edge technology to deliver 
              logistics services that exceed your expectations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Proven Excellence",
                description: "25+ years of delivering exceptional logistics services with a 99.8% success rate."
              },
              {
                icon: Globe,
                title: "Global Network",
                description: "150+ countries served with local expertise and compliance knowledge."
              },
              {
                icon: Shield,
                title: "Complete Security",
                description: "Advanced tracking, insurance coverage, and secure handling protocols."
              },
              {
                icon: Zap,
                title: "Technology First",
                description: "AI-powered optimization, real-time tracking, and mobile-first solutions."
              },
              {
                icon: Users,
                title: "Expert Support",
                description: "24/7 customer support with dedicated specialists for every service."
              },
              {
                icon: Check,
                title: "Quality Guaranteed",
                description: "Comprehensive quality assurance and continuous improvement processes."
              }
            ].map((feature, index) => (
                    <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-border/50 hover:shadow-glow hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                        </div>
                
                <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
                            ))}
                          </div>
                        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl lg:text-6xl font-display font-bold mb-6">
              Ready to Get{" "}
              <span className="text-gradient">Started?</span>
            </h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Get a free quote for any of our services and discover how SwiftCargo 
              can transform your logistics operations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-gradient text-white rounded-lg font-semibold text-lg shadow-glow-orange flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Free Quote</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                className="px-8 py-4 border-2 border-white/30 text-white rounded-lg font-semibold text-lg backdrop-blur-custom hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Speak to Expert
              </motion.button>
                </div>
              </motion.div>
        </div>
      </section>
    </div>
  );
}
