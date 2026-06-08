"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Calendar,
  User,
} from "lucide-react";
import { TrackingLiveSection } from "./TrackingLiveSection";

export default function TrackingPage() {
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
              Track Your{" "}
              Shipment
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Get real-time updates on your shipments with our advanced tracking system. 
              Know exactly where your cargo is at every step of the journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tracking Tool — DB + map + Realtime */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-platinum-off rounded-2xl p-8 border border-border/50"
            >
              <h2 className="text-3xl font-display font-bold mb-2 text-center">
                Track Your Package
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Live map when a driver is sharing GPS · milestones always available
              </p>
              <TrackingLiveSection />
              <p className="text-xs text-muted-foreground text-center mt-6">
                Demo: seed tracking <span className="font-mono">SC001234567</span> from Superadmin, then
                assign a driver and start GPS sharing.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-platinum-off">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Advanced{" "}
              Tracking Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our tracking system provides comprehensive visibility into your shipments 
              with real-time updates and detailed progress information.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Real-time Updates",
                description: "Get instant notifications about your shipment status and location changes"
              },
              {
                icon: MapPin,
                title: "Location Tracking",
                description: "See exactly where your package is with precise GPS coordinates and location data"
              },
              {
                icon: CheckCircle,
                title: "Status Monitoring",
                description: "Track every step of your shipment from pickup to final delivery"
              },
              {
                icon: AlertCircle,
                title: "Exception Alerts",
                description: "Receive immediate notifications about any delays or issues with your shipment"
              },
              {
                icon: Calendar,
                title: "Delivery Estimates",
                description: "Get accurate delivery time estimates based on current location and route"
              },
              {
                icon: User,
                title: "Recipient Updates",
                description: "Keep recipients informed with automatic delivery status updates"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-16 h-16 icon-tile rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 group-hover:text-graphite-dark transition-colors">
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
              Need to{" "}
              Ship Something?
            </h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Get a free quote and start shipping with SwiftCargo today. 
              Our tracking system will keep you informed every step of the way.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="btn-cta"
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
                Contact Sales
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
