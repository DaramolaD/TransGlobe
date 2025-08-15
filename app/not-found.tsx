"use client";

import { motion } from "framer-motion";
import { 
  Package, 
  Home, 
  ArrowLeft, 
  Search,
  Truck,
  // Ship,
  // Plane
} from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Logo */}
          <motion.div 
            className="flex items-center justify-center space-x-2 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-16 h-16 bg-gradient rounded-2xl flex items-center justify-center">
              <Package className="w-8 h-8 text-white" />
            </div>
            <span className="text-4xl font-display font-bold text-gradient">SwiftCargo</span>
          </motion.div>

          {/* 404 Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h1 className="text-8xl lg:text-9xl font-display font-bold text-gradient mb-6">
              404
            </h1>
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Page Not{" "}
              <span className="text-gradient">Found</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Oops! It looks like this logistics route has been diverted. The page you&apos;re looking for 
              might have been moved, deleted, or never existed in the first place.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/">
              <motion.button
                className="px-8 py-4 bg-gradient text-white rounded-lg font-semibold text-lg shadow-glow flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="w-5 h-5" />
                <span>Go Home</span>
              </motion.button>
            </Link>
            
            <motion.button
              onClick={() => window.history.back()}
              className="px-8 py-4 border-2 border-primary/30 text-primary rounded-lg font-semibold text-lg bg-white hover:bg-primary hover:text-white transition-all flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </motion.button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-display font-bold mb-6">
              Popular{" "}
              <span className="text-gradient">Destinations</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { icon: Home, title: "Home", description: "Return to our main page", href: "/" },
                { icon: Truck, title: "Services", description: "Explore our logistics solutions", href: "/services" },
                { icon: Package, title: "Contact", description: "Get in touch with our team", href: "/contact" }
              ].map((link, index) => (
                <motion.div
                  key={link.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="group"
                >
                  <Link href={link.href}>
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-border/50 hover:shadow-glow hover:-translate-y-2 transition-all duration-300 group-hover:border-primary/30">
                      <div className="w-16 h-16 bg-gradient rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <link.icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {link.title}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {link.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Search Suggestion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="max-w-2xl mx-auto"
          >
            <h3 className="text-xl font-semibold mb-4">
              Can&apos;t find what you&apos;re looking for?
            </h3>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search our website..."
                className="w-full pl-10 pr-4 py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Try searching for services, contact information, or browse our main navigation.
            </p>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-16 pt-8 border-t border-border/50"
          >
            <p className="text-muted-foreground mb-4">
              Still having trouble? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact">
                <motion.button
                  className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Support
                </motion.button>
              </Link>
              <span className="text-muted-foreground">or call us at +1 (800) SWIFT-24</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
