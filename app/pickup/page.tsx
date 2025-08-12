"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  Truck, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  MessageSquare,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Send
} from "lucide-react";

export default function PickupPage() {
  const [formData, setFormData] = useState({
    pickupType: "package",
    pickupDate: "",
    pickupTime: "",
    pickupAddress: "",
    pickupCity: "",
    pickupState: "",
    pickupZip: "",
    pickupCountry: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    specialInstructions: "",
    packageCount: "1",
    packageWeight: "",
    packageDimensions: "",
    serviceType: "standard"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.pickupDate) newErrors.pickupDate = "Pickup date is required";
    if (!formData.pickupTime) newErrors.pickupTime = "Pickup time is required";
    if (!formData.pickupAddress) newErrors.pickupAddress = "Pickup address is required";
    if (!formData.pickupCity) newErrors.pickupCity = "City is required";
    if (!formData.pickupState) newErrors.pickupState = "State is required";
    if (!formData.pickupZip) newErrors.pickupZip = "ZIP code is required";
    if (!formData.contactName) newErrors.contactName = "Contact name is required";
    if (!formData.contactPhone) newErrors.contactPhone = "Contact phone is required";
    if (!formData.contactEmail) newErrors.contactEmail = "Contact email is required";
    if (!formData.packageWeight) newErrors.packageWeight = "Package weight is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Send email notification (in real implementation, this would use EmailJS or similar)
      console.log("Pickup request submitted:", formData);
      console.log("Email notification sent to:", formData.contactEmail);
      
      // Reset form after successful submission
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          pickupType: "package",
          pickupDate: "",
          pickupTime: "",
          pickupAddress: "",
          pickupCity: "",
          pickupState: "",
          pickupZip: "",
          pickupCountry: "",
          contactName: "",
          contactPhone: "",
          contactEmail: "",
          specialInstructions: "",
          packageCount: "1",
          packageWeight: "",
          packageDimensions: "",
          serviceType: "standard"
        });
      }, 5000);
    }, 2000);
  };

  const pickupTypes = [
    { value: "package", label: "Package", icon: Package },
    { value: "document", label: "Document", icon: Package },
    { value: "furniture", label: "Furniture", icon: Package },
    { value: "electronics", label: "Electronics", icon: Package },
    { value: "clothing", label: "Clothing", icon: Package },
    { value: "other", label: "Other", icon: Package }
  ];

  const serviceTypes = [
    { value: "standard", label: "Standard Pickup (24-48 hours)", price: "Free" },
    { value: "express", label: "Express Pickup (Same day)", price: "$25" },
    { value: "scheduled", label: "Scheduled Pickup (Specific time)", price: "$15" }
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
            Pickup Request Submitted!
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Thank you for your pickup request. We've sent a confirmation email to{" "}
            <span className="font-semibold">{formData.contactEmail}</span> with your pickup details.
          </p>
          
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-border/50 mb-8">
            <h3 className="font-semibold mb-4">Pickup Details:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div>
                <span className="text-muted-foreground">Date:</span> {formData.pickupDate}
              </div>
              <div>
                <span className="text-muted-foreground">Time:</span> {formData.pickupTime}
              </div>
              <div>
                <span className="text-muted-foreground">Address:</span> {formData.pickupAddress}
              </div>
              <div>
                <span className="text-muted-foreground">Service:</span> {serviceTypes.find(s => s.value === formData.serviceType)?.label}
              </div>
            </div>
          </div>
          
          <p className="text-muted-foreground">
            Our team will contact you within 2 hours to confirm your pickup and provide a tracking number.
          </p>
        </motion.div>
      </div>
    );
  }

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
              Schedule a{" "}
              <span className="text-gradient">Pickup</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Request a pickup for your shipment and we'll collect it from your location. 
              Fast, reliable, and convenient pickup services available worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pickup Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6">
                Request Your Pickup
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Fill out the form below and we'll schedule a pickup at your convenience. 
                Our team will contact you to confirm the details.
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Pickup Details */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-border/50"
              >
                <h3 className="text-2xl font-display font-bold mb-6 flex items-center space-x-3">
                  <Package className="w-8 h-8 text-primary" />
                  <span>Pickup Details</span>
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Pickup Type */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Pickup Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {pickupTypes.map((type) => (
                        <label
                          key={type.value}
                          className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-all ${
                            formData.pickupType === type.value
                              ? "border-primary bg-primary/5"
                              : "border-border/50 hover:border-primary/30"
                          }`}
                        >
                          <input
                            type="radio"
                            name="pickupType"
                            value={type.value}
                            checked={formData.pickupType === type.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <type.icon className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium">{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Service Type */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Service Type</label>
                    <div className="space-y-3">
                      {serviceTypes.map((service) => (
                        <label
                          key={service.value}
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                            formData.serviceType === service.value
                              ? "border-primary bg-primary/5"
                              : "border-border/50 hover:border-primary/30"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="serviceType"
                              value={service.value}
                              checked={formData.serviceType === service.value}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <span className="font-medium">{service.label}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{service.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Pickup Date & Time */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Pickup Date</label>
                    <input
                      type="date"
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        errors.pickupDate ? "border-red-500" : "border-border/50"
                      }`}
                    />
                    {errors.pickupDate && (
                      <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.pickupDate}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Pickup Time</label>
                    <select
                      name="pickupTime"
                      value={formData.pickupTime}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        errors.pickupTime ? "border-red-500" : "border-border/50"
                      }`}
                    >
                      <option value="">Select time</option>
                      <option value="09:00-12:00">09:00 AM - 12:00 PM</option>
                      <option value="12:00-15:00">12:00 PM - 3:00 PM</option>
                      <option value="15:00-18:00">3:00 PM - 6:00 PM</option>
                      <option value="18:00-21:00">6:00 PM - 9:00 PM</option>
                    </select>
                    {errors.pickupTime && (
                      <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.pickupTime}</span>
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Pickup Address */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-border/50"
              >
                <h3 className="text-2xl font-display font-bold mb-6 flex items-center space-x-3">
                  <MapPin className="w-8 h-8 text-primary" />
                  <span>Pickup Address</span>
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-3">Street Address</label>
                    <input
                      type="text"
                      name="pickupAddress"
                      value={formData.pickupAddress}
                      onChange={handleInputChange}
                      placeholder="Enter your street address"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        errors.pickupAddress ? "border-red-500" : "border-border/50"
                      }`}
                    />
                    {errors.pickupAddress && (
                      <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.pickupAddress}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">City</label>
                    <input
                      type="text"
                      name="pickupCity"
                      value={formData.pickupCity}
                      onChange={handleInputChange}
                      placeholder="City"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        errors.pickupCity ? "border-red-500" : "border-border/50"
                      }`}
                    />
                    {errors.pickupCity && (
                      <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.pickupCity}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">State/Province</label>
                    <input
                      type="text"
                      name="pickupState"
                      value={formData.pickupState}
                      onChange={handleInputChange}
                      placeholder="State"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        errors.pickupState ? "border-red-500" : "border-border/50"
                      }`}
                    />
                    {errors.pickupState && (
                      <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.pickupState}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">ZIP/Postal Code</label>
                    <input
                      type="text"
                      name="pickupZip"
                      value={formData.pickupZip}
                      onChange={handleInputChange}
                      placeholder="ZIP Code"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        errors.pickupZip ? "border-red-500" : "border-border/50"
                      }`}
                    />
                    {errors.pickupZip && (
                      <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.pickupZip}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Country</label>
                    <select
                      name="pickupCountry"
                      value={formData.pickupCountry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="">Select country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="CN">China</option>
                      <option value="JP">Japan</option>
                      <option value="AU">Australia</option>
                      <option value="IN">India</option>
                      <option value="BR">Brazil</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Package Details */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-border/50"
              >
                <h3 className="text-2xl font-display font-bold mb-6 flex items-center space-x-3">
                  <Package className="w-8 h-8 text-primary" />
                  <span>Package Details</span>
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Number of Packages</label>
                    <select
                      name="packageCount"
                      value={formData.packageCount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Total Weight (kg)</label>
                    <input
                      type="number"
                      name="packageWeight"
                      value={formData.packageWeight}
                      onChange={handleInputChange}
                      placeholder="0.0"
                      step="0.1"
                      min="0"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        errors.packageWeight ? "border-red-500" : "border-border/50"
                      }`}
                    />
                    {errors.packageWeight && (
                      <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.packageWeight}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Dimensions (L×W×H cm)</label>
                    <input
                      type="text"
                      name="packageDimensions"
                      value={formData.packageDimensions}
                      onChange={handleInputChange}
                      placeholder="30×20×15"
                      className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium mb-3">Special Instructions</label>
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    placeholder="Any special handling requirements, access instructions, or other details..."
                    rows={3}
                    className="w-full px-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  />
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-border/50"
              >
                <h3 className="text-2xl font-display font-bold mb-6 flex items-center space-x-3">
                  <User className="w-8 h-8 text-primary" />
                  <span>Contact Information</span>
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Full Name</label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        errors.contactName ? "border-red-500" : "border-border/50"
                      }`}
                    />
                    {errors.contactName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.contactName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Phone Number</label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        errors.contactPhone ? "border-red-500" : "border-border/50"
                      }`}
                    />
                    {errors.contactPhone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.contactPhone}</span>
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-3">Email Address</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        errors.contactEmail ? "border-red-500" : "border-border/50"
                      }`}
                    />
                    {errors.contactEmail && (
                      <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.contactEmail}</span>
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center"
              >
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-12 py-4 bg-gradient text-white rounded-lg font-semibold text-lg shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto"
                  whileHover={{ scale: isSubmitting ? 1 : 1.05, y: isSubmitting ? 0 : -2 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Schedule Pickup</span>
                    </>
                  )}
                </motion.button>
                
                <p className="text-sm text-muted-foreground mt-4">
                  By submitting this form, you agree to our terms of service and privacy policy.
                </p>
              </motion.div>
            </form>
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
              Why Choose Our{" "}
              <span className="text-gradient">Pickup Service?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Professional, reliable, and convenient pickup services designed to make 
              shipping as easy as possible for you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Flexible Scheduling",
                description: "Choose your preferred pickup date and time window for maximum convenience"
              },
              {
                icon: MapPin,
                title: "Door-to-Door Service",
                description: "We come directly to your location - no need to visit a shipping center"
              },
              {
                icon: CheckCircle,
                title: "Professional Handling",
                description: "Trained professionals ensure your packages are handled with care"
              },
              {
                icon: MessageSquare,
                title: "Real-time Updates",
                description: "Get instant confirmation and tracking updates for your pickup"
              },
              {
                icon: Truck,
                title: "Reliable Service",
                description: "99.8% on-time pickup rate with backup plans for any delays"
              },
              {
                icon: Package,
                title: "All Package Types",
                description: "We handle everything from documents to large furniture and electronics"
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
              Ready to{" "}
              <span className="text-gradient">Ship?</span>
            </h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Schedule your pickup today and experience the convenience of our 
              professional pickup service. Fast, reliable, and hassle-free.
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
                Contact Support
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
