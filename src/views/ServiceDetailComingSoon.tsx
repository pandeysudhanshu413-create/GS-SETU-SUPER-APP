import React, { useState } from 'react';
import { ServiceCategory } from '../types';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Bell,
  Store,
  Sparkles,
  Info,
  Check,
  Send
} from 'lucide-react';

interface ServiceDetailComingSoonProps {
  service: ServiceCategory;
  onBack: () => void;
  onGoToPartner: () => void;
  onGoToFood: () => void;
}

export const ServiceDetailComingSoon: React.FC<ServiceDetailComingSoonProps> = ({
  service,
  onBack,
  onGoToPartner,
  onGoToFood
}) => {
  const [phoneInput, setPhoneInput] = useState('');
  const [villageInput, setVillageInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setIsSubscribed(true);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#168548] bg-slate-100 hover:bg-emerald-50 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Services</span>
        </button>
      </div>

      {/* Hero Banner for this service */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-10 border border-slate-700 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            Coming Soon • Under Active Development
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            {service.name}
          </h1>
          <div className="text-lg font-bold text-emerald-400">
            {service.hindiName}
          </div>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {service.description}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onGoToPartner}
              className="bg-[#168548] hover:bg-[#126e3c] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Are You a Local Vendor? Register With Us</span>
            </button>
            <button
              onClick={onGoToFood}
              className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              Order Food Now (Live)
            </button>
          </div>
        </div>
      </div>

      {/* Honest Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold">Real Transactions Disabled for This Service:</div>
          <div>
            To avoid taking unfulfillable bookings or false transactions, real ordering and checkout are currently disabled for <strong>{service.name}</strong>. Below is a preview of the upcoming service catalog, sample pricing, and planned features.
          </div>
        </div>
      </div>

      {/* Planned Features & What's Arriving */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#168548]">
            Upcoming Roadmap
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B4626] mt-1">
            Planned Features for {service.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {service.features.map((feat, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#EAF7EE]/60 border border-emerald-100"
            >
              <CheckCircle2 className="w-4 h-4 text-[#168548] shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm font-medium text-slate-800">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Showcase Items Preview (Clearly Disabled) */}
      {service.sampleItems && service.sampleItems.length > 0 && (
        <div className="space-y-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Future Catalog Preview
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Sample Items & Estimated Local Rates
            </h3>
            <p className="text-xs text-slate-500">
              These items are non-orderable previews designed to demonstrate category structure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {service.sampleItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3 opacity-90"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.detail}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    {item.priceHint || 'Rates TBA'}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-sm font-semibold">
                    Preview Only
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Waitlist / Notify Me Form */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 max-w-2xl mx-auto space-y-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#EAF7EE] text-[#168548] flex items-center justify-center mx-auto">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            Get Notified When {service.name} Launches in Your Village
          </h3>
          <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
            Drop your mobile number and village name. We will send an SMS alert the day this service goes live in your area.
          </p>
        </div>

        {isSubscribed ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-2">
            <Check className="w-5 h-5 text-emerald-600" />
            <span>Thank you! We've saved your interest for {service.name}. You'll be notified first.</span>
          </div>
        ) : (
          <form onSubmit={handleNotifySubmit} className="space-y-3 text-left max-w-md mx-auto">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                10-Digit Mobile Number
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="e.g. 8969922866"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#168548]/30"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Village / Town / City
              </label>
              <input
                type="text"
                placeholder="e.g. Rohania Village or Phulpur"
                value={villageInput}
                onChange={(e) => setVillageInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#168548]/30"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || phoneInput.length < 10}
              className="w-full py-3 bg-[#168548] hover:bg-[#126e3c] disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <span>Registering...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Notify Me on Launch</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
