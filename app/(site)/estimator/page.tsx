"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { submitQuote } from "@/lib/actions/public-forms";
import type { ServiceType } from "@/lib/types/database";
import {
  baseFreightAmount,
  deliveryTimeForService,
  fallbackRates,
  type RateCardRow,
} from "@/lib/pricing/rate-cards";
import { iconForServiceSlug } from "@/lib/service-types/icons";
import {
  Calculator,
  Package,
  MapPin,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Clock,
  Weight,
} from "lucide-react";

type CatalogService = {
  slug: string;
  label: string;
  description?: string | null;
  delivery_hint?: string | null;
};

const FALLBACK_SERVICES: CatalogService[] = [
  { slug: "air", label: "Air Freight", delivery_hint: "2-5 days" },
  { slug: "sea", label: "Sea Freight", delivery_hint: "15-30 days" },
  { slug: "road", label: "Road Freight", delivery_hint: "3-7 days" },
  { slug: "rail", label: "Rail Freight", delivery_hint: "5-10 days" },
];

// Add proper types at the top
interface Estimate {
  basePrice: string;
  packageMultiplier: number;
  insuranceCost: string;
  expressCost: string;
  totalPrice: string;
  serviceName: string;
  deliveryTime: string;
  weight: string;
  origin: string;
  destination: string;
}

