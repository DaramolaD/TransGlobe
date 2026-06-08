"use client";

import { motion } from "framer-motion";
import { 
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
import type { SiteBrand } from "@/lib/branding/types";
import { BrandMark } from "@/components/branding/BrandMark";

export default function Footer({ brand }: { brand: SiteBrand }) {
  const year = new Date().getFullYear();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-graphite-dark text-white border-t border-graphite-light/20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <BrandMark
              name={brand.name}
              logoUrl={brand.logoUrl}
              textClassName="text-2xl text-white"
            />
            <p className="text-platinum-mid leading-relaxed">
              Your trusted partner in global logistics across {brand.region}. Freight, tracking,
              and supply chain management tailored to your business.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-graphite-mid border border-graphite-light/50 rounded-lg flex items-center justify-center hover:bg-ember-main hover:border-transparent transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-graphite-mid border border-graphite-light/50 rounded-lg flex items-center justify-center hover:bg-ember-main hover:border-transparent transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-graphite-mid border border-graphite-light/50 rounded-lg flex items-center justify-center hover:bg-ember-main hover:border-transparent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-graphite-mid border border-graphite-light/50 rounded-lg flex items-center justify-center hover:bg-ember-main hover:border-transparent transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-graphite-mid border border-graphite-light/50 rounded-lg flex items-center justify-center hover:bg-ember-main hover:border-transparent transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
            <ul className="space-y-2 text-platinum-mid">
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
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2 text-platinum-mid">
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
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Info</h3>
            <div className="space-y-3 text-platinum-mid">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-ember-main flex-shrink-0 mt-0.5" />
                <span>{brand.headquarters}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-ember-main flex-shrink-0" />
                <a href={`tel:${brand.supportPhone.replace(/\s/g, "")}`} className="hover:text-white">
                  {brand.supportPhone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-ember-main flex-shrink-0" />
                <a href={`mailto:${brand.supportEmail}`} className="hover:text-white">
                  {brand.supportEmail}
                </a>
              </div>
              {brand.opsHours ? (
                <p className="text-sm text-platinum-mid/90 pt-1">{brand.opsHours}</p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-graphite-light/20 pt-8 pb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-4 text-white">Stay Updated</h3>
            <p className="text-platinum-mid mb-6">
              Subscribe to our newsletter for the latest logistics insights and company updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-graphite-mid border border-graphite-light/50 text-white rounded-lg focus:ring-2 focus:ring-ember-main focus:border-transparent transition-all outline-none"
              />
              <motion.button
                className="btn-cta btn-cta-sm"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-graphite-light/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-platinum-mid text-sm">
            © {year} {brand.name}. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-platinum-mid">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-graphite-mid hover:bg-graphite-light border border-graphite-light/40 rounded-full flex items-center justify-center shadow-lg z-40 transition-colors"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp className="w-6 h-6 text-white" />
      </motion.button>
    </footer>
  );
}
