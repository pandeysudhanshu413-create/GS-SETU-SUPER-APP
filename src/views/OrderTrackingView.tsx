import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import {
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  RefreshCw,
  UtensilsCrossed,
  Truck,
  PackageCheck,
  XCircle,
  ChefHat,
  Receipt,
  ArrowRight
} from 'lucide-react';

interface OrderTrackingViewProps {
  initialOrderId?: string;
  recentOrderIds: string[];
  onGoToFood: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  initialOrderId = '',
  recentOrderIds,
  onGoToFood
}) => {
  const [searchInput, setSearchInput] = useState(initialOrderId);
  const [searchType, setSearchType] = useState<'id' | 'phone'>('id');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status step configuration
  const STATUS_STEPS: Array<{ status: OrderStatus; label: string; desc: string; icon: any }> = [
    { status: 'New', label: 'Order Received', desc: 'Recorded in database & sent to kitchen', icon: Receipt },
    { status: 'Accepted', label: 'Accepted by Kitchen', desc: 'Cook confirmed order availability', icon: CheckCircle2 },
    { status: 'Preparing', label: 'Cooking & Packing', desc: 'Hot Maggi/Pasta being prepared fresh', icon: ChefHat },
    { status: 'Out for Delivery', label: 'Out for Delivery', desc: 'Local delivery partner is on the way', icon: Truck },
    { status: 'Delivered', label: 'Delivered', desc: 'Enjoy your fresh meal!', icon: PackageCheck }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'New':
        return 0;
      case 'Accepted':
        return 1;
      case 'Preparing':
        return 2;
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
        return 4;
      case 'Cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const fetchOrders = async (query: string, type: 'id' | 'phone') => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    try {
      if (type === 'id') {
        const res = await fetch(`/api/orders/${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'No order found with this Order ID.');
        }
        setOrders([data.order]);
        setSelectedOrder(data.order);
      } else {
        const cleanPhone = query.replace(/\D/g, '');
        const res = await fetch(`/api/orders?phone=${cleanPhone}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Could not fetch orders for this phone number.');
        }
        if (data.orders.length === 0) {
          throw new Error(`No orders found for mobile number +91 ${cleanPhone}.`);
        }
        setOrders(data.orders);
        setSelectedOrder(data.orders[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Error looking up order. Please check the ID or phone number.');
      setOrders([]);
      setSelectedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (initialOrderId) {
      setSearchInput(initialOrderId);
      fetchOrders(initialOrderId, 'id');
    } else if (recentOrderIds.length > 0) {
      setSearchInput(recentOrderIds[0]);
      fetchOrders(recentOrderIds[0], 'id');
    }
  }, [initialOrderId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(searchInput, searchType);
  };

  const handleRefresh = () => {
    if (selectedOrder) {
      fetchOrders(selectedOrder.id, 'id');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#168548]">
          <Clock className="w-4 h-4" />
          Live Customer Tracking
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[#0B4626] tracking-tight">
          Track Your Food Order
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Real-time visibility from village kitchen to your door. Enter your Order ID or registered mobile number.
        </p>
      </div>

      {/* Search Bar & Mode Selector */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSearchType('id')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              searchType === 'id'
                ? 'bg-[#168548] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Search by Order ID (e.g. GSS-2026-XXXX)
          </button>
          <button
            type="button"
            onClick={() => setSearchType('phone')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              searchType === 'phone'
                ? 'bg-[#168548] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Search by 10-Digit Mobile Number
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={
                searchType === 'id'
                  ? 'Enter Order ID (e.g. GSS-2026-1234)'
                  : 'Enter 10-Digit Indian Mobile Number'
              }
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#168548]/30 focus:border-[#168548]"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchInput.trim()}
            className="px-5 py-2.5 bg-[#168548] hover:bg-[#126e3c] disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <span>Track Order</span>
            )}
          </button>
        </form>

        {/* Recent orders pill tags if available */}
        {recentOrderIds.length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Your Recent Orders:</span>
            {recentOrderIds.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSearchInput(id);
                  setSearchType('id');
                  fetchOrders(id, 'id');
                }}
                className="bg-[#EAF7EE] text-[#0B4626] hover:bg-emerald-100 font-mono font-bold px-2.5 py-1 rounded-md text-[11px] border border-emerald-200 transition-colors cursor-pointer"
              >
                {id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Lookup Unsuccessful</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* Multiple Orders Tabs (if searched by phone) */}
      {orders.length > 1 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Found {orders.length} orders for your phone:
          </div>
          <div className="flex flex-wrap gap-2">
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => setSelectedOrder(o)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                  selectedOrder?.id === o.id
                    ? 'bg-[#168548] text-white border-[#168548] shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{o.id}</span>
                <span className="opacity-80">({o.status})</span>
                <span className="opacity-90 font-mono">₹{o.totalAmount}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Order Details & Timeline */}
      {selectedOrder && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                  Order ID:
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#0B4626] font-mono">
                  {selectedOrder.id}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Placed on: {new Date(selectedOrder.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  selectedOrder.status === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : selectedOrder.status === 'Cancelled'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                }`}
              >
                Status: {selectedOrder.status}
              </span>

              <button
                onClick={handleRefresh}
                title="Refresh latest status from kitchen"
                className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#168548] rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cancellation Notice if cancelled */}
          {selectedOrder.status === 'Cancelled' && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm space-y-1">
              <div className="font-bold flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                This order was cancelled by the kitchen/admin.
              </div>
              {selectedOrder.statusReason && (
                <div className="text-red-700 pl-6">
                  Reason: "{selectedOrder.statusReason}"
                </div>
              )}
            </div>
          )}

          {/* Visual Step Timeline */}
          {selectedOrder.status !== 'Cancelled' && (
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Live Kitchen & Delivery Progress
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
                {STATUS_STEPS.map((step, idx) => {
                  const currentIdx = getStepIndex(selectedOrder.status);
                  const isDone = currentIdx >= idx;
                  const isCurrent = currentIdx === idx;
                  const IconComp = step.icon;

                  return (
                    <div
                      key={step.status}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-[#EAF7EE] border-[#168548] shadow-xs'
                          : isDone
                          ? 'bg-slate-50 border-emerald-200 text-slate-800'
                          : 'bg-white border-slate-100 opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isCurrent
                              ? 'bg-[#168548] text-white shadow-xs'
                              : isDone
                              ? 'bg-emerald-100 text-[#168548]'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Step {idx + 1}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-slate-900">{step.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{step.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Status History Log with timestamps */}
          {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Audit Trail & Status Updates
              </h4>
              <div className="space-y-2">
                {selectedOrder.statusHistory.map((hist, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#168548] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">{hist.status}</span> —{' '}
                      <span>{hist.note || 'Status updated'}</span>
                      <span className="text-slate-400 ml-2">
                        ({new Date(hist.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items & Bill */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Delivery address */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                Delivery Address
              </div>
              <div className="font-bold text-slate-900 text-sm">{selectedOrder.customerName}</div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>+91 {selectedOrder.customerPhone}</span>
              </div>
              <div className="flex items-start gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{selectedOrder.deliveryAddress}, {selectedOrder.location}</span>
              </div>
              {selectedOrder.deliveryInstructions && (
                <div className="text-slate-500 italic pt-1">
                  Note: "{selectedOrder.deliveryInstructions}"
                </div>
              )}
            </div>

            {/* Bill summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                Order Items ({selectedOrder.items.length})
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-[#0B4626]">
                <span>Total Paid / Payable:</span>
                <span>₹{selectedOrder.totalAmount}</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Delivery: {selectedOrder.deliveryFee === 0 ? 'FREE' : `₹${selectedOrder.deliveryFee}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No selection prompt */}
      {!selectedOrder && !loading && !error && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Order Selected for Tracking</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Place a food order or enter your Order ID above to see live kitchen preparation and delivery status.
          </p>
          <button
            onClick={onGoToFood}
            className="px-5 py-2.5 bg-[#168548] hover:bg-[#126e3c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Order Hot Maggi or Pasta
          </button>
        </div>
      )}
    </div>
  );
};
