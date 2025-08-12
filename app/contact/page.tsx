"use client";

import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare,
  ArrowRight,
  Send,
  // Globe,
  Users,
  // Shield,
  CheckCircle
} from "lucide-react";

export default function ContactPage() {
  const offices = [
    {
      city: "New York",
      country: "United States",
      address: "123 Logistics Way, Business District, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "nyc@swiftcargo.com",
      hours: "Mon-Fri: 8:00 AM - 6:00 PM EST"
    },
    {
      city: "London",
      country: "United Kingdom",
      address: "456 Shipping Lane, Canary Wharf, London E14 5AB",
      phone: "+44 (0) 20 7123 4567",
      email: "london@swiftcargo.com",
      hours: "Mon-Fri: 9:00 AM - 5:00 PM GMT"
    },
    {
      city: "Singapore",
      country: "Singapore",
      address: "789 Cargo Road, Marina Bay, Singapore 018956",
      phone: "+65 6123 4567",
      email: "singapore@swiftcargo.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM SGT"
    },
    {
      city: "Dubai",
      country: "UAE",
      address: "321 Freight Street, Jebel Ali, Dubai 00000",
      phone: "+971 4 123 4567",
      email: "dubai@swiftcargo.com",
      hours: "Sun-Thu: 8:00 AM - 5:00 PM GST"
    }
  ];

  const supportChannels = [
    {
      icon: Phone,
      title: "24/7 Support Hotline",
      description: "Round-the-clock support for urgent logistics issues",
      contact: "+1 (800) SWIFT-24",
      response: "Immediate response"
    },
    {
      icon: MessageSquare,
      title: "Live Chat Support",
      description: "Real-time assistance through our online platform",
      contact: "Available on website",
      response: "Instant response"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Detailed inquiries and documentation support",
      contact: "support@swiftcargo.com",
      response: "Within 2 hours"
    },
    {
      icon: Users,
      title: "Dedicated Account Manager",
      description: "Personal support for enterprise clients",
      contact: "Assigned upon request",
      response: "24 hours"
    }
  ];

  const faqs = [
    {
      question: "How quickly can you respond to urgent shipping requests?",
      answer: "We offer 24/7 emergency response with immediate action on urgent shipments. Our team can typically arrange expedited shipping within 2-4 hours for critical situations."
    },
    {
      question: "What information do I need to provide for a quote?",
      answer: "For an accurate quote, we need shipment details including origin, destination, weight, dimensions, cargo type, and preferred delivery timeline. Our team will guide you through the process."
    },
    {
      question: "Do you provide insurance for all shipments?",
      answer: "Yes, all our shipments include basic insurance coverage. We also offer additional coverage options for high-value cargo and specialized requirements."
    },
    {
      question: "How can I track my shipment in real-time?",
      answer: "We provide real-time tracking through our mobile app, website, and SMS updates. You'll receive tracking numbers and can monitor your shipment's progress 24/7."
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
              Get in{" "}
              <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Ready to transform your logistics? Our team is here to help you find the perfect 
              solution for your business needs. Contact us today to get started.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl lg:text-5xl font-display font-bold mb-8">
                Let&apos;s Start a{" "}
                <span className="text-gradient">Conversation</span>
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Tell us about your logistics needs and our experts will design a customized 
                solution that drives efficiency and reduces costs for your business.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: CheckCircle,
                    title: "Free Consultation",
                    description: "No-cost initial assessment of your logistics requirements"
                  },
                  {
                    icon: CheckCircle,
                    title: "Custom Solutions",
                    description: "Tailored logistics strategies designed for your business"
                  },
                  {
                    icon: CheckCircle,
                    title: "Expert Support",
                    description: "Dedicated team with decades of logistics experience"
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-border/50"
            >
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Enter your company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Service Interest *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">Select a service</option>
                    <option value="air-freight">Air Freight</option>
                    <option value="sea-freight">Sea Freight</option>
                    <option value="road-freight">Road Freight</option>
                    <option value="rail-freight">Rail Freight</option>
                    <option value="warehousing">Warehousing & Distribution</option>
                    <option value="customs">Customs Clearance</option>
                    <option value="technology">Technology Solutions</option>
                    <option value="consulting">Logistics Consulting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your logistics needs..."
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient text-white rounded-lg font-semibold text-lg shadow-glow flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Support Channels */}
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
              Multiple Ways to{" "}
              <span className="text-gradient">Connect</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the communication channel that works best for you. Our support team 
              is available through multiple platforms to ensure you get help when you need it.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportChannels.map((channel, index) => (
              <motion.div
                key={channel.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-border/50 hover:shadow-glow hover:-translate-y-2 transition-all duration-300 group text-center"
              >
                <div className="w-16 h-16 bg-gradient rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <channel.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {channel.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {channel.description}
                </p>
                
                <div className="space-y-2">
                  <div className="text-primary font-medium">{channel.contact}</div>
                  <div className="text-sm text-muted-foreground">{channel.response}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Offices */}
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
              Our Global{" "}
              <span className="text-gradient">Offices</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              With offices in key logistics hubs around the world, we provide local expertise 
              with global reach to serve your international shipping needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {offices.map((office, index) => (
              <motion.div
                key={office.city}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-border/50 hover:shadow-glow hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-display font-bold mb-1 group-hover:text-primary transition-colors">
                    {office.city}
                  </h3>
                  <p className="text-primary font-medium">{office.country}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground">{office.address}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{office.phone}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{office.email}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{office.hours}</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-border/50">
                  <button className="w-full px-4 py-2 bg-gradient text-white rounded-lg font-medium text-sm hover:shadow-glow transition-all">
                    Contact Office
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
              Frequently Asked{" "}
              <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get quick answers to common questions about contacting SwiftCargo and our services.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border border-border/50 hover:shadow-glow transition-all duration-300"
              >
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
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
              Don&apos;t wait to optimize your logistics operations. Contact us today and 
              discover how SwiftCargo can transform your supply chain.
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
                Schedule Call
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
