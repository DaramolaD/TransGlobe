"use client";

import { motion } from "framer-motion";
import { 
  Check, 
  X,
  Star,
  ArrowRight,
  Package,
  Truck,
  Plane,
  Ship,
  Users,
  Shield,
  Zap,
  Globe
} from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for small businesses and startups",
      price: "$299",
      period: "/month",
      icon: Package,
      features: [
        "Air Freight (up to 100kg/month)",
        "Basic Tracking",
        "Email Support",
        "Standard Documentation",
        "Basic Insurance Coverage"
      ],
      notIncluded: [
        "Customs Clearance",
        "Priority Support",
        "Advanced Analytics",
        "Dedicated Account Manager"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses with regular shipping needs",
      price: "$799",
      period: "/month",
      icon: Truck,
      features: [
        "Air Freight (up to 500kg/month)",
        "Sea Freight (up to 2 TEU/month)",
        "Real-time Tracking",
        "Priority Support",
        "Customs Clearance",
        "Advanced Documentation",
        "Enhanced Insurance",
        "Route Optimization"
      ],
      notIncluded: [
        "Dedicated Account Manager",
        "Custom Solutions",
        "Advanced Analytics Dashboard"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      description: "Comprehensive solutions for large-scale operations",
      price: "Custom",
      period: "",
      icon: Plane,
      features: [
        "Unlimited Air & Sea Freight",
        "Road & Rail Freight",
        "Dedicated Account Manager",
        "24/7 Priority Support",
        "Customs Clearance",
        "Advanced Analytics Dashboard",
        "Custom Solutions",
        "API Integration",
        "White-label Options",
        "Training & Onboarding"
      ],
      notIncluded: [],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const addOns = [
    {
      name: "Customs Clearance",
      description: "Expert handling of all customs documentation and procedures",
      price: "$150",
      period: "/shipment",
      icon: Shield
    },
    {
      name: "Priority Support",
      description: "24/7 dedicated support with faster response times",
      price: "$99",
      period: "/month",
      icon: Users
    },
    {
      name: "Advanced Analytics",
      description: "Comprehensive reporting and performance insights",
      price: "$199",
      period: "/month",
      icon: Zap
    },
    {
      name: "API Integration",
      description: "Seamless integration with your existing systems",
      price: "$299",
      period: "/month",
      icon: Globe
    }
  ];

  const faqs = [
    {
      question: "Can I change my plan at any time?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle."
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fees for our Starter and Professional plans. Enterprise plans may have one-time setup costs depending on complexity."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, bank transfers, and can arrange payment terms for Enterprise customers."
    },
    {
      question: "Do you offer volume discounts?",
      answer: "Yes, we offer volume discounts for high-volume shippers. Contact our sales team for custom pricing."
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
              Simple,{" "}
              <span className="text-gradient">Transparent</span>
              <br />
              Pricing
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Choose the plan that fits your business needs. All plans include our core 
              logistics services with transparent pricing and no hidden fees.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
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
              Choose Your{" "}
              <span className="text-gradient">Plan</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start with what you need and scale as you grow. All plans include our 
              award-winning logistics services and support.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative rounded-3xl p-8 border-2 transition-all duration-300 ${
                  plan.popular
                    ? "border-primary bg-gradient-to-br from-slate-50 to-blue-50 shadow-glow scale-105"
                    : "border-border/50 bg-white hover:shadow-glow hover:-translate-y-2"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
                      <Star className="w-4 h-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-display font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gradient">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-green-600 mb-3">What's Included:</h4>
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.notIncluded.length > 0 && (
                    <>
                      <h4 className="font-semibold text-red-600 mb-3 mt-6">Not Included:</h4>
                      {plan.notIncluded.map((feature) => (
                        <div key={feature} className="flex items-center space-x-3">
                          <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <Link href={plan.name === "Enterprise" ? "/contact" : "/contact"}>
                  <motion.button
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      plan.popular
                        ? "bg-gradient text-white shadow-glow"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {plan.cta}
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
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
              Enhance your logistics operations with our premium add-on services. 
              Mix and match to create the perfect solution for your business.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {addOns.map((addon, index) => (
              <motion.div
                key={addon.name}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-border/50 hover:shadow-glow hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <addon.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {addon.name}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {addon.description}
                </p>
                
                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-gradient">{addon.price}</span>
                  <span className="text-muted-foreground">{addon.period}</span>
                </div>
                
                <Link href="/contact">
                  <motion.button
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add Service
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
              Frequently Asked{" "}
              <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get answers to common questions about our pricing and services.
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
                className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-border/50 hover:shadow-glow transition-all duration-300"
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
              Choose your plan and start optimizing your logistics operations today. 
              Our team is ready to help you get started.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <motion.button
                  className="px-8 py-4 bg-gradient text-white rounded-lg font-semibold text-lg shadow-glow-orange flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              
              <Link href="/contact">
                <motion.button
                  className="px-8 py-4 border-2 border-white/30 text-white rounded-lg font-semibold text-lg backdrop-blur-custom hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Sales Team
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
