"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin,
  MessageSquare,
  Send,
  CheckCircle,
  Users,
  Globe,
  Shield,
  Zap,
} from "lucide-react";
import Header from "@/components/Header";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form after successful submission
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          service: "",
          message: "",
        });
      }, 5000);
    }, 2000);
  };

  const offices = [
    {
      city: "New York",
      country: "United States",
      address: "123 Logistics Plaza, Manhattan, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "nyc@swiftcargo.com",
      hours: "Mon-Fri: 8AM-8PM EST",
    },
    {
      city: "London",
      country: "United Kingdom",
      address: "456 Shipping Lane, Canary Wharf, E14 5AB",
      phone: "+44 20 7123 4567",
      email: "london@swiftcargo.com",
      hours: "Mon-Fri: 8AM-8PM GMT",
    },
    {
      city: "Shanghai",
      country: "China",
      address: "789 Cargo Street, Pudong District, 200120",
      phone: "+86 21 5888 1234",
      email: "shanghai@swiftcargo.com",
      hours: "Mon-Fri: 8AM-8PM CST",
    },
    {
      city: "Dubai",
      country: "UAE",
      address: "321 Logistics Tower, Sheikh Zayed Road",
      phone: "+971 4 123 4567",
      email: "dubai@swiftcargo.com",
      hours: "Sun-Thu: 8AM-6PM GST",
    },
  ];

  const supportChannels = [
    {
      icon: Phone,
      title: "24/7 Phone Support",
      description: "Call us anytime for immediate assistance",
      contact: "+1 (800) LOGISTICS",
      response: "Immediate response",
    },
    {
      icon: Mail,
      title: "Email Support",
      description:
        "Send us detailed inquiries and get responses within 2 hours",
      contact: "support@swiftcargo.com",
      response: "Within 2 hours",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our experts in real-time",
      contact: "Available on website",
      response: "Instant response",
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto px-4"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-4xl font-display font-bold mb-4 text-green-600">
            Message Sent Successfully!
          </h1>

          <p className="text-xl text-muted-foreground mb-8">
            Thank you for contacting SwiftCargo. We&apos;ve received your message and
            will get back to you within 2 hours during business hours.
          </p>

          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-border/50 mb-8">
            <h3 className="font-semibold mb-4">What happens next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <span className="text-muted-foreground">
                  Our team will review your inquiry
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <span className="text-muted-foreground">
                  We&apos;ll assign the best specialist to help you
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <span className="text-muted-foreground">
                  You&apos;ll receive a detailed response within 2 hours
                </span>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground">
            In the meantime, you can explore our services or track existing
            shipments.
          </p>
        </motion.div>
      </div>
    );
  }

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
            <h1 className="text-5xl lg:text-7xl font-display font-bold mb-6">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Ready to transform your logistics? Our team of experts is here to
              help. Contact us today and discover how SwiftCargo can streamline
              your shipping operations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-8">
                Send Us a <span className="text-gradient">Message</span>
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="your.email@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                      Company
                  </label>
                  <input
                    type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Your company name"
                  />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">
                      Service Interest
                  </label>
                  <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="">Select a service</option>
                    <option value="air-freight">Air Freight</option>
                    <option value="sea-freight">Sea Freight</option>
                    <option value="road-freight">Road Freight</option>
                    <option value="rail-freight">Rail Freight</option>
                      <option value="warehousing">Warehousing</option>
                    <option value="customs">Customs Clearance</option>
                      <option value="other">Other</option>
                  </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    placeholder="Tell us about your logistics needs, questions, or how we can help..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-gradient text-white rounded-lg font-semibold text-lg shadow-glow hover:shadow-glow-orange disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  whileHover={{
                    scale: isSubmitting ? 1 : 1.02,
                    y: isSubmitting ? 0 : -2,
                  }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Information */}
          <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl lg:text-4xl font-display font-bold mb-8">
                  Contact <span className="text-gradient">Information</span>
            </h2>

                <div className="space-y-6">
                  {supportChannels.map((office, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                        <office.icon className="w-6 h-6 text-white" />
                </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          {office.title}
                </h3>
                        <p className="text-muted-foreground mb-2">
                          {office.description}
                        </p>
                        <p className="text-primary font-medium">
                          {office.contact}
                        </p>
                      </div>
                </div>
            ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Global Offices */}
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
              Our <span className="text-gradient">Global Offices</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              With offices in strategic locations worldwide, we provide local
              expertise and support in every major logistics hub.
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
                className="bg-white rounded-2xl p-8 border border-border/50 hover:shadow-glow hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{office.city}</h3>
                  <p className="text-muted-foreground">{office.country}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="text-sm">
                    <div className="font-medium mb-1">Address</div>
                    <p className="text-muted-foreground">{office.address}</p>
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium mb-1">Phone</div>
                    <p className="text-primary font-medium">{office.phone}</p>
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium mb-1">Email</div>
                    <p className="text-primary font-medium">{office.email}</p>
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium mb-1">Business Hours</div>
                    <p className="text-muted-foreground">{office.hours}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Contact Us */}
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
              Why Contact <span className="text-gradient">SwiftCargo?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our team of logistics experts is here to help you find the perfect
              solution for your shipping needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
            {[
              {
                icon: Users,
                title: "Expert Team",
                description:
                  "25+ years of logistics experience with specialists in every service area.",
              },
              {
                icon: Globe,
                title: "Global Knowledge",
                description:
                  "Local expertise in 150+ countries with deep understanding of regional logistics.",
              },
              {
                icon: Shield,
                title: "Trusted Partner",
                description:
                  "99.8% success rate with thousands of satisfied customers worldwide.",
              },
              {
                icon: Zap,
                title: "Quick Response",
                description:
                  "Get responses within 2 hours and solutions tailored to your timeline.",
              },
              {
                icon: CheckCircle,
                title: "Custom Solutions",
                description:
                  "Tailored logistics solutions designed specifically for your business needs.",
              },
              {
                icon: MessageSquare,
                title: "24/7 Support",
                description:
                  "Round-the-clock support for urgent shipments and emergency situations.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
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
              Ready to Get <span className="text-gradient">Started?</span>
            </h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Don&apos;t wait to optimize your logistics. Contact us today and
              discover how SwiftCargo can transform your shipping operations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-gradient text-white rounded-lg font-semibold text-lg shadow-glow-orange flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Free Quote</span>
                <Send className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                className="px-8 py-4 border-2 border-white/30 text-white rounded-lg font-semibold text-lg backdrop-blur-custom hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule a Call
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
