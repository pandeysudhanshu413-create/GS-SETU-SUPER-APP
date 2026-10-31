import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  HelpCircle,
  FileText,
  UserCheck
} from 'lucide-react';

interface ContactViewProps {
  setCurrentView: (view: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ setCurrentView }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="bg-[#EAF7EE] rounded-3xl p-6 sm:p-10 border border-emerald-200 text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#168548] bg-white px-3 py-1 rounded-full border border-emerald-200 inline-block shadow-2xs">
          Local Support & Community Desk
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-[#0B4626]">
          Contact GS Setu
        </h1>
        <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
          Have questions about ordering, becoming a village kitchen partner, or launching GS Setu in your town? Reach out directly to founder Sudhanshu Pandey and the operational team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <h3 className="font-black text-lg text-slate-900 border-b border-slate-100 pb-3">
              Direct Contact Channels
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF7EE] text-[#168548] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Official Email</div>
                  <a
                    href="mailto:pandeysudhanshu413@gmail.com"
                    className="text-[#168548] hover:underline font-semibold"
                  >
                    pandeysudhanshu413@gmail.com
                  </a>
                  <div className="text-[11px] text-slate-400">Direct inbox of Founder Sudhanshu Pandey</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF7EE] text-[#168548] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Customer Helpline & WhatsApp</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <a
                      href="tel:+918969922866"
                      className="text-[#168548] hover:underline font-mono font-bold text-sm"
                    >
                      +91 89699 22866
                    </a>
                    <a
                      href="https://wa.me/918969922866?text=Namaste%20GS%20Setu%20Team"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 text-[10px] font-bold hover:bg-emerald-200 transition-colors"
                    >
                      WhatsApp
                    </a>
                  </div>
                  <div className="text-[11px] text-slate-400">Hindi & English direct phone & WhatsApp support</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF7EE] text-[#168548] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Pilot Operational Corridor</div>
                  <div className="text-slate-700">Varanasi - Rohania / Prayagraj Rural Hub</div>
                  <div className="text-[11px] text-slate-400">Uttar Pradesh, India</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF7EE] text-[#168548] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Active Service Timings</div>
                  <div className="text-slate-700">7:00 AM – 10:00 PM (All 7 Days)</div>
                  <div className="text-[11px] text-slate-400">Local deliveries dispatched continuously</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ card */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 text-xs space-y-3">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#168548]" />
              Frequently Asked Questions
            </h4>
            <div className="space-y-2">
              <div>
                <strong className="text-slate-800 block">Q: Which services can I order right now?</strong>
                <span className="text-slate-600">Currently, our Food Marketplace (Maggi, Pasta, Macaroni & snacks) is 100% live. Other services are releasing in phased updates.</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <strong className="text-slate-800 block">Q: What is the delivery charge?</strong>
                <span className="text-slate-600">FREE delivery on all food orders of ₹150 or more. For smaller orders, a flat local charge of ₹20 applies.</span>
              </div>
            </div>
          </div>

          {/* Privacy & Minor Protection Statement */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#168548]" />
              Data Privacy & Fair Access (All Ages)
            </h4>
            <p className="text-slate-600 leading-relaxed">
              GS Setu welcomes all local customers regardless of age. Food ordering does not require personal Google accounts or age-gating. We practice strict data minimization—only your delivery name, phone number, and street address are collected solely to bring your meal to your door.
            </p>
            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2">
              Customers under 18 may order with parental/guardian guidance. Personal data is never monetized, tracked, or shared.
            </div>
          </div>
        </div>

        {/* Right Column: Feedback / Message Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#168548]">
                Send a Message
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0B4626] mt-1">
                Reach Out to the GS Setu Team
              </h2>
              <p className="text-xs text-slate-500">
                Whether you have product feedback or want to partner in your village, leave a note below.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#168548] mx-auto" />
                <h3 className="font-black text-lg text-emerald-900">Message Received!</h3>
                <p className="text-xs text-emerald-700">
                  Thank you for connecting with GS Setu. Founder Sudhanshu Pandey or a team member will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-2 bg-[#168548] text-white text-xs font-bold rounded-xl"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sudhanshu Pandey"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#168548]/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="name@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Your Message / Inquiry <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your feedback or inquiry..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#168548] hover:bg-[#126e3c] text-white font-extrabold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Message to GS Setu Desk</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
