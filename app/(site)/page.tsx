"use client";

import { motion } from "framer-motion";
import { 
  Truck, 
  Plane, 
  Ship, 
  Train, 
  Package,
  Zap,
  Check,
  ArrowRight,
  Award,
  Users,
  Star,
  Globe,
  Search,
  Calculator,
  MapPin,
  // Calendar,
  // Weight,
  // Ruler
  Shield
} from "lucide-react";
import { useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { Section } from "@/components/Section";
import { IconTile, iconToneAt } from "@/components/IconTile";
import { StatDisplay } from "@/components/StatDisplay";
import { FeatureCard } from "@/components/FeatureCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { FaqSection } from "@/components/FaqSection";

export default function Home() {
  const [activeTab, setActiveTab] = useState("tracking");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [pickupDetails, setPickupDetails] = useState({
    name: "",
    email: "",
    phone: "",
    pickupAddress: "",
    pickupDate: "",
    packageType: "",
    weight: "",
    dimensions: ""
  });
  const [estimatorDetails, setEstimatorDetails] = useState({
    origin: "",
    destination: "",
    packageType: "",
    weight: "",
    dimensions: "",
    serviceType: "air"
  });

  const handleTrackingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      window.location.href = `/tracking?number=${encodeURIComponent(trackingNumber)}`;
    }
  };

  const handlePickupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/pickup?${new URLSearchParams(pickupDetails).toString()}`;
  };

  const handleEstimatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/estimator?${new URLSearchParams(estimatorDetails).toString()}`;
  };

  return (
    <div className="min-h-screen relative bg-background overflow-hidden">
      {/* Hero — navy trust band, single primary CTA */}
      <section className="section-navy section-py-lg pt-32 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <p className="type-eyebrow text-platinum-mid">
                Enterprise logistics · 50K+ businesses
              </p>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-white max-w-xl">
                Your logistics partner for{" "}
                <span className="text-accent">global scale</span>
              </h1>
              
              <p className="text-lg text-platinum-mid leading-relaxed max-w-lg">
                SwiftCargo delivers innovative logistics solutions that connect businesses globally. From air freight to sea cargo, we ensure your shipments reach their destination safely and on time.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <motion.button
                  className="btn-cta"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Get Started Today
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  className="btn-ghost-light"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Watch Demo
                </motion.button>
              </div>

              {/* <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 max-w-lg">
                {[
                  { number: "25+", label: "Years" },
                  { number: "150+", label: "Countries" },
                  { number: "50K+", label: "Clients" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
                  >
                    <StatDisplay value={stat.number} label={stat.label} variant="dark" />
                  </motion.div>
                ))}
              </div> */}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <div className="w-full min-h-[480px] bg-graphite-mid/80 border border-white/10 rounded-2xl p-6 flex flex-col justify-between text-white font-mono shadow-[0_24px_48px_rgba(0,0,0,0.35)]">
                  {/* Terminal Header */}
                  <div className="flex items-center justify-between border-b border-graphite-light/20 pb-4">
                    <div className="flex space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="text-[10px] text-platinum-mid font-sans font-semibold tracking-wide">SWIFTCARGO OPS TERMINAL v4.2</div>
                    <div className="w-2.5 h-2.5 rounded-full bg-sage-light"></div>
                  </div>
                  
                  {/* Terminal Content / Telemetry */}
                  <div className="flex-1 py-6 space-y-4 overflow-hidden text-xs">
                    <div className="space-y-1">
                      <p className="text-sage-light font-semibold">[OK] SYSTEM INITIALIZATION SECURE</p>
                      <p className="text-platinum-mid">LATENCY: 14ms | BANDWIDTH: 1.2 GB/s | SECURE TLS</p>
                    </div>
                    <div className="space-y-1.5 pt-2">
                      <p className="text-platinum-light font-semibold">[TRANSIT STATUS] ACTIVE SHIPMENTS</p>
                      <div className="grid grid-cols-3 gap-2 text-[10px] text-platinum-light bg-graphite-mid/50 border border-graphite-light/20 p-2.5 rounded-lg">
                        <div>
                          <p className="text-platinum-mid font-sans">FLIGHT SC-092</p>
                          <p className="font-bold text-white">ATL ➔ FRA</p>
                          <p className="text-platinum-light mt-0.5 font-bold">IN AIR</p>
                        </div>
                        <div>
                          <p className="text-platinum-mid font-sans">VESSEL SV-402</p>
                          <p className="font-bold text-white">SGP ➔ RTM</p>
                          <p className="text-sage-light mt-0.5 font-bold">ARRIVED</p>
                        </div>
                        <div>
                          <p className="text-platinum-mid font-sans">FREIGHT FR-882</p>
                          <p className="font-bold text-white">ORD ➔ LAX</p>
                          <p className="text-amber-light mt-0.5 font-bold">ROUTING</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5 pt-2">
                      <p className="text-platinum-light font-semibold">&gt; Tracking Telemetry Stream active...</p>
                      <div className="h-28 bg-graphite-mid/30 rounded border border-graphite-light/10 relative overflow-hidden flex items-end p-1">
                        <div className="flex w-full items-end gap-1 h-full px-2">
                          {[40, 60, 45, 80, 55, 70, 95, 60, 40, 55, 75, 85, 90, 70, 65, 80, 95, 100, 60, 75, 90].map((h, i) => (
                            <motion.div
                              key={i}
                              className="bg-ember-main/40 w-full rounded-t-sm"
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", delay: i * 0.04 }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Terminal Footer */}
                  <div className="border-t border-graphite-light/20 pt-4 flex items-center justify-between text-[10px] text-platinum-mid">
                    <div>SECURE NODE: SW-8820-X</div>
                    <div>LOC: GLOBAL WEB NET</div>
                  </div>
                </div>
                
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Services — conversion focus on white */}
      <Section id="services" tone="muted">
        <div id="tracking" className="hidden"></div>
        <div id="pickup" className="hidden"></div>
        <div id="estimator" className="hidden"></div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <SectionHeading
            eyebrow="Self-service tools"
            title="Quick Services"
            subtitle="Access all our essential logistics services in one place. Track shipments, schedule pickups, and get instant estimates with our integrated tools."
          />
        </motion.div>

        <div className="max-w-4xl mx-auto card-calm !p-0 overflow-hidden">
          <div className="flex border-b border-platinum-light bg-platinum-off/50">
            {[
              { id: "tracking", label: "Track", icon: Search },
              { id: "pickup", label: "Pickup", icon: MapPin },
              { id: "estimator", label: "Estimate", icon: Calculator },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-white text-graphite-dark border-b-2 border-ember-main"
                    : "text-platinum-dark hover:text-graphite-mid"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8 sm:p-10">
                {/* Tracking Tab */}
                {activeTab === "tracking" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center space-y-3 mb-8">
                      <h3 className="type-card-title text-xl">Track your shipment</h3>
                      <p className="type-card-body text-sm max-w-md mx-auto">
                        Real-time status with your tracking number.
                      </p>
                    </div>
                    
                    <form onSubmit={handleTrackingSubmit} className="max-w-md mx-auto space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="tracking" className="block text-sm font-medium text-graphite-mid">
                          Tracking Number
                        </label>
                        <input
                          type="text"
                          id="tracking"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="e.g. SC-123456"
                          className="input-field"
                          required
                        />
                      </div>
                      <button type="submit" className="btn-cta btn-cta-sm w-full">
                        Track Shipment
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* Pickup Tab */}
                {activeTab === "pickup" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center space-y-3 mb-8">
                      <h3 className="type-card-title text-xl">Schedule a pickup</h3>
                      <p className="type-card-body text-sm max-w-md mx-auto">
                        We&apos;ll confirm within 2 hours.
                      </p>
                    </div>
                    
                    <form onSubmit={handlePickupSubmit} className="max-w-2xl mx-auto space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="block text-sm font-medium text-graphite-mid">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={pickupDetails.name}
                            onChange={(e) => setPickupDetails({...pickupDetails, name: e.target.value})}
                            placeholder="Enter your full name"
                            className="input-field"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="block text-sm font-medium text-graphite-mid">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={pickupDetails.email}
                            onChange={(e) => setPickupDetails({...pickupDetails, email: e.target.value})}
                            placeholder="Enter your email"
                            className="input-field"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="phone" className="block text-sm font-medium text-graphite-mid">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            value={pickupDetails.phone}
                            onChange={(e) => setPickupDetails({...pickupDetails, phone: e.target.value})}
                            placeholder="Enter your phone number"
                            className="input-field"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="pickupDate" className="block text-sm font-medium text-graphite-mid">
                            Preferred Pickup Date *
                          </label>
                          <input
                            type="date"
                            id="pickupDate"
                            value={pickupDetails.pickupDate}
                            onChange={(e) => setPickupDetails({...pickupDetails, pickupDate: e.target.value})}
                            className="input-field"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="pickupAddress" className="block text-sm font-medium text-graphite-mid">
                          Pickup Address *
                        </label>
                        <textarea
                          id="pickupAddress"
                          value={pickupDetails.pickupAddress}
                          onChange={(e) => setPickupDetails({...pickupDetails, pickupAddress: e.target.value})}
                          placeholder="Enter your complete pickup address"
                          rows={3}
                          className="input-field"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="packageType" className="block text-sm font-medium text-graphite-mid">
                            Package Type
                          </label>
                          <select
                            id="packageType"
                            value={pickupDetails.packageType}
                            onChange={(e) => setPickupDetails({...pickupDetails, packageType: e.target.value})}
                            className="input-field"
                          >
                            <option value="">Select package type</option>
                            <option value="document">Document</option>
                            <option value="parcel">Parcel</option>
                            <option value="fragile">Fragile</option>
                            <option value="heavy">Heavy</option>
                            <option value="bulk">Bulk</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="weight" className="block text-sm font-medium text-graphite-mid">
                            Weight (kg)
                          </label>
                          <input
                            type="number"
                            id="weight"
                            value={pickupDetails.weight}
                            onChange={(e) => setPickupDetails({...pickupDetails, weight: e.target.value})}
                            placeholder="0.0"
                            step="0.1"
                            className="input-field"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="dimensions" className="block text-sm font-medium text-graphite-mid">
                            Dimensions (cm)
                          </label>
                          <input
                            type="text"
                            id="dimensions"
                            value={pickupDetails.dimensions}
                            onChange={(e) => setPickupDetails({...pickupDetails, dimensions: e.target.value})}
                            placeholder="L x W x H"
                            className="input-field"
                          />
                        </div>
                      </div>

                      <button type="submit" className="btn-cta btn-cta-sm w-full">
                        Schedule Pickup
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* Estimator Tab */}
                {activeTab === "estimator" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center space-y-3 mb-8">
                      <h3 className="type-card-title text-xl">Get an instant estimate</h3>
                      <p className="type-card-body text-sm max-w-md mx-auto">
                        Accurate pricing for air, sea, and road freight.
                      </p>
                    </div>
                    
                    <form onSubmit={handleEstimatorSubmit} className="max-w-2xl mx-auto space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="origin" className="block text-sm font-medium text-graphite-mid">
                            Origin *
                          </label>
                          <input
                            type="text"
                            id="origin"
                            value={estimatorDetails.origin}
                            onChange={(e) => setEstimatorDetails({...estimatorDetails, origin: e.target.value})}
                            placeholder="Enter origin city/country"
                            className="input-field"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="destination" className="block text-sm font-medium text-graphite-mid">
                            Destination *
                          </label>
                          <input
                            type="text"
                            id="destination"
                            value={estimatorDetails.destination}
                            onChange={(e) => setEstimatorDetails({...estimatorDetails, destination: e.target.value})}
                            placeholder="Enter destination city/country"
                            className="input-field"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="packageTypeEst" className="block text-sm font-medium text-graphite-mid">
                            Package Type
                          </label>
                          <select
                            id="packageTypeEst"
                            value={estimatorDetails.packageType}
                            onChange={(e) => setEstimatorDetails({...estimatorDetails, packageType: e.target.value})}
                            className="input-field"
                          >
                            <option value="">Select package type</option>
                            <option value="document">Document</option>
                            <option value="parcel">Parcel</option>
                            <option value="fragile">Fragile</option>
                            <option value="heavy">Heavy</option>
                            <option value="bulk">Bulk</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="weightEst" className="block text-sm font-medium text-graphite-mid">
                            Weight (kg) *
                          </label>
                          <input
                            type="number"
                            id="weightEst"
                            value={estimatorDetails.weight}
                            onChange={(e) => setEstimatorDetails({...estimatorDetails, weight: e.target.value})}
                            placeholder="0.0"
                            step="0.1"
                            className="input-field"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="dimensionsEst" className="block text-sm font-medium text-graphite-mid">
                            Dimensions (cm)
                          </label>
                          <input
                            type="text"
                            id="dimensionsEst"
                            value={estimatorDetails.dimensions}
                            onChange={(e) => setEstimatorDetails({...estimatorDetails, dimensions: e.target.value})}
                            placeholder="L x W x H"
                            className="input-field"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="serviceType" className="block text-sm font-medium text-graphite-mid">
                          Service Type *
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: "air", label: "Air Freight", icon: Plane },
                            { value: "sea", label: "Sea Freight", icon: Ship },
                            { value: "road", label: "Road Freight", icon: Truck }
                          ].map((service) => (
                            <label
                              key={service.value}
                              className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                                estimatorDetails.serviceType === service.value
                                  ? "border-graphite-dark bg-platinum-off text-graphite-dark ring-1 ring-graphite-dark/10"
                                  : "border-platinum-light hover:border-graphite-mid/40 text-platinum-dark hover:bg-platinum-off"
                              }`}
                            >
                              <input
                                type="radio"
                                name="serviceType"
                                value={service.value}
                                checked={estimatorDetails.serviceType === service.value}
                                onChange={(e) => setEstimatorDetails({...estimatorDetails, serviceType: e.target.value})}
                                className="sr-only"
                              />
                              <service.icon className="w-6 h-6 mb-2" />
                              <span className="text-sm font-medium text-center">{service.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <button type="submit" className="btn-cta btn-cta-sm w-full">
                        Get Estimate
                      </button>
                    </form>
                  </motion.div>
                )}
              </div>
        </div>
      </Section>

      {/* Services */}
      <Section id="services-detailed" tone="white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <SectionHeading
            eyebrow="What we offer"
            title="Comprehensive Logistics Solutions"
            subtitle="End-to-end freight services with the clarity enterprise teams expect."
          />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: "air-freight",
                icon: Plane,
                title: "Air Freight",
                description: "Express worldwide air cargo services with real-time tracking and customs clearance.",
                features: ["24/7 Monitoring", "Customs Clearance", "Real-time Tracking", "Insurance Coverage"]
              },
              {
                id: "sea-freight",
                icon: Ship,
                title: "Sea Freight",
                description: "Cost-effective ocean freight solutions for large shipments and bulk cargo.",
                features: ["Bulk Capacity", "Cost-effective", "Global Reach", "Warehousing"]
              },
              {
                id: "road-freight",
                icon: Truck,
                title: "Road Freight",
                description: "Reliable ground transportation with door-to-door delivery across continents.",
                features: ["Door-to-Door", "Flexible Routes", "High Capacity", "Regional Coverage"]
              },
              {
                id: "rail-freight",
                icon: Train,
                title: "Rail Freight",
                description: "Efficient rail solutions for cross-continental and regional cargo transport.",
                features: ["High Volume", "Eco-friendly", "Reliable Schedule", "Cost-effective"]
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <FeatureCard
                  id={`${service.id}-detailed`}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  features={service.features}
                  index={index}
                  href="#"
                />
              </motion.div>
            ))}
        </div>
      </Section>

      {/* Stats — light trust band */}
      <Section tone="muted">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <SectionHeading
            eyebrow="By the numbers"
            title="Built on measurable reliability"
            subtitle="Proof points that matter to operations teams not vanity metrics."
          />
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { number: "25+", label: "Years of excellence", icon: Award },
            { number: "150+", label: "Countries served", icon: Globe },
            { number: "50K+", label: "Business clients", icon: Users },
            { number: "99.8%", label: "On-time success", icon: Star },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="card-calm text-center !py-10"
            >
              <IconTile
                icon={stat.icon}
                tone={iconToneAt(index)}
                size="md"
                className="mx-auto mb-6"
              />
              <StatDisplay
                value={stat.number}
                label={stat.label}
                variant="card"
                align="center"
              />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Conversion CTA — navy, one primary action */}
      <Section tone="navy" className="!section-py">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <SectionHeading
            variant="dark"
            size="large"
            title="Ready for a clearer logistics stack?"
            subtitle="Get a tailored quote in minutes. One conversation with our team is all it takes to map your freight needs."
          />
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              className="btn-cta"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.99 }}
            >
              Get Your Free Quote
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              className="btn-ghost-light"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Schedule a Demo
            </motion.button>
          </div>
        </motion.div>
      </Section>

      {/* Testimonials */}
      <Section id="testimonials" tone="white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <SectionHeading
            eyebrow="Testimonials"
            title="Trusted by operations leaders"
            subtitle="Structured feedback from teams who run freight at scale."
          />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                company: "TechFlow Solutions",
                role: "Operations Director",
                content: "SwiftCargo transformed our supply chain. Their real-time tracking and proactive communication reduced our delivery delays by 40%.",
                rating: 5,
                avatar: "SJ"
              },
              {
                name: "Michael Chen",
                company: "Global Retail Co.",
                role: "Logistics Manager",
                content: "The cost savings we've achieved with SwiftCargo's sea freight solutions are incredible. Professional service every time.",
                rating: 5,
                avatar: "MC"
              },
              {
                name: "Emma Rodriguez",
                company: "PharmaCare Inc.",
                role: "Supply Chain VP",
                content: "Handling pharmaceutical shipments requires precision. SwiftCargo's temperature-controlled solutions give us complete peace of mind.",
                rating: 5,
                avatar: "ER"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <TestimonialCard {...testimonial} />
              </motion.div>
            ))}
        </div>
      </Section>

      <Section id="why-choose-us" tone="muted">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <SectionHeading
            eyebrow="Our difference"
            title="Why teams choose SwiftCargo"
            subtitle="Technology and expertise without the visual noise."
          />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Unmatched Security",
                description: "Advanced tracking, insurance coverage, and secure handling protocols ensure your cargo is always protected."
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Express services and optimized routes get your shipments to their destination faster than ever before."
              },
              {
                icon: Globe,
                title: "Global Reach",
                description: "150+ countries served with local expertise and compliance knowledge in every region."
              },
              {
                icon: Users,
                title: "Expert Team",
                description: "25+ years of experience with dedicated specialists for every aspect of your logistics needs."
              },
              {
                icon: Check,
                title: "Proven Reliability",
                description: "99.8% success rate with backup plans and contingency strategies for every shipment."
              },
              {
                icon: Award,
                title: "Industry Recognition",
                description: "Multiple awards for service excellence, innovation, and customer satisfaction."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-calm"
              >
                <IconTile icon={feature.icon} tone={iconToneAt(index)} className="mb-6" />
                <h3 className="type-card-title mb-3">{feature.title}</h3>
                <p className="type-card-body">{feature.description}</p>
              </motion.div>
            ))}
        </div>
      </Section>

      <Section id="solutions" tone="white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <SectionHeading
            eyebrow="Industries"
            title="Industry-specific solutions"
            subtitle="Compliance-ready programs for regulated and high-volume verticals."
          />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: "ecommerce-retail",
                icon: Package,
                title: "E-commerce & Retail",
                description: "Fast fulfillment, returns management, and last-mile delivery solutions for online businesses.",
                features: ["Same-day delivery", "Returns processing", "Inventory management"]
              },
              {
                id: "healthcare-pharma",
                icon: Shield,
                title: "Healthcare & Pharma",
                description: "Temperature-controlled shipping, compliance, and secure handling for medical supplies.",
                features: ["Cold chain logistics", "Regulatory compliance", "Secure handling"]
              },
              {
                id: "automotive-manufacturing",
                icon: Truck,
                title: "Automotive & Manufacturing",
                description: "Just-in-time delivery, parts management, and supply chain optimization.",
                features: ["JIT delivery", "Parts management", "Supply chain optimization"]
              },
              {
                id: "fashion-apparel",
                icon: Package,
                title: "Fashion & Apparel",
                description: "Seasonal shipping, quality control, and fast fashion logistics solutions.",
                features: ["Seasonal shipping", "Quality control", "Fast fashion logistics"]
              },
              {
                id: "food-beverages",
                icon: Package,
                title: "Food & Beverages",
                description: "Perishable goods handling, food safety compliance, and cold storage solutions.",
                features: ["Perishable handling", "Food safety", "Cold storage"]
              },
              {
                id: "technology-electronics",
                icon: Globe,
                title: "Technology & Electronics",
                description: "Sensitive equipment handling, anti-static packaging, and secure tech logistics.",
                features: ["Sensitive handling", "Anti-static packaging", "Secure logistics"]
              }
            ].map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div id={solution.id} className="bg-platinum-off rounded-2xl p-8 border border-border/50 hover:border-graphite-mid/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <IconTile
                    icon={solution.icon}
                    tone={iconToneAt(index)}
                    className="mb-6 group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  <h3 className="type-card-title mb-3">{solution.title}</h3>
                  
                  <p className="type-card-body mb-6">{solution.description}</p>
                  
                  <ul className="space-y-2">
                    {solution.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-2 text-sm text-platinum-dark">
                        <Check className="w-4 h-4 text-sage-main flex-shrink-0" />
                        <span>{feature}</span>
                  </li>
                ))}
              </ul>
                  
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <button className="type-link flex items-center space-x-2 group-hover:translate-x-1 transition-all">
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
            </div>
                </div>
              </motion.div>
            ))}
        </div>
      </Section>

      <Section id="technology" tone="muted">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <SectionHeading
            eyebrow="Innovation"
            title="Technology that stays out of the way"
            subtitle="AI, IoT, and secure data layers so your team sees what matters, when it matters."
          />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {[
                {
                  icon: Zap,
                  title: "AI-Powered Optimization",
                  description: "Machine learning algorithms optimize routes, predict delays, and suggest cost-saving alternatives in real-time."
                },
                {
                  icon: Globe,
                  title: "IoT Tracking Network",
                  description: "Connected sensors provide real-time location, temperature, humidity, and security status updates."
                },
                {
                  icon: Shield,
                  title: "Blockchain Security",
                  description: "Immutable records ensure transparency, traceability, and fraud prevention across the supply chain."
                },
                {
                  icon: Users,
                  title: "Mobile-First Platform",
                  description: "Access your shipments, track deliveries, and manage logistics from anywhere with our mobile app."
                }
              ].map((tech, index) => (
                <motion.div
                  key={tech.title}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <IconTile icon={tech.icon} tone={iconToneAt(index)} size="sm" />
            <div>
                    <h3 className="type-card-title text-lg mb-2">{tech.title}</h3>
                    <p className="type-card-body text-sm">{tech.description}</p>
                </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="w-full min-h-[420px] rounded-2xl border border-platinum-light bg-white flex items-center justify-center">
                <div className="text-center space-y-4 px-8">
                  <div className="size-24 rounded-2xl bg-platinum-off border border-platinum-light flex items-center justify-center mx-auto">
                    <Package className="w-12 h-12 text-graphite-mid" />
                  </div>
                  <p className="type-card-title">Smart logistics platform</p>
                  <p className="text-sm text-platinum-dark">AI · IoT · Secure chain of custody</p>
                </div>
              </div>
            </motion.div>
          </div>
      </Section>

      <Section id="global-network" tone="white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <SectionHeading
            eyebrow="Worldwide reach"
            title="Global network"
            subtitle="Local expertise in 150+ countries one standard of service."
          />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                region: "North America",
                countries: "USA, Canada, Mexico",
                offices: "25+ Offices",
                icon: Globe
              },
              {
                region: "Europe",
                countries: "UK, Germany, France, Italy",
                offices: "40+ Offices",
                icon: Globe
              },
              {
                region: "Asia Pacific",
                countries: "China, Japan, India, Australia",
                offices: "35+ Offices",
                icon: Globe
              },
              {
                region: "Rest of World",
                countries: "Africa, South America, Middle East",
                offices: "50+ Offices",
                icon: Globe
              }
            ].map((region, index) => (
              <motion.div
                key={region.region}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <IconTile
                  icon={region.icon}
                  tone={iconToneAt(index)}
                  size="lg"
                  className="mx-auto mb-6 group-hover:scale-105 transition-transform duration-300"
                />
                <h3 className="type-card-title mb-2">{region.region}</h3>
                <p className="text-platinum-dark mb-1 text-sm">{region.countries}</p>
                <p className="text-sm text-platinum-mid font-medium">{region.offices}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center space-x-2 bg-platinum-off border border-platinum-light text-graphite-mid px-6 py-3 rounded-full">
              <Globe className="w-5 h-5" />
              <span className="font-medium">150+ Countries • 24/7 Support • Local Expertise</span>
        </div>
        </motion.div>
      </Section>

      <Section id="faq" tone="muted">
        <FaqSection
          items={[
            {
              question: "How long does international shipping take?",
              answer:
                "Air freight typically takes 2–5 days, sea freight 15–30 days, and road freight 3–7 days. Express options are available for urgent lanes.",
            },
            {
              question: "Do you provide insurance for shipments?",
              answer:
                "Yes. Standard coverage applies up to $100 per kg, with additional protection for high-value cargo.",
            },
            {
              question: "What documents do I need for international shipping?",
              answer:
                "You'll need a commercial invoice, packing list, and any country-specific customs forms. Our team guides you through each requirement.",
            },
            {
              question: "Can you handle temperature-sensitive shipments?",
              answer:
                "We run cold-chain programs for pharma, food, and perishables with continuous monitoring and exception alerts.",
            },
            {
              question: "How do I track my shipment?",
              answer:
                "Use your tracking number in Quick Services above, or via email/SMS updates through the journey.",
            },
            {
              question: "What if my shipment is delayed?",
              answer:
                "We monitor proactively and notify you immediately, with contingency routing handled by our 24/7 operations desk.",
            },
          ]}
        />
      </Section>

      <Section id="resources" tone="white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <SectionHeading
            eyebrow="Resources"
            title="Latest news & updates"
            subtitle="Industry insights and company announcements no fluff."
          />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "New AI-Powered Route Optimization",
                excerpt: "Our latest AI algorithms reduce delivery times by up to 25% while cutting costs by 15%.",
                date: "Jan 15, 2024",
                category: "Technology",
                readTime: "3 min read"
              },
              {
                title: "Expanding to 5 New Countries",
                excerpt: "SwiftCargo is proud to announce expansion into emerging markets across Africa and Asia.",
                date: "Jan 12, 2024",
                category: "Company News",
                readTime: "2 min read"
              },
              {
                title: "Sustainability in Logistics: 2024 Trends",
                excerpt: "Discover how green logistics practices are reshaping the industry and reducing carbon footprints.",
                date: "Jan 10, 2024",
                category: "Industry Insights",
                readTime: "5 min read"
              }
            ].map((article, index) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="card-calm hover:!shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-graphite-mid font-medium">{article.category}</span>
                    <span className="text-sm text-muted-foreground">{article.readTime}</span>
                  </div>
                  
                  <h3 className="type-card-title mb-3 leading-tight">{article.title}</h3>
                  
                  <p className="type-card-body mb-6">{article.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-platinum-mid">{article.date}</span>
                    <button className="type-link flex items-center space-x-2 group-hover:translate-x-1 transition-all">
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <button className="btn-secondary bg-white">
              View All Articles
            </button>
        </motion.div>
      </Section>
    </div>
  );
}
