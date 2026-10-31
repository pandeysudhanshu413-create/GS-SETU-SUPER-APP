import React, { useState } from 'react';
import { SUPER_APP_SERVICES } from '../data/servicesData';
import { ServiceCategory } from '../types';
import {
  UtensilsCrossed,
  BookOpen,
  Apple,
  ShoppingBag,
  Car,
  Bike,
  Wrench,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface ServicesViewProps {
  onSelectService: (service: ServiceCategory) => void;
  setCurrentView: (view: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  onSelectService,
  setCurrentView
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'enabled' | 'upcoming'>('all');

  const renderIcon = (name: string, className = 'w-6 h-6') => {
    switch (name) {
      case 'UtensilsCrossed':
        return <UtensilsCrossed className={className} />;
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'Apple':
        return <Apple className={className} />;
      case 'ShoppingBag':
        return <ShoppingBag className={className} />;
      case 'Car':
        return <Car className={className} />;
      case 'Bike':
        return <Bike className={className} />;
      case 'Wrench':
        return <Wrench className={className} />;
      default:
        return <Layers className={className} />;
    }
  };

  const filteredServices = SUPER_APP_SERVICES.filter((svc) => {
    if (activeFilter === 'enabled') return svc.badge === 'Enabled';
    if (activeFilter === 'upcoming') return svc.badge === 'Coming Soon';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-[#EAF7EE] rounded-3xl p-6 sm:p-10 border border-emerald-200">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white text-[#168548] text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 shadow-2xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Complete Super App Architecture
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0B4626] tracking-tight">
            GS Setu Services Directory
          </h1>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Our multi-service platform integrates 8 essential rural and urban daily services. In this initial release, <strong>Food Ordering is fully active</strong> with live checkout, tracking, and kitchen dispatch. All other services are displayed with future previews and partner waitlists.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-6">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#168548] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Services (8)
          </button>
          <button
            onClick={() => setActiveFilter('enabled')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'enabled'
                ? 'bg-[#168548] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Live Ordering (1)</span>
          </button>
          <button
            onClick={() => setActiveFilter('upcoming')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'upcoming'
                ? 'bg-[#168548] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="w-3 h-3 text-amber-500" />
            <span>Coming Soon (7)</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const isEnabled = service.badge === 'Enabled';
          return (
            <div
              key={service.id}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between shadow-xs hover:shadow-md ${
                isEnabled
                  ? 'border-[#168548] ring-2 ring-[#168548]/20 bg-gradient-to-b from-[#EAF7EE]/40 to-white'
                  : 'border-slate-200 hover:border-emerald-200'
              }`}
            >
              <div>
                {/* Top Info */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      isEnabled
                        ? 'bg-[#168548] text-white shadow-md shadow-emerald-900/20'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {renderIcon(service.iconName, 'w-7 h-7')}
                  </div>

                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                      isEnabled
                        ? 'bg-[#168548] text-white'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {service.badge}
                  </span>
                </div>

                {/* Service Name & Hindi */}
                <h3 className="text-xl font-black text-slate-900">
                  {service.name}
                </h3>
                <div className="text-xs font-bold text-[#168548] mb-2">
                  {service.hindiName}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Key Features Bullet List */}
                <div className="space-y-1.5 mb-6 text-xs text-slate-700">
                  {service.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#168548] shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    if (isEnabled) {
                      setCurrentView('food');
                    } else {
                      onSelectService(service);
                    }
                  }}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isEnabled
                      ? 'bg-[#168548] hover:bg-[#126e3c] text-white shadow-md shadow-emerald-900/20'
                      : 'bg-slate-100 hover:bg-[#EAF7EE] text-slate-800 hover:text-[#168548]'
                  }`}
                >
                  <span>{isEnabled ? 'Open Food Marketplace' : 'View Service Preview & Roadmap'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Honest Note for Users */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold">Transparent Service Status:</div>
          <div>
            To ensure zero friction and high delivery reliability, only Food Ordering is currently connected to active kitchen fulfillment and rider dispatch. Other categories are visible to demonstrate our super app architecture and invite local vendor registrations.
          </div>
        </div>
      </div>
    </div>
  );
};
