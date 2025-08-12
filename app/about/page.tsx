"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Award, 
  Globe, 
  Target, 
  Shield, 
  Zap,
  ArrowRight,
  Check,
  Package,
  Truck,
  Ship,
  Plane,
  Train
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Reliability",
      description: "We deliver on our promises, every time. Your trust is our most valuable asset."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Constantly evolving our solutions with cutting-edge technology and best practices."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Local expertise with worldwide coverage, ensuring seamless operations anywhere."
    },
    {
      icon: Users,
      title: "Customer-Centric",
      description: "Your success is our success. We build lasting partnerships based on mutual growth."
    }
  ];

  const milestones = [
    { year: "1999", title: "Company Founded", description: "SwiftCargo established with a vision to revolutionize global logistics" },
    { year: "2005", title: "Global Expansion", description: "Expanded operations to 50+ countries across 6 continents" },
    { year: "2012", title: "Technology Innovation", description: "Launched AI-powered logistics platform and real-time tracking" },
    { year: "2018", title: "Sustainability Focus", description: "Implemented eco-friendly solutions and carbon-neutral shipping options" },
    { year: "2024", title: "Industry Leader", description: "Recognized as top 10 logistics provider with 50K+ satisfied clients" }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      experience: "20+ years in logistics",
      bio: "Former VP of Operations at Global Logistics Corp, MBA from Harvard Business School",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Michael Chen",
      role: "Chief Operations Officer",
      experience: "15+ years in supply chain",
      bio: "Expert in supply chain optimization and international trade regulations",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Customer Success",
      experience: "12+ years in client relations",
      bio: "Specialist in building long-term client relationships and customer satisfaction",
      image: "/api/placeholder/200/200"
    },
    {
      name: "David Kim",
      role: "Chief Technology Officer",
      experience: "18+ years in logistics tech",
      bio: "Former tech lead at Amazon Logistics, expert in AI and machine learning",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Lisa Thompson",
      role: "Head of Global Operations",
      experience: "14+ years in international logistics",
      bio: "Expert in cross-border operations and regulatory compliance",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Robert Wilson",
      role: "Chief Financial Officer",
      experience: "16+ years in finance",
      bio: "Former CFO at Fortune 500 logistics company, CPA and MBA",
      image: "/api/placeholder/200/200"
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
              About{" "}
              <span className="text-gradient">SwiftCargo</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              We're more than a logistics company – we're your strategic partner in global business success. 
              With over 25 years of experience, we've built a reputation for reliability, innovation, 
              and customer-centric solutions that drive business growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl lg:text-5xl font-display font-bold mb-8">
                Our{" "}
                <span className="text-gradient">Mission</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                To revolutionize global logistics by providing innovative, sustainable, and reliable 
                solutions that empower businesses to expand their reach and achieve their goals.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that every business deserves access to world-class logistics services, 
                regardless of their size or location. Our mission is to break down barriers and 
                create opportunities for growth through seamless supply chain solutions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-4xl lg:text-5xl font-display font-bold mb-8">
                Our{" "}
                <span className="text-gradient">Vision</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                To be the world's most trusted and innovative logistics partner, setting new standards 
                for excellence in global supply chain management.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We envision a future where logistics is not just a service, but a strategic advantage 
                that enables businesses to thrive in an interconnected world. Through technology, 
                sustainability, and unwavering commitment to our clients, we're building that future today.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              Our Core{" "}
              <span className="text-gradient">Values</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These fundamental principles guide everything we do and shape the way we serve our clients.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
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

      {/* Timeline Section */}
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
              Our{" "}
              <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From humble beginnings to global logistics leader, discover the key milestones 
              that shaped SwiftCargo's success story.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex items-center mb-12 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className="flex-1 text-center">
                  <div className="w-24 h-24 bg-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">{milestone.year}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
                <div className="w-1 h-20 bg-gradient mx-8"></div>
                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              Meet Our{" "}
              <span className="text-gradient">Leadership Team</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our experienced leadership team brings decades of combined expertise in logistics, 
              technology, and business strategy to drive SwiftCargo's continued success.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-border/50 hover:shadow-glow hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="text-center mb-6">
                  <div className="w-32 h-32 bg-gradient rounded-full mx-auto mb-4 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                    <Users className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm mb-3">{member.experience}</p>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {member.bio}
                </p>
                
                <div className="flex items-center justify-center">
                  <button className="text-primary hover:text-primary/80 font-medium flex items-center space-x-2 group-hover:translate-x-1 transition-all">
                    <span>View Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
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
              SwiftCargo by the{" "}
              <span className="text-gradient">Numbers</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Our impressive track record demonstrates our commitment to excellence and 
              the trust our clients place in us.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "25+", label: "Years of Excellence", icon: Award },
              { number: "150+", label: "Countries Served", icon: Globe },
              { number: "50K+", label: "Happy Clients", icon: Users },
              { number: "99.8%", label: "Success Rate", icon: Target }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-10 h-10 text-gradient" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-gradient mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80 text-lg">{stat.label}</div>
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
              Ready to Partner with{" "}
              <span className="text-gradient">SwiftCargo?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join thousands of businesses that trust us with their logistics needs. 
              Let's discuss how we can help your business grow globally.
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
                className="px-8 py-4 border-2 border-primary/30 text-primary rounded-lg font-semibold text-lg bg-white hover:bg-primary hover:text-white transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule a Meeting
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
