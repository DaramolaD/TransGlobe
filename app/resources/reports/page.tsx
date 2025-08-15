"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Download, 
  FileText,
  Users,
  ArrowLeft,
  CheckCircle,
  TrendingUp,
  Globe,
  Clock
} from "lucide-react";
import Link from "next/link";
import { industryReports } from "@/lib/data/resources";

export default function IndustryReportsPage() {
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
            <div className="flex items-center justify-center mb-6">
              <Link href="/resources" className="text-white/80 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2 inline" />
                Back to Resources
              </Link>
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold mb-6">
              Industry{" "}
              <span className="text-gradient">Reports</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Stay informed with our comprehensive industry reports, market analysis, and strategic insights 
              that help you make data-driven decisions in logistics.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Reports Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {industryReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
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
                    {report.keyInsights.map((insight, idx) => (
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

      {/* Features */}
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
              Why Our{" "}
              <span className="text-gradient">Reports?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our industry reports provide comprehensive insights backed by extensive research 
              and real-world data analysis.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Data-Driven Insights",
                description: "Based on comprehensive market research and analysis of real industry data"
              },
              {
                icon: Users,
                title: "Expert Analysis",
                description: "Written by industry experts with decades of logistics experience"
              },
              {
                icon: TrendingUp,
                title: "Future Trends",
                description: "Forward-looking analysis to help you prepare for what's coming"
              },
              {
                icon: Globe,
                title: "Global Perspective",
                description: "Coverage of international markets and cross-border logistics trends"
              },
              {
                icon: Clock,
                title: "Timely Updates",
                description: "Quarterly reports to keep you current with market developments"
              },
              {
                icon: FileText,
                title: "Actionable Intelligence",
                description: "Practical insights you can implement in your business strategy"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-border/50 hover:shadow-glow hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
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
              Stay{" "}
              <span className="text-gradient">Informed</span>
            </h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Get the latest industry insights and market analysis delivered to your inbox. 
              Stay ahead of trends and make informed decisions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-gradient text-white rounded-lg font-semibold text-lg shadow-glow-orange flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Subscribe to Reports</span>
                <Download className="w-5 h-5" />
              </motion.button>
              
              <Link href="/resources">
                <motion.button
                  className="px-8 py-4 border-2 border-white/30 text-white rounded-lg font-semibold text-lg backdrop-blur-custom hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore All Resources
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
