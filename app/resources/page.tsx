"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  BarChart3, 
  Users, 
  Globe, 
  Download, 
  ArrowRight,
  TrendingUp,
  BookOpen,
  Lightbulb,
  CheckCircle,
  MapPin,
  Clock,
  Star,
  ExternalLink
} from "lucide-react";

export default function ResourcesPage() {
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

  const industryReports = [
    {
      id: "q4-2024-logistics",
      title: "Q4 2024 Global Logistics Market Report",
      description: "Comprehensive analysis of Q4 2024 logistics trends, market performance, and future outlook",
      date: "January 2025",
      category: "Market Analysis",
      downloadUrl: "#",
      keyInsights: [
        "Global shipping volumes increased by 8.5% compared to Q3",
        "Air freight rates stabilized after seasonal fluctuations",
        "E-commerce logistics demand continues strong growth",
        "Sustainability initiatives driving industry transformation"
      ],
      highlights: ["Market Trends", "Performance Metrics", "Future Forecast", "Regional Analysis"]
    },
    {
      id: "supply-chain-resilience",
      title: "Building Resilient Supply Chains in 2025",
      description: "Strategies and best practices for creating supply chains that can withstand disruptions",
      date: "December 2024",
      category: "Strategy Guide",
      downloadUrl: "#",
      keyInsights: [
        "Multi-sourcing strategies reduce risk by 40%",
        "Digital twin technology improves planning accuracy",
        "Localization trends continue to accelerate",
        "AI-powered risk assessment tools becoming essential"
      ],
      highlights: ["Risk Management", "Technology Integration", "Strategic Planning", "Case Studies"]
    },
    {
      id: "ecommerce-logistics-2025",
      title: "E-commerce Logistics Trends 2025",
      description: "Deep dive into the evolving e-commerce logistics landscape and emerging technologies",
      date: "November 2024",
      category: "Industry Trends",
      downloadUrl: "#",
      keyInsights: [
        "Same-day delivery expectations driving innovation",
        "Micro-fulfillment centers gaining popularity",
        "Last-mile delivery automation accelerating",
        "Returns management optimization critical for profitability"
      ],
      highlights: ["Technology Trends", "Customer Expectations", "Operational Efficiency", "Future Outlook"]
    },
    {
      id: "sustainability-logistics",
      title: "Sustainable Logistics: A Comprehensive Guide",
      description: "Complete guide to implementing sustainable practices in logistics operations",
      date: "October 2024",
      category: "Sustainability",
      downloadUrl: "#",
      keyInsights: [
        "Carbon-neutral shipping options growing in demand",
        "Electric vehicle adoption accelerating in last-mile delivery",
        "Circular economy principles reshaping logistics",
        "Green packaging solutions reducing environmental impact"
      ],
      highlights: ["Green Technologies", "Carbon Reduction", "Best Practices", "ROI Analysis"]
    }
  ];

  const caseStudies = [
    {
      id: "techcorp-supply-chain",
      title: "TechCorp Electronics: Global Supply Chain Transformation",
      description: "How TechCorp Electronics achieved 45% reduction in customs clearance time and 30% decrease in shipping costs",
      industry: "Electronics Manufacturing",
      results: [
        "45% reduction in customs clearance time",
        "30% decrease in shipping costs",
        "Improved delivery reliability to 99.2%",
        "Enhanced supplier collaboration"
      ],
      challenges: "Managing complex supply chains across 15 countries with varying customs regulations",
      solution: "Implemented SwiftCargo's global logistics platform with customs clearance automation",
      duration: "6 months",
      teamSize: "12 specialists"
    },
    {
      id: "fashion-retail-fulfillment",
      title: "Global Fashion Retail: Same-Day Delivery Excellence",
      description: "Achieving 95% same-day delivery success rate while managing seasonal inventory fluctuations",
      industry: "Fashion & Apparel",
      results: [
        "Same-day delivery achieved in 95% of cases",
        "25% reduction in inventory holding costs",
        "Customer satisfaction increased to 98%",
        "Scalable fulfillment network established"
      ],
      challenges: "Meeting same-day delivery expectations while managing seasonal inventory fluctuations",
      solution: "Deployed SwiftCargo's fulfillment network with AI-powered demand forecasting",
      duration: "8 months",
      teamSize: "15 specialists"
    },
    {
      id: "pharmacare-cold-chain",
      title: "PharmaCare Solutions: Perfect Cold Chain Compliance",
      description: "Maintaining 100% temperature compliance for sensitive medical products across global distribution",
      industry: "Pharmaceuticals",
      results: [
        "100% temperature compliance maintained",
        "Zero product integrity issues",
        "Regulatory compliance achieved",
        "Emergency response capability established"
      ],
      challenges: "Maintaining temperature-controlled logistics for sensitive medical products",
      solution: "Implemented SwiftCargo's cold chain logistics with real-time monitoring",
      duration: "4 months",
      teamSize: "8 specialists"
    },
    {
      id: "automotive-parts-logistics",
      title: "AutoParts Global: Streamlined Distribution Network",
      description: "Optimizing parts distribution across 25 countries with just-in-time delivery",
      industry: "Automotive",
      results: [
        "40% reduction in lead times",
        "Improved supplier relationships",
        "Enhanced quality control",
        "Cost optimization achieved"
      ],
      challenges: "Managing parts distribution complexity across multiple countries",
      solution: "Implemented SwiftCargo's parts distribution network with quality assurance protocols",
      duration: "7 months",
      teamSize: "10 specialists"
    }
  ];

  const bestPractices = [
    {
      id: "inventory-optimization",
      title: "Inventory Optimization Strategies",
      description: "Proven strategies for optimizing inventory levels while maintaining service quality",
      category: "Operations",
      difficulty: "Intermediate",
      readTime: "15 min read",
      keyPoints: [
        "ABC analysis for inventory categorization",
        "Safety stock calculation methods",
        "Demand forecasting techniques",
        "Supplier collaboration strategies"
      ],
      benefits: ["Reduced holding costs", "Improved cash flow", "Better service levels", "Enhanced efficiency"]
    },
    {
      id: "route-optimization",
      title: "Route Optimization Best Practices",
      description: "Advanced techniques for optimizing delivery routes and reducing transportation costs",
      category: "Transportation",
      difficulty: "Advanced",
      readTime: "20 min read",
      keyPoints: [
        "Algorithm selection for different scenarios",
        "Real-time route adjustments",
        "Multi-vehicle optimization",
        "Traffic and weather integration"
      ],
      benefits: ["Reduced fuel costs", "Faster deliveries", "Better customer satisfaction", "Lower emissions"]
    },
    {
      id: "supplier-management",
      title: "Supplier Relationship Management",
      description: "Building and maintaining strong relationships with logistics suppliers",
      category: "Procurement",
      difficulty: "Intermediate",
      readTime: "12 min read",
      keyPoints: [
        "Performance measurement frameworks",
        "Communication strategies",
        "Risk mitigation approaches",
        "Continuous improvement processes"
      ],
      benefits: ["Better service quality", "Reduced risks", "Cost savings", "Innovation opportunities"]
    },
    {
      id: "digital-transformation",
      title: "Digital Transformation in Logistics",
      description: "Step-by-step guide to implementing digital solutions in logistics operations",
      category: "Technology",
      difficulty: "Advanced",
      readTime: "25 min read",
      keyPoints: [
        "Technology assessment frameworks",
        "Change management strategies",
        "ROI measurement methods",
        "Scalability planning"
      ],
      benefits: ["Improved efficiency", "Better visibility", "Cost reduction", "Competitive advantage"]
    }
  ];

  const globalInsights = [
    {
      id: "asia-pacific-logistics",
      title: "Asia-Pacific Logistics Landscape 2025",
      description: "Comprehensive analysis of logistics trends and opportunities in the Asia-Pacific region",
      region: "Asia-Pacific",
      focus: "Regional Trends",
      keyInsights: [
        "China's Belt and Road Initiative impact",
        "Southeast Asia e-commerce boom",
        "Port infrastructure developments",
        "Regional trade agreements"
      ],
      opportunities: ["Manufacturing hubs", "E-commerce growth", "Infrastructure investment", "Trade facilitation"]
    },
    {
      id: "europe-supply-chains",
      title: "European Supply Chain Resilience",
      description: "Analysis of European supply chain challenges and innovative solutions",
      region: "Europe",
      focus: "Supply Chain",
      keyInsights: [
        "Brexit impact on logistics",
        "Green logistics initiatives",
        "Digital transformation trends",
        "Cross-border collaboration"
      ],
      opportunities: ["Sustainability leadership", "Technology adoption", "Regional integration", "Innovation hubs"]
    },
    {
      id: "north-america-ecommerce",
      title: "North America E-commerce Logistics",
      description: "Deep dive into the evolving e-commerce logistics landscape in North America",
      region: "North America",
      focus: "E-commerce",
      keyInsights: [
        "Same-day delivery expectations",
        "Last-mile innovation",
        "Returns management",
        "Fulfillment center networks"
      ],
      opportunities: ["Technology innovation", "Customer experience", "Operational efficiency", "Market expansion"]
    },
    {
      id: "africa-emerging-markets",
      title: "Africa: Emerging Logistics Opportunities",
      description: "Exploring logistics opportunities and challenges in emerging African markets",
      region: "Africa",
      focus: "Emerging Markets",
      keyInsights: [
        "Infrastructure development",
        "Digital payment adoption",
        "Regional trade agreements",
        "Urbanization trends"
      ],
      opportunities: ["Market entry", "Infrastructure investment", "Technology leapfrogging", "Regional trade"]
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
              Resources &{" "}
              <span className="text-gradient">Insights</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Stay ahead of the curve with our comprehensive collection of industry reports, 
              case studies, best practices, and global insights. Knowledge is power in logistics.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Industry Reports */}
      <section id="reports" className="py-20 bg-white">
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
              <span className="text-gradient">Reports</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay informed with our quarterly industry reports, market analysis, and strategic insights 
              that help you make data-driven decisions.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {industryReports.map((report, index) => (
              <motion.div
                key={report.title}
                id={report.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-border/50 hover:shadow-glow hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                      {report.category}
                    </span>
                    <div className="text-sm text-muted-foreground mt-1">{report.date}</div>
                  </div>
                </div>

                <h3 className="text-2xl font-display font-bold mb-4">{report.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{report.description}</p>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-primary">Key Insights</h4>
                  <ul className="space-y-2">
                    {report.keyInsights.slice(0, 3).map((insight, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {report.highlights.slice(0, 2).map((highlight, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-3 py-1 bg-white/50 text-muted-foreground text-xs rounded-lg border border-border/30"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                  <Link href={`/resources/reports/${report.id}`}>
                    <motion.button
                      className="px-6 py-3 bg-gradient text-white rounded-lg font-semibold shadow-glow flex items-center space-x-2"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Download className="w-4 h-4" />
                      <span>View Report</span>
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="case-studies" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
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
              Real-world examples of how our solutions have transformed logistics operations 
              for businesses across different industries and regions.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.title}
                id={study.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-border/50 hover:shadow-glow hover:-translate-y-2 transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                      {study.industry}
                    </span>
                    <div className="text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {study.duration}
                    </div>
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-3">{study.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{study.description}</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-red-600">Challenge</h4>
                    <p className="text-sm text-muted-foreground">{study.challenges}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-600">Solution</h4>
                    <p className="text-sm text-muted-foreground">{study.solution}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-green-600">Results</h4>
                  <ul className="space-y-2">
                    {study.results.map((result, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <div className="text-sm text-muted-foreground">
                    <Users className="w-4 h-4 inline mr-1" />
                    {study.teamSize} specialists
                  </div>
                  <Link href={`/resources/case-studies/${study.id}`}>
                    <motion.button
                      className="px-6 py-2 text-primary hover:text-primary/80 font-medium flex items-center space-x-2 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Read Full Case Study</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section id="best-practices" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Best{" "}
              <span className="text-gradient">Practices</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Expert tips, strategies, and proven methodologies to optimize your logistics operations 
              and stay ahead of the competition.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestPractices.map((practice, index) => (
              <motion.div
                key={practice.title}
                id={practice.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-border/50 hover:shadow-glow hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                
                <div className="mb-4">
                  <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-2">
                    {practice.category}
                  </span>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {practice.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                    {practice.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{practice.readTime}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>{practice.difficulty}</span>
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-sm">Key Points</h4>
                  <ul className="space-y-1">
                    {practice.keyPoints.slice(0, 2).map((point, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-sm">Benefits</h4>
                  <div className="flex flex-wrap gap-1">
                    {practice.benefits.slice(0, 2).map((benefit, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 bg-white/50 text-muted-foreground text-xs rounded border border-border/30"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                <Link href={`/resources/best-practices/${practice.id}`}>
                  <motion.button
                    className="w-full px-4 py-2 bg-gradient text-white rounded-lg font-medium text-sm shadow-glow flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Insights */}
      <section id="global-insights" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Global{" "}
              <span className="text-gradient">Insights</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Regional expertise and insights that help you understand local logistics challenges, 
              opportunities, and cultural nuances across different markets.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {globalInsights.map((insight, index) => (
              <motion.div
                key={insight.title}
                id={insight.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-border/50 hover:shadow-glow hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient rounded-xl flex items-center justify-center">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                      {insight.region}
                    </span>
                    <div className="text-sm text-muted-foreground mt-1">{insight.focus}</div>
                  </div>
                </div>

                <h3 className="text-2xl font-display font-bold mb-4">{insight.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{insight.description}</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-primary">Key Insights</h4>
                    <ul className="space-y-2">
                      {insight.keyInsights.map((keyInsight, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{keyInsight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-600">Opportunities</h4>
                    <ul className="space-y-2">
                      {insight.opportunities.map((opportunity, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start space-x-2">
                          <TrendingUp className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span>{opportunity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{insight.region}</span>
                  </div>
                  <Link href={`/resources/global-insights/${insight.id}`}>
                    <motion.button
                      className="px-6 py-2 text-primary hover:text-primary/80 font-medium flex items-center space-x-2 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Explore Region</span>
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                  </Link>
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
              Stay{" "}
              <span className="text-gradient">Informed</span>
            </h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Get the latest insights, reports, and best practices delivered to your inbox. 
              Stay ahead of industry trends and optimize your logistics operations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-gradient text-white rounded-lg font-semibold text-lg shadow-glow-orange flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Subscribe to Updates</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                className="px-8 py-4 border-2 border-white/30 text-white rounded-lg font-semibold text-lg backdrop-blur-custom hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Request Custom Research
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
