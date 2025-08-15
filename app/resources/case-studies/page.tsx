"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Clock,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  Building,
  Target,
  Award
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import { caseStudies } from "@/lib/data/resources";

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

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
              Success{" "}
              <span className="text-gradient">Stories</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Real-world examples of how our solutions have transformed logistics operations 
              for businesses across different industries and regions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-border/50 hover:shadow-glow hover:-translate-y-2 transition-all duration-300"
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
                    {study.results.slice(0, 3).map((result, idx) => (
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
              <span className="text-gradient">Case Studies?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real success stories that demonstrate the tangible impact of our solutions 
              across different industries and business challenges.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Building,
                title: "Industry Diversity",
                description: "Coverage across electronics, fashion, pharmaceuticals, automotive, and more"
              },
              {
                icon: Target,
                title: "Measurable Results",
                description: "Quantified improvements in efficiency, cost, and customer satisfaction"
              },
              {
                icon: Clock,
                title: "Implementation Timeline",
                description: "Realistic project timelines and team sizes for planning purposes"
              },
              {
                icon: TrendingUp,
                title: "Performance Metrics",
                description: "Before and after comparisons with specific improvement percentages"
              },
              {
                icon: Award,
                title: "Proven Success",
                description: "Validated results from real client implementations"
              },
              {
                icon: Users,
                title: "Team Insights",
                description: "Learn from the experiences of our specialist teams"
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
              Ready to{" "}
              <span className="text-gradient">Transform</span>
            </h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Inspired by these success stories? Let&apos;s discuss how we can help 
              transform your logistics operations and achieve similar results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <motion.button
                  className="px-8 py-4 bg-gradient text-white rounded-lg font-semibold text-lg shadow-glow-orange flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Get Started Today</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              
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
