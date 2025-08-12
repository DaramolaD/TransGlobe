"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Package, 
  Truck, 
  Plane, 
  Ship, 
  Train,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Calendar,
  User
} from "lucide-react";

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Mock tracking data
  const mockTrackingData = {
    "SC001234567": {
      number: "SC001234567",
      status: "In Transit",
      statusColor: "text-blue-600",
      statusIcon: Truck,
      origin: "Shanghai, China",
      destination: "New York, USA",
      service: "Air Freight",
      serviceIcon: Plane,
      estimatedDelivery: "2024-01-15",
      currentLocation: "Los Angeles, CA",
      timeline: [
        {
          date: "2024-01-10",
          time: "14:30",
          status: "Shipment Picked Up",
          location: "Shanghai, China",
          description: "Package collected from sender's location",
          icon: Package,
          completed: true
        },
        {
          date: "2024-01-11",
          time: "09:15",
          status: "Departed Origin",
          location: "Shanghai, China",
          description: "Package departed from Shanghai International Airport",
          icon: Plane,
          completed: true
        },
        {
          date: "2024-01-12",
          time: "16:45",
          status: "Arrived at Hub",
          location: "Los Angeles, CA",
          description: "Package arrived at LAX International Airport",
          icon: CheckCircle,
          completed: true
        },
        {
          date: "2024-01-13",
          time: "11:20",
          status: "Customs Clearance",
          location: "Los Angeles, CA",
          description: "Package cleared customs and ready for delivery",
          icon: CheckCircle,
          completed: true
        },
        {
          date: "2024-01-15",
          time: "08:00",
          status: "Out for Delivery",
          location: "New York, USA",
          description: "Package is out for final delivery",
          icon: Truck,
          completed: false
        },
        {
          date: "2024-01-15",
          time: "14:00",
          status: "Delivered",
          location: "New York, USA",
          description: "Package successfully delivered to recipient",
          icon: CheckCircle,
          completed: false
        }
      ]
    },
    "SC007654321": {
      number: "SC007654321",
      status: "Delivered",
      statusColor: "text-green-600",
      statusIcon: CheckCircle,
      origin: "Rotterdam, Netherlands",
      destination: "Chicago, USA",
      service: "Sea Freight",
      serviceIcon: Ship,
      estimatedDelivery: "2024-01-12",
      currentLocation: "Delivered",
      timeline: [
        {
          date: "2024-01-05",
          time: "10:30",
          status: "Shipment Picked Up",
          location: "Rotterdam, Netherlands",
          description: "Container loaded at Rotterdam port",
          icon: Package,
          completed: true
        },
        {
          date: "2024-01-06",
          time: "15:45",
          status: "Departed Origin",
          location: "Rotterdam, Netherlands",
          description: "Container departed from Rotterdam port",
          icon: Ship,
          completed: true
        },
        {
          date: "2024-01-10",
          time: "12:20",
          status: "Arrived at Port",
          location: "New York, USA",
          description: "Container arrived at New York port",
          icon: CheckCircle,
          completed: true
        },
        {
          date: "2024-01-11",
          time: "09:15",
          status: "Customs Clearance",
          location: "New York, USA",
          description: "Container cleared customs",
          icon: CheckCircle,
          completed: true
        },
        {
          date: "2024-01-12",
          time: "14:30",
          status: "Delivered",
          location: "Chicago, USA",
          description: "Container delivered to final destination",
          icon: CheckCircle,
          completed: true
        }
      ]
    }
  };

  const handleTracking = () => {
    if (!trackingNumber.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const result = mockTrackingData[trackingNumber as keyof typeof mockTrackingData];
      setTrackingResult(result);
      setIsSearching(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Transit":
        return Truck;
      case "Delivered":
        return CheckCircle;
      case "Delayed":
        return AlertCircle;
      default:
        return Package;
    }
  };

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
              <span className="text-gradient">Shipment</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Get real-time updates on your shipments with our advanced tracking system. 
              Know exactly where your cargo is at every step of the journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tracking Tool */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Tracking Input */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-border/50 mb-12"
            >
              <h2 className="text-3xl font-display font-bold mb-6 text-center">
                Track Your Package
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Enter your tracking number to get real-time updates on your shipment
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Enter tracking number (e.g., SC001234567)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="flex-1 px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleTracking()}
                />
                <motion.button
                  onClick={handleTracking}
                  disabled={isSearching || !trackingNumber.trim()}
                  className="px-8 py-3 bg-gradient text-white rounded-lg font-semibold shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  whileHover={{ scale: isSearching ? 1 : 1.05, y: isSearching ? 0 : -2 }}
                  whileTap={{ scale: isSearching ? 1 : 0.95 }}
                >
                  {isSearching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Track</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Sample Tracking Numbers */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Try these sample tracking numbers:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {Object.keys(mockTrackingData).map((number) => (
                    <button
                      key={number}
                      onClick={() => setTrackingNumber(number)}
                      className="px-3 py-1 bg-white border border-border/50 rounded-full text-sm hover:border-primary transition-colors"
                    >
                      {number}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Tracking Results */}
            {trackingResult && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl border border-border/50 overflow-hidden shadow-glow"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 border-b border-border/50">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-display font-bold mb-2">
                        Tracking: {trackingResult.number}
                      </h3>
                      <div className="flex items-center space-x-3">
                        <trackingResult.statusIcon className={`w-6 h-6 ${trackingResult.statusColor}`} />
                        <span className={`text-lg font-semibold ${trackingResult.statusColor}`}>
                          {trackingResult.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Service</div>
                        <div className="flex items-center space-x-2 font-semibold">
                          <trackingResult.serviceIcon className="w-5 h-5 text-primary" />
                          <span>{trackingResult.service}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Est. Delivery</div>
                        <div className="font-semibold">{trackingResult.estimatedDelivery}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Route Info */}
                <div className="p-6 border-b border-border/50">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-sm text-muted-foreground">Origin</div>
                        <div className="font-semibold">{trackingResult.origin}</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-sm text-muted-foreground">Destination</div>
                        <div className="font-semibold">{trackingResult.destination}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="p-6">
                  <h4 className="text-lg font-semibold mb-6">Shipment Timeline</h4>
                  <div className="space-y-6">
                    {trackingResult.timeline.map((event: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="flex items-start space-x-4"
                      >
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            event.completed ? 'bg-green-100' : 'bg-slate-100'
                          }`}>
                            <event.icon className={`w-5 h-5 ${
                              event.completed ? 'text-green-600' : 'text-slate-400'
                            }`} />
                          </div>
                          {index < trackingResult.timeline.length - 1 && (
                            <div className={`w-0.5 h-8 mt-2 ${
                              event.completed ? 'bg-green-200' : 'bg-slate-200'
                            }`}></div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h5 className="font-semibold">{event.status}</h5>
                            <span className="text-sm text-muted-foreground">
                              {event.date} at {event.time}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-2">{event.description}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
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
              Advanced{" "}
              <span className="text-gradient">Tracking Features</span>
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
              Need to{" "}
              <span className="text-gradient">Ship Something?</span>
            </h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Get a free quote and start shipping with SwiftCargo today. 
              Our tracking system will keep you informed every step of the way.
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
                Contact Sales
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
