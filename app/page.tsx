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
} from "lucide-react";
import Header from "@/components/Header";
import { useState } from "react";

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
    <div className="min-h-screen relative bg-background">
      <Header />
      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-custom rounded-full px-4 py-2 text-sm">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Trusted by 50K+ businesses worldwide</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight">
                Your Logistics Partner of the{" "}
                <span className="text-gradient">Future</span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed max-w-lg">
                SwiftCargo delivers innovative logistics solutions that connect businesses globally. 
                From air freight to sea cargo, we ensure your shipments reach their destination 
                safely and on time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
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
                  Watch Demo
                </motion.button>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                {[
                  { number: "25+", label: "Years Experience" },
                  { number: "150+", label: "Countries Served" },
                  { number: "50K+", label: "Happy Clients" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-gradient">{stat.number}</div>
                    <div className="text-white/70 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <div className="w-full h-[600px] bg-gradient-to-br from-blue-500/20 to-orange-500/20 rounded-2xl backdrop-blur-custom border border-white/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto animate-float">
                        <Package className="w-16 h-16 text-white" />
                      </div>
                      <div className="text-white/80 text-lg">Interactive Logistics Dashboard</div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-orange-500/20 rounded-full animate-float-delayed"></div>
                <div className="absolute bottom-20 right-10 w-16 h-16 bg-blue-500/20 rounded-full animate-float-slow"></div>
                <div className="absolute top-1/2 right-20 w-12 h-12 bg-yellow-500/20 rounded-full animate-float"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Services Section */}
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
              Quick{" "}
              <span className="text-gradient">Services</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Access all our essential logistics services in one place. Track shipments, 
              schedule pickups, and get instant estimates with our integrated tools.
            </p>
          </motion.div>

          {/* Service Tabs */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-border/20 overflow-hidden">
              {/* Tab Headers */}
              <div className="flex border-b border-border/20">
                {[
                  { id: "tracking", label: "Track Shipment", icon: Search },
                  { id: "pickup", label: "Schedule Pickup", icon: MapPin },
                  { id: "estimator", label: "Get Estimate", icon: Calculator }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-3 py-6 px-8 transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-slate-50"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-semibold">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {/* Tracking Tab */}
                {activeTab === "tracking" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient/10 rounded-2xl flex items-center justify-center mx-auto">
                        <Search className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">Track Your Shipment</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Enter your tracking number to get real-time updates on your shipment&apos;s location and status.
                      </p>
                    </div>
                    
                    <form onSubmit={handleTrackingSubmit} className="max-w-md mx-auto space-y-4">
                      <div>
                        <label htmlFor="tracking" className="block text-sm font-medium text-foreground mb-2">
                          Tracking Number
                        </label>
                        <input
                          type="text"
                          id="tracking"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="Enter your tracking number"
                          className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full px-6 py-3 bg-gradient text-white rounded-lg font-semibold shadow-glow hover:shadow-glow-orange transition-all duration-300 hover:scale-105"
                      >
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
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient/10 rounded-2xl flex items-center justify-center mx-auto">
                        <MapPin className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">Schedule a Pickup</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Fill out the form below to schedule a pickup from your location. We&apos;ll confirm within 2 hours.
                      </p>
                    </div>
                    
                    <form onSubmit={handlePickupSubmit} className="max-w-2xl mx-auto space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={pickupDetails.name}
                            onChange={(e) => setPickupDetails({...pickupDetails, name: e.target.value})}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={pickupDetails.email}
                            onChange={(e) => setPickupDetails({...pickupDetails, email: e.target.value})}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            value={pickupDetails.phone}
                            onChange={(e) => setPickupDetails({...pickupDetails, phone: e.target.value})}
                            placeholder="Enter your phone number"
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="pickupDate" className="block text-sm font-medium text-foreground mb-2">
                            Preferred Pickup Date *
                          </label>
                          <input
                            type="date"
                            id="pickupDate"
                            value={pickupDetails.pickupDate}
                            onChange={(e) => setPickupDetails({...pickupDetails, pickupDate: e.target.value})}
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="pickupAddress" className="block text-sm font-medium text-foreground mb-2">
                          Pickup Address *
                        </label>
                        <textarea
                          id="pickupAddress"
                          value={pickupDetails.pickupAddress}
                          onChange={(e) => setPickupDetails({...pickupDetails, pickupAddress: e.target.value})}
                          placeholder="Enter your complete pickup address"
                          rows={3}
                          className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="packageType" className="block text-sm font-medium text-foreground mb-2">
                            Package Type
                          </label>
                          <select
                            id="packageType"
                            value={pickupDetails.packageType}
                            onChange={(e) => setPickupDetails({...pickupDetails, packageType: e.target.value})}
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          >
                            <option value="">Select package type</option>
                            <option value="document">Document</option>
                            <option value="parcel">Parcel</option>
                            <option value="fragile">Fragile</option>
                            <option value="heavy">Heavy</option>
                            <option value="bulk">Bulk</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="weight" className="block text-sm font-medium text-foreground mb-2">
                            Weight (kg)
                          </label>
                          <input
                            type="number"
                            id="weight"
                            value={pickupDetails.weight}
                            onChange={(e) => setPickupDetails({...pickupDetails, weight: e.target.value})}
                            placeholder="0.0"
                            step="0.1"
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          />
                        </div>
                        <div>
                          <label htmlFor="dimensions" className="block text-sm font-medium text-foreground mb-2">
                            Dimensions (cm)
                          </label>
                          <input
                            type="text"
                            id="dimensions"
                            value={pickupDetails.dimensions}
                            onChange={(e) => setPickupDetails({...pickupDetails, dimensions: e.target.value})}
                            placeholder="L x W x H"
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full px-6 py-3 bg-gradient text-white rounded-lg font-semibold shadow-glow hover:shadow-glow-orange transition-all duration-300 hover:scale-105"
                      >
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
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient/10 rounded-2xl flex items-center justify-center mx-auto">
                        <Calculator className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">Get Instant Estimate</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Calculate shipping costs instantly with our advanced pricing calculator. 
                        Get accurate estimates for all our services.
                      </p>
                    </div>
                    
                    <form onSubmit={handleEstimatorSubmit} className="max-w-2xl mx-auto space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="origin" className="block text-sm font-medium text-foreground mb-2">
                            Origin *
                          </label>
                          <input
                            type="text"
                            id="origin"
                            value={estimatorDetails.origin}
                            onChange={(e) => setEstimatorDetails({...estimatorDetails, origin: e.target.value})}
                            placeholder="Enter origin city/country"
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="destination" className="block text-sm font-medium text-foreground mb-2">
                            Destination *
                          </label>
                          <input
                            type="text"
                            id="destination"
                            value={estimatorDetails.destination}
                            onChange={(e) => setEstimatorDetails({...estimatorDetails, destination: e.target.value})}
                            placeholder="Enter destination city/country"
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="packageTypeEst" className="block text-sm font-medium text-foreground mb-2">
                            Package Type
                          </label>
                          <select
                            id="packageTypeEst"
                            value={estimatorDetails.packageType}
                            onChange={(e) => setEstimatorDetails({...estimatorDetails, packageType: e.target.value})}
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          >
                            <option value="">Select package type</option>
                            <option value="document">Document</option>
                            <option value="parcel">Parcel</option>
                            <option value="fragile">Fragile</option>
                            <option value="heavy">Heavy</option>
                            <option value="bulk">Bulk</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="weightEst" className="block text-sm font-medium text-foreground mb-2">
                            Weight (kg) *
                          </label>
                          <input
                            type="number"
                            id="weightEst"
                            value={estimatorDetails.weight}
                            onChange={(e) => setEstimatorDetails({...estimatorDetails, weight: e.target.value})}
                            placeholder="0.0"
                            step="0.1"
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="dimensionsEst" className="block text-sm font-medium text-foreground mb-2">
                            Dimensions (cm)
                          </label>
                          <input
                            type="text"
                            id="dimensionsEst"
                            value={estimatorDetails.dimensions}
                            onChange={(e) => setEstimatorDetails({...estimatorDetails, dimensions: e.target.value})}
                            placeholder="L x W x H"
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="serviceType" className="block text-sm font-medium text-foreground mb-2">
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
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border/50 hover:border-primary/30 hover:bg-slate-50"
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

                      <button
                        type="submit"
                        className="w-full px-6 py-3 bg-gradient text-white rounded-lg font-semibold shadow-glow hover:shadow-glow-orange transition-all duration-300 hover:scale-105"
                      >
                        Get Estimate
                      </button>
                    </form>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services Section */}
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
              Quick{" "}
              <span className="text-gradient">Services</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Access all our essential logistics services in one place. Track shipments, 
              schedule pickups, and get instant estimates with our integrated tools.
            </p>
          </motion.div>

          {/* Service Tabs */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-border/20 overflow-hidden">
              {/* Tab Headers */}
              <div className="flex border-b border-border/20">
                {[
                  { id: "tracking", label: "Track Shipment", icon: Search },
                  { id: "pickup", label: "Schedule Pickup", icon: MapPin },
                  { id: "estimator", label: "Get Estimate", icon: Calculator }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-3 py-6 px-8 transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-slate-50"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-semibold">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {/* Tracking Tab */}
                {activeTab === "tracking" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient/10 rounded-2xl flex items-center justify-center mx-auto">
                        <Search className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">Track Your Shipment</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Enter your tracking number to get real-time updates on your shipment&apos;s location and status.
                      </p>
                    </div>
                    
                    <form onSubmit={handleTrackingSubmit} className="max-w-md mx-auto space-y-4">
                      <div>
                        <label htmlFor="tracking" className="block text-sm font-medium text-foreground mb-2">
                          Tracking Number
                        </label>
                        <input
                          type="text"
                          id="tracking"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="Enter your tracking number"
                          className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full px-6 py-3 bg-gradient text-white rounded-lg font-semibold shadow-glow hover:shadow-glow-orange transition-all duration-300 hover:scale-105"
                      >
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
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient/10 rounded-2xl flex items-center justify-center mx-auto">
                        <MapPin className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">Schedule a Pickup</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Fill out the form below to schedule a pickup from your location. We&apos;ll confirm within 2 hours.
                      </p>
                    </div>
                    
                    <form onSubmit={handlePickupSubmit} className="max-w-2xl mx-auto space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={pickupDetails.name}
                            onChange={(e) => setPickupDetails({...pickupDetails, name: e.target.value})}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={pickupDetails.email}
                            onChange={(e) => setPickupDetails({...pickupDetails, email: e.target.value})}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            value={pickupDetails.phone}
                            onChange={(e) => setPickupDetails({...pickupDetails, phone: e.target.value})}
                            placeholder="Enter your phone number"
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="pickupDate" className="block text-sm font-medium text-foreground mb-2">
                            Preferred Pickup Date *
                          </label>
                          <input
                            type="date"
                            id="pickupDate"
                            value={pickupDetails.pickupDate}
                            onChange={(e) => setPickupDetails({...pickupDetails, pickupDate: e.target.value})}
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="pickupAddress" className="block text-sm font-medium text-foreground mb-2">
                          Pickup Address *
                        </label>
                        <textarea
                          id="pickupAddress"
                          value={pickupDetails.pickupAddress}
                          onChange={(e) => setPickupDetails({...pickupDetails, pickupAddress: e.target.value})}
                          placeholder="Enter your complete pickup address"
                          rows={3}
                          className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="packageType" className="block text-sm font-medium text-foreground mb-2">
                            Package Type
                          </label>
                          <select
                            id="packageType"
                            value={pickupDetails.packageType}
                            onChange={(e) => setPickupDetails({...pickupDetails, packageType: e.target.value})}
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          >
                            <option value="">Select package type</option>
                            <option value="document">Document</option>
                            <option value="parcel">Parcel</option>
                            <option value="fragile">Fragile</option>
                            <option value="heavy">Heavy</option>
                            <option value="bulk">Bulk</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="weight" className="block text-sm font-medium text-foreground mb-2">
                            Weight (kg)
                          </label>
                          <input
                            type="number"
                            id="weight"
                            value={pickupDetails.weight}
                            onChange={(e) => setPickupDetails({...pickupDetails, weight: e.target.value})}
                            placeholder="0.0"
                            step="0.1"
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          />
                        </div>
                        <div>
                          <label htmlFor="dimensions" className="block text-sm font-medium text-foreground mb-2">
                            Dimensions (cm)
                          </label>
                          <input
                            type="text"
                            id="dimensions"
                            value={pickupDetails.dimensions}
                            onChange={(e) => setPickupDetails({...pickupDetails, dimensions: e.target.value})}
                            placeholder="L x W x H"
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full px-6 py-3 bg-gradient text-white rounded-lg font-semibold shadow-glow hover:shadow-glow-orange transition-all duration-300 hover:scale-105"
                      >
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
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient/10 rounded-2xl flex items-center justify-center mx-auto">
                        <Calculator className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">Get Instant Estimate</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Calculate shipping costs instantly with our advanced pricing calculator. 
                        Get accurate estimates for all our services.
                      </p>
                    </div>
                    
                    <form onSubmit={handleEstimatorSubmit} className="max-w-2xl mx-auto space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="origin" className="block text-sm font-medium text-foreground mb-2">
                            Origin *
                          </label>
                          <input
                            type="text"
                            id="origin"
                            value={estimatorDetails.origin}
                            onChange={(e) => setEstimatorDetails({...estimatorDetails, origin: e.target.value})}
                            placeholder="Enter origin city/country"
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="destination" className="block text-sm font-medium text-foreground mb-2">
                            Destination *
                          </label>
                          <input
                            type="text"
                            id="destination"
                            value={estimatorDetails.destination}
                            onChange={(e) => setEstimatorDetails({...estimatorDetails, destination: e.target.value})}
                            placeholder="Enter destination city/country"
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="packageTypeEst" className="block text-sm font-medium text-foreground mb-2">
                            Package Type
                          </label>
                          <select
                            id="packageTypeEst"
                            value={estimatorDetails.packageType}
                            onChange={(e) => setEstimatorDetails({...estimatorDetails, packageType: e.target.value})}
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          >
                            <option value="">Select package type</option>
                            <option value="document">Document</option>
                            <option value="parcel">Parcel</option>
                            <option value="fragile">Fragile</option>
                            <option value="heavy">Heavy</option>
                            <option value="bulk">Bulk</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="weightEst" className="block text-sm font-medium text-foreground mb-2">
                            Weight (kg) *
                          </label>
                          <input
                            type="number"
                            id="weightEst"
                            value={estimatorDetails.weight}
                            onChange={(e) => setEstimatorDetails({...estimatorDetails, weight: e.target.value})}
                            placeholder="0.0"
                            step="0.1"
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="dimensionsEst" className="block text-sm font-medium text-foreground mb-2">
                            Dimensions (cm)
                          </label>
                          <input
                            type="text"
                            id="dimensionsEst"
                            value={estimatorDetails.dimensions}
                            onChange={(e) => setEstimatorDetails({...estimatorDetails, dimensions: e.target.value})}
                            placeholder="L x W x H"
                            className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="serviceType" className="block text-sm font-medium text-foreground mb-2">
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
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border/50 hover:border-primary/30 hover:bg-slate-50"
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

                      <button
                        type="submit"
                        className="w-full px-6 py-3 bg-gradient text-white rounded-lg font-semibold shadow-glow hover:shadow-glow-orange transition-all duration-300 hover:scale-105"
                      >
                        Get Estimate
                      </button>
                    </form>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
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
              Comprehensive{" "}
              <span className="text-gradient">Logistics Solutions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From air freight to sea cargo, we provide end-to-end logistics services 
              tailored to your business needs with cutting-edge technology and global expertise.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Plane,
                title: "Air Freight",
                description: "Express worldwide air cargo services with real-time tracking and customs clearance.",
                features: ["24/7 Monitoring", "Customs Clearance", "Real-time Tracking", "Insurance Coverage"]
              },
              {
                icon: Ship,
                title: "Sea Freight",
                description: "Cost-effective ocean freight solutions for large shipments and bulk cargo.",
                features: ["Bulk Capacity", "Cost-effective", "Global Reach", "Warehousing"]
              },
              {
                icon: Truck,
                title: "Road Freight",
                description: "Reliable ground transportation with door-to-door delivery across continents.",
                features: ["Door-to-Door", "Flexible Routes", "High Capacity", "Regional Coverage"]
              },
              {
                icon: Train,
                title: "Rail Freight",
                description: "Efficient rail solutions for cross-continental and regional cargo transport.",
                features: ["High Volume", "Eco-friendly", "Reliable Schedule", "Cost-effective"]
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="bg-white rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-glow hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <button className="text-primary hover:text-primary/80 font-medium flex items-center space-x-2 group-hover:translate-x-1 transition-all">
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Metrics Section */}
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
              Success Through{" "}
              <span className="text-gradient">Numbers</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our track record speaks for itself. Discover why thousands of businesses 
              trust SwiftCargo with their logistics needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "25+", label: "Years Experience", icon: Award },
              { number: "150+", label: "Countries Served", icon: Globe },
              { number: "50K+", label: "Happy Clients", icon: Users },
              { number: "99.8%", label: "Success Rate", icon: Star }
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
              Driving Success Through{" "}
              <span className="text-gradient">Numbers</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Our track record speaks for itself. Discover why thousands of businesses 
              trust SwiftCargo with their logistics needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "25+", label: "Years of Excellence", icon: Award },
              { number: "150+", label: "Countries Served", icon: Globe },
              { number: "50K+", label: "Happy Clients", icon: Users },
              { number: "99.8%", label: "Success Rate", icon: Star }
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
              Ready to Transform Your{" "}
              <span className="text-gradient">Logistics?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join thousands of businesses that trust SwiftCargo for their logistics needs. 
              Get started today and experience the future of shipping.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-gradient text-white rounded-lg font-semibold text-lg shadow-glow-orange flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Your Free Quote</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                className="px-8 py-4 border-2 border-primary/30 text-primary rounded-lg font-semibold text-lg bg-white hover:bg-primary hover:text-white transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule a Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-display font-bold">SwiftCargo</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Your trusted partner in global logistics solutions. 
                Connecting businesses worldwide with innovative shipping and supply chain management.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-slate-400">
                {["Air Freight", "Sea Freight", "Road Freight", "Rail Freight", "Customs Clearance", "Warehousing"].map((service) => (
                  <li key={service}>
                    <a href="#" className="hover:text-white transition-colors">{service}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                {["About Us", "Our Team", "Careers", "News", "Contact", "Privacy Policy"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3 text-slate-400">
                <div className="flex items-center space-x-3">
                  <span>123 Logistics Way, Business District, NY 10001</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span>hello@swiftcargo.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 SwiftCargo. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
