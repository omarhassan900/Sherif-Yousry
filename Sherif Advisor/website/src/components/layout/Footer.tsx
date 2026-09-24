'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Youtube, Facebook, Instagram, ArrowUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

/**
 * Footer variant switch.
 *   'modern'  → the new branded footer (newsletter + links + social).
 *   'classic' → the original multi-column footer (kept for easy rollback).
 * Flip this constant to return the previous footer at any time.
 */
const FOOTER_VARIANT: 'modern' | 'classic' = 'modern';

export function Footer() {
  return FOOTER_VARIANT === 'modern' ? <FooterModern /> : <FooterClassic />;
}

/* ────────────────────────────────────────────────────────────
   MODERN FOOTER (Abu Dhabi–style)
   ──────────────────────────────────────────────────────────── */
function FooterModern() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  const scrollTop = () =>
    typeof window !== 'undefined' && window.scrollTo({ top: 0, behavior: 'smooth' });

  const quickLinks = [
    { href: '/#services',   label: 'Services' },
    { href: '/#markets',    label: 'Markets' },
    { href: '/knowledge',   label: 'Insights' },
    { href: '/#packages',   label: 'Packages' },
    { href: '/events',      label: 'Events' },
    { href: '/trainings',   label: 'Trainings' },
    { href: '/about',       label: 'About Us' },
    { href: '/contact',     label: 'Contact Us' },
  ];

  return (
    <footer className="relative bg-brand-navy text-white overflow-hidden">
      {/* Soft gold glow accent */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 85% 0%, rgba(191,161,74,0.12) 0%, rgba(3,10,18,0) 70%)',
        }}
      />

      {/* Top row: logo + back to top */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-10 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-60 h-16">
            <Image src="/images/logo.png" alt="Sherif Yousry Advisory" fill className="object-contain" />
          </div>

        </Link>

        <button
          onClick={scrollTop}
          className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-[11px] font-bold tracking-[0.15em] uppercase hover:border-brand-gold hover:text-brand-gold transition-colors"
        >
          Back to Top
          <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
        </button>
      </div>

      {/* Main grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr] gap-6">
        {/* Newsletter card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
          <h3 className="font-serif text-2xl mb-3">Subscribe to Our Insights</h3>
          <p className="text-sm text-gray-300 leading-relaxed mb-6 max-w-sm">
            Get tax, legal, and financial alerts plus advisory ideas delivered to your inbox.
          </p>
          {subscribed ? (
            <div className="flex items-center gap-2.5 text-sm text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              You&apos;re subscribed. Thank you!
            </div>
          ) : (
            <form onSubmit={handleSubscribe}>
              <div className="flex items-stretch gap-2 rounded-full border border-white/20 bg-white/5 p-1.5 focus-within:border-brand-gold/60 transition-colors max-w-md">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent px-4 text-sm text-white placeholder:text-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-5 py-2.5 text-[11px] font-bold tracking-wider uppercase text-brand-navy hover:bg-white transition-colors whitespace-nowrap"
                >
                  Subscribe
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            </form>
          )}
        </div>

 <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
    
    <div className="grid grid-cols-2 gap-8">
      {/* Column 1 */}
      <div>
    <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-brand-gold mb-6">Main Pages</h4>
        <ul className="flex flex-col gap-3">
          {quickLinks.slice(0, Math.ceil(quickLinks.length / 2)).map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm text-gray-300 hover:text-white transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 2 */}
      <div>
    <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-brand-gold mb-6">Explore</h4>
        <ul className="flex flex-col gap-3">
          {quickLinks.slice(Math.ceil(quickLinks.length / 2)).map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm text-gray-300 hover:text-white transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
        {/* Follow us + contact */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-7 flex flex-col gap-6">
          <div>
            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-brand-gold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {[
                { href: 'https://linkedin.com', Icon: Linkedin, label: 'LinkedIn' },
                { href: 'https://youtube.com', Icon: Youtube, label: 'YouTube' },
                { href: 'https://facebook.com', Icon: Facebook, label: 'Facebook' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white hover:border-brand-gold hover:text-brand-gold hover:bg-brand-gold/10 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div className="border-t border-white/10 pt-5">
            <p className="text-sm font-semibold">EGYPT</p>
            <p className="text-xs text-gray-400 mt-1">New Administrative Capital</p>
            <a href="tel:+201112042098" className="block text-sm text-gray-300 hover:text-brand-gold transition-colors mt-2" dir="ltr">
              +20 111 204 2098
            </a>
            <a href="mailto:info@sherifadvisory.com" className="block text-sm text-gray-300 hover:text-brand-gold transition-colors">
              info@sherifadvisory.com
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
            <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Sherif Yousry Advisory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────────────────────────
   CLASSIC FOOTER (original — kept for rollback)
   ──────────────────────────────────────────────────────────── */
function FooterClassic() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-8 lg:gap-12">

          {/* Left Section - Logo & Tagline */}
          <div className="flex flex-col gap-4">
            <div>
              <Image
                src="/images/logo.png"
                alt="Sherif Yousry Advisory"
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
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">Services</h4>
              <Link href="/services/tax" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Tax Advisory</Link>
              <Link href="/services/audit" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Audit &amp; Assurance</Link>
              <Link href="/services/financial" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Financial Advisory</Link>
              <Link href="/services/business" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Business Advisory</Link>
              <Link href="/services/corporate" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Corporate Services</Link>
              <Link href="/services/payroll" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Payroll &amp; Social Insurance</Link>
              <Link href="/services/ecommerce" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">E-Commerce &amp; Digital Business</Link>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">Company</h4>
              <Link href="/about" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">About</Link>
              <Link href="/about#approach" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Our Approach</Link>
              <Link href="/about#people" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Our People</Link>
              <Link href="/about#international" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Our International Focus</Link>
              <Link href="/careers" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Careers</Link>
            </div>

            {/* Insights */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">Insights</h4>
              <Link href="/knowledge?category=tax" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Tax Alerts</Link>
              <Link href="/knowledge?category=legal" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Legal Alerts</Link>
              <Link href="/knowledge?category=financial" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Financial Alerts</Link>
            </div>

            {/* Digital Experience */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">Digital Experience</h4>
              <Link href="/portal/client" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Client Portal</Link>
              <Link href="/portal/investor" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Investor Portal</Link>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">Contact</h4>
              <Link href="/contact" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Get in Touch</Link>
              <Link href="/contact#location" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Location</Link>
              <a href="tel:01112042098" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">01112042098</a>
            </div>
          </div>

          {/* Right Section - Social & Location */}
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">FOLLOW US</h4>
              <div className="flex gap-3">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-gray-900 hover:bg-gray-700 transition-colors rounded-sm">
                  <Linkedin className="w-4 h-4 text-white" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-gray-900 hover:bg-gray-700 transition-colors rounded-sm">
                  <Youtube className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>

            <div className="border-l border-gray-300 pl-4">
              <p className="text-sm font-semibold text-gray-900">EGYPT</p>
              <p className="text-xs text-gray-500 mt-1">A BRIDGE TO A BRIGHTER TOMORROW</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© 2025 Sherif Yousry Advisory. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">Privacy</Link>
            <span className="text-gray-300">|</span>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">Terms</Link>
            <span className="text-gray-300">|</span>
            <Link href="/sitemap" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
