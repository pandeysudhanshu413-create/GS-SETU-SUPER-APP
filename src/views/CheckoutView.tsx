import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Phone,
  User,
  MapPin,
  FileText,
  AlertCircle,
  Clock,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface CheckoutViewProps {
  cartItems: CartItem[];
  selectedLocation: string;
  onOrderSuccess: (order: Order) => void;
  onBackToMenu: () => void;
  onGoToTracking: (orderId: string) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  selectedLocation,
  onOrderSuccess,
  onBackToMenu,
  onGoToTracking
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [locationName, setLocationName] = useState(selectedLocation);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Billing calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const freeDeliveryThreshold = 150;
  const deliveryFee = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : 20;
  const totalAmount = subtotal + deliveryFee;

  const handlePhoneChange = (val: string) => {
    // Only allow digits, max 10
    const digits = val.replace(/\D/g, '').slice(0, 10);
    setCustomerPhone(digits);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(customerPhone)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).');
      return;
    }

    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 6) {
      setErrorMessage('Please enter a complete delivery address (house/shop no, street, mohalla).');
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty. Please add items before placing order.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        location: locationName.trim(),
        deliveryInstructions: deliveryInstructions.trim() || undefined,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Server failed to save order. Please try again.');
      }

      // Order successfully confirmed & saved in persistent DB!
      const savedOrder: Order = data.order;
      setCompletedOrder(savedOrder);
      onOrderSuccess(savedOrder);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Confetti is optional eye-candy
      }
    } catch (err: any) {
      console.error('Order submission failed:', err);
      setErrorMessage(err.message || 'Unable to connect to the database. Please check your internet or retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order is completed, show the official Order Confirmation screen
  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-200 shadow-xl text-center space-y-6">
          <div className="w-18 h-18 rounded-3xl bg-[#EAF7EE] text-[#168548] flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              Order Confirmed & Saved in Database
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B4626]">
              Thank You, {completedOrder.customerName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Your food order has been recorded and transmitted to the local kitchen for immediate preparation.
            </p>
          </div>

          {/* Unique Order ID Card */}
          <div className="bg-[#EAF7EE] rounded-2xl p-4 border border-emerald-300 max-w-sm mx-auto text-center space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#168548]">
              Your Official Order ID
            </div>
            <div className="text-2xl font-black text-[#0B4626] font-mono tracking-wider">
              {completedOrder.id}
            </div>
            <div className="text-[10px] text-slate-500">
              Save this ID to track your order status anytime
            </div>
          </div>

          {/* Details summary */}
          <div className="text-left bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
            <div className="flex justify-between pb-2 border-b border-slate-200 font-bold text-slate-800">
              <span>Delivery Details</span>
              <span className="text-[#168548]">Cash / UPI on Delivery</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px]">Recipient:</span>
                <span className="font-semibold text-slate-800">{completedOrder.customerName} ({completedOrder.customerPhone})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Location:</span>
                <span className="font-semibold text-slate-800">{completedOrder.location}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 block text-[10px]">Address:</span>
                <span className="font-medium text-slate-800">{completedOrder.deliveryAddress}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Items:</span>
              {completedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-slate-700">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="font-bold">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-[#0B4626]">
                <span>Total Amount:</span>
                <span>₹{completedOrder.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onGoToTracking(completedOrder.id)}
              className="flex-1 py-3.5 px-4 rounded-xl bg-[#168548] hover:bg-[#126e3c] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>Track Live Order Status</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onBackToMenu}
              className="py-3.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Order More Items
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">
          Please add dishes from our food marketplace before checking out.
        </p>
        <button
          onClick={onBackToMenu}
          className="px-5 py-2.5 bg-[#168548] text-white rounded-xl text-xs font-bold hover:bg-[#126e3c] cursor-pointer"
        >
          Return to Food Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top back button */}
      <div>
        <button
          onClick={onBackToMenu}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#168548] bg-slate-100 hover:bg-emerald-50 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Food Menu</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Checkout Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#168548]">
                Delivery Details
              </span>
              <h1 className="text-2xl font-black text-[#0B4626] mt-1">
                Customer & Delivery Information
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Please provide accurate contact and address details so our local rider can reach you without delay.
              </p>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Customer Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Customer Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar / Priya Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#168548]/30 focus:border-[#168548]"
                  />
                </div>
              </div>

              {/* 10-Digit Mobile Number */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  10-Digit Indian Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 flex items-center gap-1 pointer-events-none">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="8969922866"
                    value={customerPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full pl-16 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#168548]/30 focus:border-[#168548] font-mono tracking-wider"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Used for order status SMS and delivery captain calls.
                </p>
              </div>

              {/* Village / Town / City */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Village, Town, or City <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohania Village, Varanasi"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#168548]/30 focus:border-[#168548]"
                  />
                </div>
              </div>

              {/* Full Delivery Address */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full House / Shop / Street Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. House No. 42, Near Shiv Mandir, Main Gali, Village..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#168548]/30 focus:border-[#168548]"
                />
              </div>

              {/* Optional Instructions */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Delivery Landmark / Instructions <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Panchayat Bhawan, call before arrival"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#168548]/30 focus:border-[#168548]"
                />
              </div>

              {/* Payment Mode Note */}
              <div className="bg-[#EAF7EE] p-3.5 rounded-xl border border-emerald-200 text-xs text-[#0B4626] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#168548] shrink-0" />
                <span>Payment Mode: <strong>Cash on Delivery / UPI QR</strong> upon delivery. No advance online payment needed.</span>
              </div>

              {/* Privacy & Minor Protection Notice */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1.5 leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Privacy & Fair Access Notice</span>
                </div>
                <p>
                  GS Setu is open to all community members. Food ordering is unrestricted by age. We only collect the minimal details (Name, Phone, and Address) strictly necessary to deliver your meal. Customers under 18 may order with parental or guardian consent. We never sell, track, or share your personal data with third parties.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl bg-[#168548] hover:bg-[#126e3c] disabled:opacity-60 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving Order to Database & Dispatching...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Place Food Order • Pay ₹{totalAmount}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
              Order Summary ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </h3>

            {/* Items list */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div className="truncate">
                      <div className="font-bold text-slate-800 truncate">{item.product.name}</div>
                      <div className="text-[10px] text-slate-400">Qty: {item.quantity} × ₹{item.product.price}</div>
                    </div>
                  </div>
                  <div className="font-bold text-slate-900 shrink-0">
                    ₹{item.product.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Partner Fee</span>
                <span className="font-semibold text-slate-800">
                  {deliveryFee === 0 ? (
                    <span className="text-[#168548] font-bold">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Convenience Fee</span>
                <span className="text-[#168548] font-bold">₹0 (Zero Fee)</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-black text-slate-900 text-sm">Total Payable</span>
                <span className="text-2xl font-black text-[#0B4626]">₹{totalAmount}</span>
              </div>
            </div>

            {/* Guarantees */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Orders saved to permanent database with unique ID</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct kitchen notification to Asha Devi & local cooks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
