"use client";

import { motion } from "framer-motion";
import { 
  // Building2, 
  ShoppingCart, 
  Car, 
  Heart,
  Factory,
  Globe,
  Zap,
  ArrowRight,
  Check,
  Users,
  TrendingUp,
  Shield,
  Clock
} from "lucide-react";

export default function SolutionsPage() {
  const industrySolutions = [
    {
      icon: ShoppingCart,
      title: "E-commerce & Retail",
      description: "End-to-end logistics solutions for online retailers and brick-and-mortar stores",
      challenges: [
        "Same-day delivery expectations",
        "Returns management complexity",
        "Seasonal demand fluctuations",
        "Inventory optimization"
      ],
      solutions: [
        "Fulfillment center network",
        "Last-mile delivery optimization",
        "Returns processing automation",
        "Demand forecasting"
      ],
      benefits: [
        "30% faster delivery times",
        "25% reduction in shipping costs",
        "Improved customer satisfaction",
        "Scalable operations"
      ]
    },
    {
      icon: Factory,
      title: "Manufacturing",
      description: "Supply chain solutions for manufacturing operations and industrial production",
      challenges: [
        "Just-in-time inventory management",
        "Component sourcing complexity",
        "Quality control requirements",
        "Lead time optimization"
      ],
      solutions: [
        "Supplier network management",
        "Quality assurance protocols",
        "Lead time optimization",
        "Inventory forecasting"
      ],
      benefits: [
        "40% reduction in lead times",
        "Improved supplier relationships",
        "Enhanced quality control",
        "Cost optimization"
      ]
    },
    {
      icon: Car,
      title: "Automotive",
      description: "Specialized logistics for automotive industry and vehicle manufacturing",
      challenges: [
        "Parts distribution complexity",
        "Vehicle transport logistics",
        "Aftermarket support",
        "Regulatory compliance"
      ],
      solutions: [
        "Parts distribution network",
        "Vehicle transport solutions",
        "Aftermarket logistics",
        "Compliance management"
      ],
      benefits: [
        "Streamlined parts distribution",
        "Efficient vehicle transport",
        "Enhanced aftermarket support",
        "Regulatory compliance"
      ]
    },
    {
      icon: Heart,
      title: "Healthcare & Pharma",
      description: "Temperature-controlled logistics for medical and pharmaceutical products",
      challenges: [
        "Temperature control requirements",
        "Regulatory compliance",
        "Emergency shipping needs",
        "Product integrity"
      ],
      solutions: [
        "Cold chain logistics",
        "Regulatory compliance",
        "Emergency response",
        "Quality monitoring"
      ],
      benefits: [
        "Maintained product integrity",
        "Regulatory compliance",
        "Emergency response capability",
        "Quality assurance"
      ]
    }
  ];

  const technologySolutions = [
    {
      icon: Zap,
      title: "AI-Powered Analytics",
      description: "Machine learning algorithms that predict demand, optimize routes, and identify cost-saving opportunities",
      features: ["Predictive analytics", "Route optimization", "Cost analysis", "Performance insights"]
    },
    {
      icon: Globe,
      title: "Real-time Tracking",
      description: "Live visibility into your shipments with GPS tracking and status updates",
      features: ["GPS tracking", "Status updates", "ETA predictions", "Exception alerts"]
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Advanced security measures and regulatory compliance monitoring",
      features: ["Cargo insurance", "Regulatory compliance", "Security protocols", "Risk management"]
    },
    {
      icon: Clock,
      title: "Predictive ETA",
      description: "Accurate delivery time predictions using machine learning algorithms",
      features: ["ML algorithms", "Real-time updates", "Traffic analysis", "Weather integration"]
    }
  ];

  const caseStudies = [
    {
      company: "TechCorp Electronics",
      industry: "Electronics Manufacturing",
      challenge: "Managing complex supply chains across 15 countries with varying customs regulations",
      solution: "Implemented SwiftCargo's global logistics platform with customs clearance automation",
      results: [
        "45% reduction in customs clearance time",
        "30% decrease in shipping costs",
        "Improved delivery reliability to 99.2%"
      ]
    },
    {
      company: "Global Fashion Retail",
      industry: "Fashion & Apparel",
      challenge: "Meeting same-day delivery expectations while managing seasonal inventory fluctuations",
      solution: "Deployed SwiftCargo's fulfillment network with AI-powered demand forecasting",
      results: [
        "Same-day delivery achieved in 95% of cases",
        "25% reduction in inventory holding costs",
        "Customer satisfaction increased to 98%"
      ]
    },
    {
      company: "PharmaCare Solutions",
      industry: "Pharmaceuticals",
      challenge: "Maintaining temperature-controlled logistics for sensitive medical products",
      solution: "Implemented SwiftCargo's cold chain logistics with real-time monitoring",
      results: [
        "100% temperature compliance maintained",
        "Zero product integrity issues",
        "Regulatory compliance achieved"
      ]
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
              Industry{" "}
              <span className="text-gradient">Solutions</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Tailored logistics solutions designed specifically for your industry&apos;s unique 
              requirements and challenges. We understand your business and deliver results.
            </p>
          </motion.div>
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
              Industry-Specific{" "}
              <span className="text-gradient">Solutions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every industry has unique logistics challenges. Our specialized solutions 
              address your specific needs and drive measurable results.
            </p>
          </motion.div>

          <div className="space-y-16">
            {industrySolutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >
                <div>
                  <div className="w-20 h-20 bg-gradient rounded-2xl flex items-center justify-center mb-6">
                    <solution.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-3xl font-display font-bold mb-4">{solution.title}</h3>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {solution.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-red-600">Challenges</h4>
                      <ul className="space-y-2">
                        {solution.challenges.map((challenge) => (
                          <li key={challenge} className="text-sm text-muted-foreground flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600">Our Solutions</h4>
                      <ul className="space-y-2">
                        {solution.solutions.map((sol) => (
                          <li key={sol} className="text-sm text-muted-foreground flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{sol}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-3 text-blue-600">Expected Benefits</h4>
                    <ul className="space-y-2">
                      {solution.benefits.map((benefit) => (
                        <li key={benefit} className="text-sm text-muted-foreground flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-border/50">
                  <h4 className="font-semibold mb-4 text-center">Solution Overview</h4>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-border/50">
                      <div className="flex items-center space-x-3 mb-2">
                        <Users className="w-5 h-5 text-primary" />
                        <span className="font-medium">Team Support</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Dedicated account managers and 24/7 support for your industry-specific needs
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-border/50">
                      <div className="flex items-center space-x-3 mb-2">
                        <Shield className="w-5 h-5 text-primary" />
                        <span className="font-medium">Compliance</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Industry-specific regulatory compliance and documentation management
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-border/50">
                      <div className="flex items-center space-x-3 mb-2">
                        <Zap className="w-5 h-5 text-primary" />
                        <span className="font-medium">Technology</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Customized technology solutions tailored to your industry requirements
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Solutions */}
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
              Technology{" "}
              <span className="text-gradient">Solutions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our cutting-edge technology platform provides the tools you need to optimize 
              your logistics operations and stay ahead of the competition.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technologySolutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-border/50 hover:shadow-glow hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <solution.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {solution.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {solution.description}
                </p>
                
                <ul className="space-y-2">
                  {solution.features.map((feature) => (
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

      {/* Case Studies */}
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
              Success{" "}
              <span className="text-gradient">Stories</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how our industry-specific solutions have transformed logistics operations 
              for businesses across different sectors.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.company}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-border/50 hover:shadow-glow hover:-translate-y-2 transition-all duration-300"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">{study.company}</h3>
                  <p className="text-primary font-medium">{study.industry}</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-red-600">Challenge</h4>
                    <p className="text-sm text-muted-foreground">{study.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-600">Solution</h4>
                    <p className="text-sm text-muted-foreground">{study.solution}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">Results</h4>
                  <ul className="space-y-2">
                    {study.results.map((result) => (
                      <li key={result} className="text-sm text-muted-foreground flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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
              Ready to Optimize Your{" "}
              <span className="text-gradient">Industry Logistics?</span>
            </h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Let our industry experts analyze your current operations and design a 
              customized solution that addresses your specific challenges and goals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-gradient text-white rounded-lg font-semibold text-lg shadow-glow-orange flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Industry Analysis</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                className="px-8 py-4 border-2 border-white/30 text-white rounded-lg font-semibold text-lg backdrop-blur-custom hover:bg-white/10 transition-all"
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
