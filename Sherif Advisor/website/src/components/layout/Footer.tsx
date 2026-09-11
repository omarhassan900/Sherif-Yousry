'use client';

import Link from 'next/link';
import { Linkedin, Youtube } from 'lucide-react';
import Image from 'next/image';
import { getClientLanguage, setLanguagePreference, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-8 lg:gap-12">

          {/* Left Section - Logo & Tagline */}
          <div className="flex flex-col gap-4">
            <div>
              <Image
                src="/images/logo.png"
                width={400}
                height={350}
                className="invert brightness-100"
                priority
              />
              
            </div>
           
          </div>

          {/* Middle Section - Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Services */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">
                Services
              </h4>
              <Link href="/services/tax" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                Tax Advisory
              </Link>
              <Link href="/services/audit" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                Audit & Assurance
              </Link>
              <Link href="/services/financial" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                Financial Advisory
              </Link>
              <Link href="/services/business" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                Business Advisory
              </Link>
              <Link href="/services/corporate" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                Corporate Services
              </Link>
              <Link href="/services/payroll" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                Payroll & Social Insurance
              </Link>
              <Link href="/services/ecommerce" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                E-Commerce & Digital Business
              </Link>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">
                Company
              </h4>
              <Link href="/about" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="/about#approach" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                Our Approach
              </Link>
              <Link href="/about#people" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                Our People
              </Link>
              <Link href="/about#international" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                Our International Focus
              </Link>
              <Link href="/careers" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                Careers
              </Link>
            </div>

            {/* Insights */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">
                Insights
              </h4>
              <Link href="/knowledge?category=tax" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                Tax Alerts
              </Link>
              <Link href="/knowledge?category=legal" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                Legal Alerts
              </Link>
              <Link href="/knowledge?category=financial" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                Financial Alerts
              </Link>
            </div>

            {/* Digital Experience */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">
                Digital Experience
              </h4>
              <Link href="/portal/client" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                Client Portal
              </Link>
              <Link href="/portal/investor" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                Investor Portal
              </Link>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">
                Contact
              </h4>
              <Link href="/contact" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                Get in Touch
              </Link>
              <Link href="/contact#location" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                Location
              </Link>
              <a href="tel:01112042098" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                01112042098
              </a>
            </div>
          </div>

          {/* Right Section - Social & Location */}
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
                FOLLOW US
              </h4>
              <div className="flex gap-3">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center bg-gray-900 hover:bg-gray-700 transition-colors rounded-sm"
                >
                  <Linkedin className="w-4 h-4 text-white" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center bg-gray-900 hover:bg-gray-700 transition-colors rounded-sm"
                >
                  <Youtube className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>

            <div className="border-l border-gray-300 pl-4">
              <p className="text-sm font-semibold text-gray-900">EGYPT</p>
              <p className="text-xs text-gray-500 mt-1">
                A BRIDGE TO A BRIGHTER TOMORROW
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © 2025 Sherif Yousry Advisory. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
              Privacy
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
              Terms
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/sitemap" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}