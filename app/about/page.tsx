"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Award, 
  Target, 
  Heart, 
  Shield, 
  Zap,
  Globe,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/Header";

export default function AboutPage() {
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

  const leadership = [
    {
      id: "david-chen",
      name: "David Chen",
      role: "Chief Executive Officer",
      bio: "25+ years in global logistics with expertise in supply chain optimization and international trade.",
      avatar: "DC",
      experience: "25+ years"
    },
    {
      id: "sarah-williams",
      name: "Sarah Williams",
      role: "Chief Operations Officer",
      bio: "Former VP at FedEx with deep knowledge in air freight and express logistics operations.",
      avatar: "SW",
      experience: "20+ years"
    },
    {
      id: "michael-rodriguez",
      name: "Michael Rodriguez",
      role: "Chief Technology Officer",
      bio: "Tech veteran who led digital transformation at major logistics companies.",
      avatar: "MR",
      experience: "18+ years"
    },
    {
      id: "lisa-thompson",
      name: "Lisa Thompson",
      role: "Chief Financial Officer",
      bio: "Financial expert with 15+ years in logistics finance and international trade.",
      avatar: "LT",
      experience: "15+ years"
    }
  ];

  const milestones = [
    {
      id: "company-founded",
      year: "1999",
      title: "Company Founded",
      description: "SwiftCargo established in New York with a vision to revolutionize global logistics."
    },
    {
      id: "global-expansion",
      year: "2005",
      title: "Global Expansion",
      description: "Expanded to 25 countries with offices in major logistics hubs worldwide."
    },
    {
      id: "technology-innovation",
      year: "2010",
      title: "Technology Innovation",
      description: "Launched first real-time tracking platform and mobile app for customers."
    },
    {
      id: "sustainability-focus",
      year: "2015",
      title: "Sustainability Focus",
      description: "Introduced eco-friendly logistics solutions and carbon-neutral shipping options."
    },
    {
      id: "ai-integration",
      year: "2020",
      title: "AI Integration",
      description: "Implemented AI-powered route optimization and predictive analytics."
    },
    {
      id: "future-forward",
      year: "2024",
      title: "Future Forward",
      description: "Leading the industry with blockchain security and IoT tracking solutions."
    }
  ];

  const values = [
    {
      id: "customer-first",
      icon: Heart,
      title: "Customer First",
      description: "Every decision we make is guided by what's best for our customers."
    },
    {
      id: "integrity",
      icon: Shield,
      title: "Integrity",
      description: "We operate with complete transparency and ethical business practices."
    },
    {
      id: "innovation",
      icon: Zap,
      title: "Innovation",
      description: "Constantly pushing boundaries to deliver cutting-edge logistics solutions."
    },
    {
      id: "global-mindset",
      icon: Globe,
      title: "Global Mindset",
      description: "Embracing diversity and understanding local cultures in every market."
    },
    {
      id: "excellence",
      icon: Target,
      title: "Excellence",
      description: "Committed to delivering the highest quality service in everything we do."
    },
    {
      id: "teamwork",
      icon: Users,
      title: "Teamwork",
      description: "Collaboration and mutual respect drive our success and growth."
    }
  ];

  const awards = [
    {
      id: "logistics-excellence",
      title: "Logistics Excellence Award",
      organization: "Global Logistics Association",
      year: "2023",
      description: "Recognized for outstanding service quality and customer satisfaction."
    },
    {
      id: "innovation-technology",
      title: "Innovation in Technology",
      organization: "Tech Logistics Summit",
      year: "2023",
      description: "Awarded for AI-powered route optimization and IoT tracking solutions."
    },
    {
      id: "best-air-freight",
      title: "Best Air Freight Provider",
      organization: "Air Cargo Excellence",
      year: "2022",
      description: "Top-rated air freight service provider in North America."
    },
    {
      id: "sustainability-champion",
      title: "Sustainability Champion",
      organization: "Green Logistics Council",
      year: "2022",
      description: "Leadership in eco-friendly logistics and carbon reduction initiatives."
    }
  ];

  return (
    <div className="min-h-screen bg-background scroll-smooth">
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
            <h1 className="text-5xl lg:text-7xl font-display font-bold mb-6">
              About{" "}
              <span className="text-gradient">SwiftCargo</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              For over 25 years, we&apos;ve been connecting businesses across the globe through 
              innovative logistics solutions. Our story is one of growth, innovation, and 
              unwavering commitment to customer success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section id="story" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h2 className="text-4xl lg:text-5xl font-display font-bold">
                Your Trusted Partner in{" "}
                <span className="text-gradient">Global Logistics</span>
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Founded in 1999, SwiftCargo has grown from a small New York-based company 
                to a global logistics powerhouse serving 150+ countries. Our journey has been 
                driven by a simple mission: to make global shipping simple, reliable, and cost-effective.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Today, we&apos;re proud to serve over 50,000 businesses worldwide, from startups 
                to Fortune 500 companies, with the same dedication to excellence that guided 
                our founding.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { number: "25+", label: "Years Experience" },
                  { number: "150+", label: "Countries Served" },
                  { number: "50K+", label: "Happy Clients" },
                  { number: "99.8%", label: "Success Rate" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-gradient">{stat.number}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="w-full h-[500px] bg-gradient-to-br from-blue-500/20 to-orange-500/20 rounded-2xl backdrop-blur-custom border border-border/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto animate-float">
                      <Users className="w-16 h-16 text-white" />
                    </div>
                    <div className="text-white/80 text-lg">Global Team</div>
                    <div className="text-white/60 text-sm">25+ Years of Excellence</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-display font-bold mb-6">Our Mission</h3>
              <p className="text-xl text-muted-foreground leading-relaxed">
                To simplify global commerce by providing innovative, reliable, and 
                cost-effective logistics solutions that empower businesses to reach 
                customers worldwide.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-display font-bold mb-6">Our Vision</h3>
              <p className="text-xl text-muted-foreground leading-relaxed">
                To be the world&apos;s most trusted logistics partner, leading the industry 
                in innovation, sustainability, and customer satisfaction while connecting 
                businesses across every continent.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section id="values" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Our{" "}
              <span className="text-gradient">Values</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These core values guide every decision we make and every action we take, 
              ensuring we remain true to our mission while serving our customers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                id={value.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section id="team" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Meet Our{" "}
              <span className="text-gradient">Leadership Team</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our experienced leadership team brings decades of industry expertise 
              and a shared vision for the future of global logistics.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((leader, index) => (
              <motion.div
                key={leader.name}
                id={leader.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-24 h-24 bg-gradient rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">{leader.avatar}</span>
                  </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {leader.name}
                </h3>
                <div className="text-primary font-medium mb-2">{leader.role}</div>
                <div className="text-sm text-muted-foreground mb-4">{leader.experience}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {leader.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section id="timeline" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Our{" "}
              <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From humble beginnings to global logistics leader, discover the key 
              milestones that shaped SwiftCargo&apos;s success story.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-primary/30"></div>
              
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                  id={milestone.id}
                  initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative flex items-start mb-12 last:mb-0"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-6 w-4 h-4 bg-gradient rounded-full border-4 border-white shadow-lg"></div>
                  
                  <div className="ml-16">
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-border/50 hover:shadow-glow transition-all duration-300">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="text-2xl font-bold text-primary">{milestone.year}</div>
                        <h3 className="text-xl font-semibold">{milestone.title}</h3>
                  </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {milestone.description}
                      </p>
                </div>
                </div>
              </motion.div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section id="awards" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Awards &{" "}
              <span className="text-gradient">Recognition</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our commitment to excellence has been recognized by industry leaders 
              and organizations worldwide.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {awards.map((award, index) => (
              <motion.div
                key={award.title}
                id={award.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-border/50 hover:shadow-glow hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{award.title}</h3>
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="text-primary font-medium">{award.organization}</span>
                      <span className="text-muted-foreground">{award.year}</span>
                </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {award.description}
                    </p>
                </div>
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
              Ready to Partner with{" "}
              <span className="text-gradient">SwiftCargo?</span>
            </h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Join thousands of businesses that trust us with their global logistics needs. 
              Let&apos;s discuss how we can help your business grow and succeed worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-gradient text-white rounded-lg font-semibold text-lg shadow-glow-orange flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Started Today</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                className="px-8 py-4 border-2 border-white/30 text-white rounded-lg font-semibold text-lg backdrop-blur-custom hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Our Team
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
