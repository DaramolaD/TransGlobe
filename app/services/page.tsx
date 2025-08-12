"use client";

import { motion } from "framer-motion";
import { 
  Truck, 
  Plane,
  Ship,
  Train,
  Package,
  ArrowRight,
  Check,
  Globe,
  Clock,
  Shield,
  Zap,
  Target,
  Users,
  BarChart3,
  MapPin,
  Cpu,
  Leaf
} from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      icon: Plane,
      title: "Air Freight",
      subtitle: "Express Worldwide Cargo",
      description: "Fast, reliable air freight solutions for time-sensitive shipments with global coverage and real-time tracking.",
      features: [
        "24/7 Monitoring & Support",
        "Customs Clearance",
        "Real-time Tracking",
        "Insurance Coverage",
        "Express & Standard Options",
        "Temperature Controlled"
      ],
      benefits: [
        "Fastest delivery times (1-3 days)",
        "Global network coverage",
        "Priority handling",
        "Flexible scheduling"
      ],
      useCases: [
        "High-value electronics",
        "Pharmaceuticals",
        "Fashion & apparel",
        "Automotive parts",
        "Emergency shipments"
      ]
    },
    {
      icon: Ship,
      title: "Sea Freight",
      subtitle: "Cost-Effective Ocean Solutions",
      description: "Efficient ocean freight services for large shipments and bulk cargo with comprehensive logistics support.",
      features: [
        "FCL & LCL Options",
        "Bulk Cargo Handling",
        "Global Port Network",
        "Warehousing Services",
        "Customs Documentation",
        "Cargo Insurance"
      ],
      benefits: [
        "Most cost-effective option",
        "High capacity for large shipments",
        "Eco-friendly transportation",
        "Reliable scheduling"
      ],
      useCases: [
        "Industrial machinery",
        "Raw materials",
        "Consumer goods",
        "Automotive vehicles",
        "Construction materials"
      ]
    },
    {
      icon: Truck,
      title: "Road Freight",
      subtitle: "Reliable Ground Transportation",
      description: "Comprehensive road freight solutions with door-to-door delivery across continents and regional coverage.",
      features: [
        "Door-to-Door Delivery",
        "Flexible Route Planning",
        "High Capacity Trucks",
        "Regional Coverage",
        "Real-time GPS Tracking",
        "Temperature Control"
      ],
      benefits: [
        "Flexible scheduling",
        "Cost-effective for regional shipments",
        "Door-to-door service",
        "Real-time visibility"
      ],
      useCases: [
        "Regional distribution",
        "Cross-border shipping",
        "Last-mile delivery",
        "Heavy equipment",
        "Perishable goods"
      ]
    },
    {
      icon: Train,
      title: "Rail Freight",
      subtitle: "Efficient Rail Solutions",
      description: "Sustainable rail freight services for cross-continental and regional cargo transport with high capacity.",
      features: [
        "High Volume Capacity",
        "Eco-friendly Transport",
        "Reliable Scheduling",
        "Cross-continental Routes",
        "Bulk Cargo Handling",
        "Cost-effective Pricing"
      ],
      benefits: [
        "High volume capacity",
        "Eco-friendly option",
        "Reliable scheduling",
        "Cost-effective for long distances"
      ],
      useCases: [
        "Bulk commodities",
        "Industrial products",
        "Cross-continental shipments",
        "Heavy machinery",
        "Raw materials"
      ]
    }
  ];

  const additionalServices = [
    {
      icon: Package,
      title: "Warehousing & Distribution",
      description: "Strategic warehousing solutions with inventory management and efficient distribution networks.",
      features: ["Inventory Management", "Order Fulfillment", "Cross-docking", "Value-added Services"]
    },
    {
      icon: Shield,
      title: "Customs Clearance",
      description: "Expert customs documentation and clearance services to ensure smooth international trade.",
      features: ["Documentation", "Regulatory Compliance", "Duty Calculation", "Risk Management"]
    },
    {
      icon: Cpu,
      title: "Technology Solutions",
      description: "AI-powered logistics platform with real-time tracking and predictive analytics.",
      features: ["Real-time Tracking", "Predictive Analytics", "API Integration", "Mobile Apps"]
    },
    {
      icon: Leaf,
      title: "Sustainable Logistics",
      description: "Eco-friendly shipping options and carbon-neutral solutions for environmentally conscious businesses.",
      features: ["Carbon Neutral", "Eco-friendly Routes", "Green Packaging", "Sustainability Reporting"]
    }
  ];

  const industries = [
    {
      name: "E-commerce",
      description: "End-to-end logistics solutions for online retailers",
      services: ["Fulfillment", "Last-mile Delivery", "Returns Management", "Inventory Optimization"]
    },
    {
      name: "Manufacturing",
      description: "Supply chain solutions for manufacturing operations",
      services: ["Raw Materials", "Component Shipping", "Finished Goods", "Just-in-Time Delivery"]
    },
    {
      name: "Healthcare",
      description: "Specialized logistics for medical and pharmaceutical products",
      services: ["Temperature Control", "Regulatory Compliance", "Emergency Shipping", "Cold Chain"]
    },
    {
      name: "Automotive",
      description: "Logistics solutions for automotive industry",
      services: ["Parts Distribution", "Vehicle Transport", "Just-in-Sequence", "Aftermarket Support"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
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
              Comprehensive logistics solutions designed to meet your business needs. 
              From air freight to sea cargo, we provide end-to-end services with 
              cutting-edge technology and global expertise.
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
              Our comprehensive suite of logistics services covers every aspect of your supply chain, 
              from initial planning to final delivery.
            </p>
              </motion.div>

          <div className="space-y-16">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="w-20 h-20 bg-gradient rounded-2xl flex items-center justify-center mb-6">
                    <service.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-3xl font-display font-bold mb-2">{service.title}</h3>
                  <p className="text-xl text-primary font-medium mb-4">{service.subtitle}</p>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center space-x-2">
                        <Check className="w-5 h-5 text-green-500" />
                        <span>Key Features</span>
                      </h4>
                      <ul className="space-y-2">
                        {service.features.slice(0, 3).map((feature) => (
                          <li key={feature} className="text-sm text-muted-foreground flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center space-x-2">
                        <Target className="w-5 h-5 text-blue-500" />
                        <span>Benefits</span>
                      </h4>
                      <ul className="space-y-2">
                        {service.benefits.map((benefit) => (
                          <li key={benefit} className="text-sm text-muted-foreground flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <motion.button
                    className="px-6 py-3 bg-gradient text-white rounded-lg font-semibold shadow-glow flex items-center space-x-2"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                      </div>

                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-border/50">
                    <h4 className="font-semibold mb-4 flex items-center space-x-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span>Ideal For</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {service.useCases.map((useCase) => (
                        <div key={useCase} className="bg-white rounded-lg p-3 text-sm text-center border border-border/50">
                          {useCase}
                      </div>
                      ))}
                    </div>
                  </div>
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
              Beyond our core logistics services, we offer specialized solutions to enhance 
              your supply chain operations and business efficiency.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-border/50 hover:shadow-glow hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="text-sm text-muted-foreground flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
                      </div>
                    </div>
      </section>

      {/* Industry Solutions */}
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
              Industry{" "}
              <span className="text-gradient">Solutions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tailored logistics solutions designed specifically for your industry's unique 
              requirements and challenges.
            </p>
              </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-border/50 hover:shadow-glow hover:-translate-y-2 transition-all duration-300 group"
              >
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {industry.name}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {industry.description}
                </p>
                
                <ul className="space-y-2">
                  {industry.services.map((service) => (
                    <li key={service} className="text-sm text-muted-foreground flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
                  </div>
      </section>

      {/* Technology Features */}
      <section className="py-20 bg-gradient-dark text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Powered by{" "}
              <span className="text-gradient">Technology</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Our advanced technology platform provides real-time visibility, predictive analytics, 
              and seamless integration with your existing systems.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Cpu,
                title: "AI-Powered Analytics",
                description: "Predictive insights and optimization recommendations for your supply chain"
              },
              {
                icon: Globe,
                title: "Real-time Tracking",
                description: "Live visibility into your shipments with GPS tracking and status updates"
              },
              {
                icon: BarChart3,
                title: "Performance Metrics",
                description: "Comprehensive reporting and analytics to measure and improve performance"
              },
              {
                icon: MapPin,
                title: "Route Optimization",
                description: "Intelligent route planning to reduce costs and improve delivery times"
              },
              {
                icon: Clock,
                title: "Predictive ETA",
                description: "Accurate delivery time predictions using machine learning algorithms"
              },
              {
                icon: Shield,
                title: "Security & Compliance",
                description: "Advanced security measures and regulatory compliance monitoring"
              }
            ].map((feature, index) => (
                    <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-10 h-10 text-gradient" />
                        </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
                            ))}
                          </div>
                        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl lg:text-6xl font-display font-bold mb-6">
              Ready to Optimize Your{" "}
              <span className="text-gradient">Logistics?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Let our experts analyze your current logistics operations and design a 
              customized solution that drives efficiency and reduces costs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-gradient text-white rounded-lg font-semibold text-lg shadow-glow-orange flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Custom Quote</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                className="px-8 py-4 border-2 border-primary/30 text-primary rounded-lg font-semibold text-lg bg-white hover:bg-primary hover:text-white transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule Consultation
              </motion.button>
                </div>
              </motion.div>
        </div>
      </section>
    </div>
  );
}
