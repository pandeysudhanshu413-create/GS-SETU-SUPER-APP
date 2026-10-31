import React, { useState } from 'react';
import {
  Store,
  Bike,
  Wrench,
  CheckCircle2,
  Send,
  Heart,
  TrendingUp,
  MapPin,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface SellerPartnerViewProps {
  initialTab?: 'seller' | 'delivery' | 'worker';
  setCurrentView: (view: string) => void;
}

export const SellerPartnerView: React.FC<SellerPartnerViewProps> = ({
  initialTab = 'seller',
  setCurrentView
}) => {
  const [activeTab, setActiveTab] = useState<'seller' | 'delivery' | 'worker'>(initialTab);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [villageTown, setVillageTown] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [experienceDescription, setExperienceDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName.trim() || !phone.trim()) {
      setErrorMessage('Please provide your full name and 10-digit mobile number.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/partners/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeTab,
          fullName: fullName.trim(),
          phone: cleanPhone,
          villageTown: villageTown.trim(),
          serviceCategory: serviceCategory.trim() || activeTab,
          experienceDescription: experienceDescription.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit application.');
      }

      setSuccessMessage(
        `Application received! Thank you, ${fullName}. Your profile has been saved to the GS Setu database. Our local team will contact you at +91 ${cleanPhone}.`
      );
      // Reset form
      setFullName('');
      setPhone('');
      setVillageTown('');
      setServiceCategory('');
      setExperienceDescription('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to submit application. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-[#0B4626] to-[#168548] text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-4">
        <span className="inline-flex items-center gap-1.5 bg-emerald-800/80 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Bharat Micro-Entrepreneur Network
        </span>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
          Grow Your Livelihood with GS Setu
        </h1>
        <p className="text-xs sm:text-base text-emerald-100 max-w-2xl leading-relaxed">
          Founded by Sudhanshu Pandey, GS Setu connects local talent, home-based women cooks, kirana shops, and rural artisans with high-demand neighborhood customers.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => {
            setActiveTab('seller');
            setSuccessMessage(null);
          }}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'seller'
              ? 'bg-[#168548] text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Become a Seller / Home Cook</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('delivery');
            setSuccessMessage(null);
          }}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'delivery'
              ? 'bg-[#168548] text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Become a Delivery Captain</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('worker');
            setSuccessMessage(null);
          }}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'worker'
              ? 'bg-[#168548] text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Local Worker / Service Provider</span>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Benefit Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-black text-lg text-slate-900">
              {activeTab === 'seller' && 'Why Sell on GS Setu?'}
              {activeTab === 'delivery' && 'Why Deliver with GS Setu?'}
              {activeTab === 'worker' && 'Why List as a Local Professional?'}
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600">
              {activeTab === 'seller' && (
                <>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#168548] shrink-0 mt-0.5" />
                    <span><strong>Zero Listing Fee:</strong> Start selling Maggi, pasta, snacks, or crafts with zero upfront investment.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#168548] shrink-0 mt-0.5" />
                    <span><strong>Women Empowerment:</strong> Tailored for home cooks and self-help groups who prefer preparing food from home.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#168548] shrink-0 mt-0.5" />
                    <span><strong>Direct Orders:</strong> Receive customer orders with phone alerts and automatic bill calculation.</span>
                  </div>
                </>
              )}

              {activeTab === 'delivery' && (
                <>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#168548] shrink-0 mt-0.5" />
                    <span><strong>Flexible Hours:</strong> Deliver 2 hours in the morning or 4 hours in the evening as per your farming or study routine.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#168548] shrink-0 mt-0.5" />
                    <span><strong>Use Cycle or Bike:</strong> Both bicycles and two-wheelers are welcome for hyper-local village deliveries.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#168548] shrink-0 mt-0.5" />
                    <span><strong>Weekly Bank/UPI Payouts:</strong> Transparent per-delivery incentives directly deposited to your account.</span>
                  </div>
                </>
              )}

              {activeTab === 'worker' && (
                <>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#168548] shrink-0 mt-0.5" />
                    <span><strong>Direct Customer Leads:</strong> Get nearby service calls for electrical, plumbing, carpentry, or pump repair.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#168548] shrink-0 mt-0.5" />
                    <span><strong>Fair Pricing:</strong> You decide your standard inspection and labor fees without commission cuts.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#168548] shrink-0 mt-0.5" />
                    <span><strong>Verified Badge:</strong> Stand out in your tehsil or panchayat as a verified GS Setu service professional.</span>
                  </div>
                </>
              )}
            </div>

            {/* Disclaimer pill */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Note: GS Setu is an open enablement platform. Submitting an application enters your profile into our pilot onboarding database. We do not guarantee fixed employment or assured income.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Application Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#168548]">
                Partner Onboarding Application
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0B4626] mt-1">
                Register as {activeTab === 'seller' ? 'Seller / Kitchen' : activeTab === 'delivery' ? 'Delivery Captain' : 'Service Specialist'}
              </h2>
              <p className="text-xs text-slate-500">
                All details will be saved to our persistent database and reviewed by the GS Setu admin team.
              </p>
            </div>

            {/* Success alert */}
            {successMessage && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold flex items-start gap-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-[#168548] shrink-0 mt-0.5" />
                <div>{successMessage}</div>
              </div>
            )}

            {/* Error alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sudhanshu Pandey / Asha Devi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#168548]/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  10-Digit WhatsApp / Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 8969922866"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#168548]/30 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Village, Town, or Tehsil <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohania Village, Varanasi or Phulpur"
                  value={villageTown}
                  onChange={(e) => setVillageTown(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#168548]/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {activeTab === 'seller' ? 'What do you cook or sell?' : activeTab === 'delivery' ? 'Vehicle Type (Cycle / Motorcycle)' : 'Service Specialization (Electrician, Plumber, etc.)'}
                </label>
                <input
                  type="text"
                  placeholder={
                    activeTab === 'seller'
                      ? 'e.g. Masala Maggi, Macaroni, Sweets, Spices'
                      : activeTab === 'delivery'
                      ? 'e.g. Hero Splendor Motorcycle / Bicycle'
                      : 'e.g. Domestic House Wiring & Water Motor Repair'
                  }
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#168548]/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Brief Background / Experience <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us a little bit about your setup, shop, or past experience..."
                  value={experienceDescription}
                  onChange={(e) => setExperienceDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#168548]/30"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 bg-[#168548] hover:bg-[#126e3c] disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <span>Saving Application to Database...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Partner Application</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