export default function EstimatorPage() {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    weight: "",
    dimensions: "",
    serviceType: "air",
    packageType: "general",
    insurance: false,
    express: false
  });

  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [rates, setRates] = useState<RateCardRow[]>(fallbackRates());
  const [catalog, setCatalog] = useState<CatalogService[]>(FALLBACK_SERVICES);
  const [deliveryHints, setDeliveryHints] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/rates", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/service-types", { cache: "no-store" }).then((r) => r.json()),
    ])
      .then(([ratesBody, typesBody]) => {
        if (cancelled) return;
        if (ratesBody.rates?.length) setRates(ratesBody.rates);
        const types = typesBody.types as CatalogService[] | undefined;
        if (types?.length) {
          setCatalog(types);
          setDeliveryHints(
            Object.fromEntries(
              types.map((t) => [t.slug, t.delivery_hint ?? ""])
            )
          );
          setFormData((prev) => {
            if (types.some((t) => t.slug === prev.serviceType)) return prev;
            return { ...prev, serviceType: types[0].slug };
          });
        }
      })
      .catch(() => {
        /* keep fallbacks */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const calculateEstimate = () => {
    if (!formData.origin || !formData.destination || !formData.weight) return;
    
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      const weight = parseFloat(formData.weight);
      const priced = baseFreightAmount(weight, formData.serviceType, rates);
      const basePrice = priced?.amount ?? 0;
      const serviceName = priced?.serviceName ?? "Freight";
      const deliveryTime = deliveryTimeForService(formData.serviceType, deliveryHints);
      const catalogLabel = catalog.find((t) => t.slug === formData.serviceType)?.label;
      const displayServiceName = catalogLabel ?? serviceName;
      
      // Add package type multiplier
      let packageMultiplier = 1;
      switch (formData.packageType) {
        case "fragile":
          packageMultiplier = 1.3;
          break;
        case "hazardous":
          packageMultiplier = 1.5;
          break;
        case "temperature":
          packageMultiplier = 1.4;
          break;
        default:
          packageMultiplier = 1;
      }
      
      // Add insurance cost
      const insuranceCost = formData.insurance ? basePrice * 0.02 : 0; // 2% of base price
      
      // Add express service cost
      const expressCost = formData.express ? basePrice * 0.25 : 0; // 25% premium
      
      const total = (basePrice * packageMultiplier) + insuranceCost + expressCost;

      setEstimate({
        basePrice: basePrice.toFixed(2),
        packageMultiplier: packageMultiplier,
        insuranceCost: insuranceCost.toFixed(2),
        expressCost: expressCost.toFixed(2),
        totalPrice: total.toFixed(2),
        serviceName: displayServiceName,
        deliveryTime,
        weight: formData.weight,
        origin: formData.origin,
        destination: formData.destination
      });

      void submitQuote({
        origin: formData.origin,
        destination: formData.destination,
        weight: formData.weight,
        dimensions: formData.dimensions,
        serviceType: formData.serviceType as ServiceType,
        packageType: formData.packageType,
        insurance: formData.insurance,
        express: formData.express,
        totalPrice: total,
        basePrice: basePrice * packageMultiplier,
      });
      
      setIsCalculating(false);
    }, 2000);
  };

  const packageTypes = [
    { value: "general", label: "General Cargo", description: "Standard handling" },
    { value: "fragile", label: "Fragile Items", description: "Extra care required" },
    { value: "hazardous", label: "Hazardous Materials", description: "Special handling required" },
    { value: "temperature", label: "Temperature Controlled", description: "Climate-controlled transport" }
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
              Delivery Cost{" "}
              Estimator
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Get instant cost estimates for your shipments. Our calculator provides 
              accurate pricing for air, sea, road, and rail freight services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Estimator Tool */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-display font-bold mb-8">
                  Calculate Your Shipping Cost
                </h2>
                
                <form className="space-y-6">
                  {/* Origin & Destination */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-3">Origin</label>
                      <input
                        type="text"
                        name="origin"
                        value={formData.origin}
                        onChange={handleInputChange}
                        placeholder="e.g., New York, NY"
                        className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-ember-main focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-3">Destination</label>
                      <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        placeholder="e.g., Los Angeles, CA"
                        className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-ember-main focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Weight & Dimensions */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-3">Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="0.0"
                        step="0.1"
                        min="0"
                        className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-ember-main focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-3">Dimensions (L×W×H cm)</label>
                      <input
                        type="text"
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={handleInputChange}
                        placeholder="30×20×15"
                        className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-ember-main focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Service Type */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Service Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {catalog.map((service) => {
                        const Icon = iconForServiceSlug(service.slug);
                        return (
                          <label
                            key={service.slug}
                            className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                              formData.serviceType === service.slug
                                ? "border-primary bg-primary/5"
                                : "border-border/50 hover:border-graphite-mid/30"
                            }`}
                          >
                            <input
                              type="radio"
                              name="serviceType"
                              value={service.slug}
                              checked={formData.serviceType === service.slug}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <Icon className="w-6 h-6 text-graphite-mid" />
                            <div>
                              <div className="font-medium">{service.label}</div>
                              <div className="text-sm text-muted-foreground">
                                {service.description ||
                                  service.delivery_hint ||
                                  "Get an instant estimate"}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Package Type */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Package Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {packageTypes.map((type) => (
                        <label
                          key={type.value}
                          className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                            formData.packageType === type.value
                              ? "border-primary bg-primary/5"
                              : "border-border/50 hover:border-graphite-mid/30"
                          }`}
                        >
                          <input
                            type="radio"
                            name="packageType"
                            value={type.value}
                            checked={formData.packageType === type.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <Package className="w-6 h-6 text-graphite-mid" />
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-muted-foreground">{type.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Additional Services */}
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="insurance"
                        checked={formData.insurance}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-ember-main border-border/50 rounded focus:ring-2 focus:ring-ember-main"
                      />
                      <span className="font-medium">Add Cargo Insurance</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="express"
                        checked={formData.express}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-ember-main border-border/50 rounded focus:ring-2 focus:ring-ember-main"
                      />
                      <span className="font-medium">Express Service (Priority Handling)</span>
                    </label>
                  </div>

                  {/* Calculate Button */}
                  <motion.button
                    type="button"
                    onClick={calculateEstimate}
                    disabled={isCalculating || !formData.origin || !formData.destination || !formData.weight}
                    className="btn-cta w-full"
                    whileHover={{ scale: isCalculating ? 1 : 1.02, y: isCalculating ? 0 : -2 }}
                    whileTap={{ scale: isCalculating ? 1 : 0.98 }}
                  >
                    {isCalculating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Calculating...</span>
                      </>
                    ) : (
                      <>
                        <Calculator className="w-5 h-5" />
                        <span>Calculate Estimate</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-3xl font-display font-bold mb-8">
                  Cost Estimate
                </h2>
                
                {estimate ? (
                  <div className="bg-platinum-off rounded-2xl p-8 border border-border/50">
                    {/* Summary */}
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-display font-bold mb-2 text-graphite-dark">
                        ${estimate.totalPrice}
                      </h3>
                      <p className="text-muted-foreground">Total Estimated Cost</p>
                    </div>

                    {/* Route Info */}
                    <div className="bg-white rounded-xl p-6 mb-6 border border-border/50">
                      <h4 className="font-semibold mb-4 flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-graphite-mid" />
                        <span>Route Information</span>
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">From:</span>
                          <span className="font-medium">{estimate.origin}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">To:</span>
                          <span className="font-medium">{estimate.destination}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Service:</span>
                          <span className="font-medium">{estimate.serviceName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Delivery Time:</span>
                          <span className="font-medium">{estimate.deliveryTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Weight:</span>
                          <span className="font-medium">{estimate.weight} kg</span>
                        </div>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="bg-white rounded-xl p-6 border border-border/50">
                      <h4 className="font-semibold mb-4 flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-graphite-mid" />
                        <span>Cost Breakdown</span>
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Base Price:</span>
                          <span>${estimate.basePrice}</span>
                        </div>
                        {estimate.packageMultiplier > 1 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Package Handling:</span>
                            <span>+${(parseFloat(estimate.basePrice) * (estimate.packageMultiplier - 1)).toFixed(2)}</span>
                          </div>
                        )}
                        {parseFloat(estimate.insuranceCost) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Insurance:</span>
                            <span>+${estimate.insuranceCost}</span>
                          </div>
                        )}
                        {parseFloat(estimate.expressCost) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Express Service:</span>
                            <span>+${estimate.expressCost}</span>
                          </div>
                        )}
                        <div className="border-t border-border/50 pt-3">
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total:</span>
                            <span className="text-ember-main font-semibold">${estimate.totalPrice}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-6 text-center">
                      <motion.button
                        className="px-8 py-3 bg-gradient text-white rounded-lg font-semibold shadow-glow flex items-center justify-center space-x-2 mx-auto"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Book This Shipment</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                      <p className="text-sm text-muted-foreground mt-3">
                        This is an estimate. Final price may vary based on actual requirements.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-platinum-off rounded-2xl p-8 border border-border/50 text-center">
                    <Calculator className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Estimate Yet</h3>
                    <p className="text-muted-foreground">
                      Fill out the form on the left and click &quot;Calculate Estimate&quot; 
                      to get your shipping cost estimate.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
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
              Why Use Our{" "}
              Cost Estimator?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get accurate, transparent pricing for your shipments with our 
              advanced cost calculation tool.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calculator,
                title: "Instant Estimates",
                description: "Get shipping cost estimates in seconds with our advanced calculation engine"
              },
              {
                icon: DollarSign,
                title: "Transparent Pricing",
                description: "See exactly what you&apos;re paying for with detailed cost breakdowns"
              },
              {
                icon: Clock,
                title: "Delivery Times",
                description: "Compare delivery times across different service types"
              },
              {
                icon: Weight,
                title: "Weight-Based Pricing",
                description: "Accurate pricing based on actual weight and dimensions"
              },
              {
                icon: CheckCircle,
                title: "Multiple Services",
                description: "Compare costs across air, sea, road, and rail freight options"
              },
              {
                icon: Package,
                title: "Package Handling",
                description: "Specialized pricing for fragile, hazardous, and temperature-controlled items"
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
              Ready to{" "}
              Ship?
            </h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Get your cost estimate and book your shipment today. 
              Our team is ready to handle your logistics needs.
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
