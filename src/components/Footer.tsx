import React from 'react';
import {
  Heart,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
  openAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView, openAdmin }) => {
  const handleNav = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Top Banner inside Footer */}
      <div className="bg-[#0B4626] border-b border-emerald-900/50 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 text-emerald-200 text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              Empowering Bharat’s Micro-Economies
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Connecting Local Needs with Local Opportunities
            </h3>
            <p className="text-emerald-100 text-sm mt-1 max-w-xl">
              From village kitchens and local kirana shops to home workers and transport hubs — GS Setu bridges the digital divide for Indian communities.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleNav('seller')}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              List Your Business
            </button>
            <button
              onClick={() => handleNav('food')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-emerald-400/30 transition-all cursor-pointer"
            >
              Order Food Now (Live)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand & Founder */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#168548] to-emerald-700 flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-900/50">
                GS
              </div>
              <span className="text-2xl font-black text-white tracking-tight">GS SETU</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              GS Setu is a multi-service local commerce super app platform designed to connect villages, small towns, cities, local businesses, customers, and service providers across India.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                Founder & Initiative
              </div>
              <div className="text-emerald-400 font-bold text-sm">
                Sudhanshu Pandey
              </div>
              <div className="text-slate-400">
                Dedicated to rural-urban integration, women entrepreneurship & local self-reliance.
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Local Seva
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">Local Growth</span>
              <span>•</span>
              <span>Made in India</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Super App Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => handleNav('food')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-400 font-semibold cursor-pointer"
                >
                  <span>Food Marketplace</span>
                  <span className="text-[9px] bg-emerald-900/80 text-emerald-300 px-1.5 py-0.2 rounded-sm uppercase">
                    Active
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Books & Stationery</span>
                  <span className="text-[9px] text-amber-400 bg-amber-950/60 px-1 py-0.2 rounded-xs">Soon</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Fruits & Vegetables</span>
                  <span className="text-[9px] text-amber-400 bg-amber-950/60 px-1 py-0.2 rounded-xs">Soon</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Grocery & Essentials</span>
                  <span className="text-[9px] text-amber-400 bg-amber-950/60 px-1 py-0.2 rounded-xs">Soon</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Transport & Auto</span>
                  <span className="text-[9px] text-amber-400 bg-amber-950/60 px-1 py-0.2 rounded-xs">Soon</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Workers & Helpers</span>
                  <span className="text-[9px] text-amber-400 bg-amber-950/60 px-1 py-0.2 rounded-xs">Soon</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Community & Partners
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => handleNav('seller')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Become a Seller
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('partner')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Become a Delivery Partner
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('tracking')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Track Customer Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Support & Help Center
                </button>
              </li>
              <li>
                <button
                  onClick={openAdmin}
                  className="hover:text-emerald-400 text-slate-400 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Dashboard</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Pilot Info */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Contact & Outreach
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Headquarters: Varanasi / Prayagraj Rural Corridor, Uttar Pradesh, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="mailto:pandeysudhanshu413@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  pandeysudhanshu413@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="tel:+918969922866"
                  className="hover:text-white transition-colors"
                >
                  +91 89699 22866 (Helpline)
                </a>
              </div>
              <div className="pt-2 text-[11px] text-slate-500">
                Operating hours: 7:00 AM – 10:00 PM IST
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} GS Setu. Founded by Sudhanshu Pandey. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNav('contact')}
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleNav('contact')}
              className="hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </button>
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> for Bharat
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
