"use client";

import { motion } from "framer-motion";
import { 
  Package, 
  ArrowUp, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
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
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/services" className="hover:text-white transition-colors">Air Freight</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Sea Freight</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Road Freight</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Rail Freight</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Customs Clearance</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Warehousing</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/solutions" className="hover:text-white transition-colors">Solutions</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/tracking" className="hover:text-white transition-colors">Tracking</Link></li>
              <li><Link href="/pickup" className="hover:text-white transition-colors">Pickup</Link></li>
              <li><Link href="/estimator" className="hover:text-white transition-colors">Cost Estimator</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-slate-400">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span>123 Logistics Way, Business District, NY 10001</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span>hello@swiftcargo.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-slate-800 pt-8 pb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-4">Stay Updated</h3>
            <p className="text-slate-400 mb-6">
              Subscribe to our newsletter for the latest logistics insights and company updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <motion.button
                className="px-6 py-3 bg-gradient text-white rounded-lg font-medium shadow-glow"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom */}
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

      {/* Scroll to Top */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient rounded-full flex items-center justify-center shadow-glow z-40"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp className="w-6 h-6 text-white" />
      </motion.button>
    </footer>
  );
}
