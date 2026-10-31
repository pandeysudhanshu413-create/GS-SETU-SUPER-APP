import React, { useState, useEffect } from 'react';
import { FoodProduct, Order, OrderStatus, PartnerApplication, EmailLog } from '../types';
import {
  ShieldCheck,
  Lock,
  LogOut,
  TrendingUp,
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ChefHat,
  RefreshCw,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Send,
  AlertCircle,
  ExternalLink,
  Phone,
  MapPin,
  Eye,
  X,
  Check
} from 'lucide-react';

interface AdminDashboardViewProps {
  onBackToApp: () => void;
  products: FoodProduct[];
  onRefreshProducts: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onBackToApp,
  products,
  onRefreshProducts
}) => {
  // Admin authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('gs_setu_admin_auth') === 'true';
  });
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Tabs: Orders, Products, Applications, Gmail Diagnostics
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'applications' | 'notifications'>('orders');

  // Orders state with persistent cache fallback
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const cached = localStorage.getItem('gs_setu_admin_orders_cache');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchTerm, setOrderSearchTerm] = useState<string>('');
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancelReasonInput, setCancelReasonInput] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Products modal state
  const [productModalMode, setProductModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<FoodProduct> | null>(null);
  const [deleteProductConfirm, setDeleteProductConfirm] = useState<FoodProduct | null>(null);

  // Partner Applications state with cache fallback
  const [applications, setApplications] = useState<PartnerApplication[]>(() => {
    try {
      const cached = localStorage.getItem('gs_setu_admin_apps_cache');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [appsLoading, setAppsLoading] = useState(false);

  // Notifications & Gmail logs state with cache fallback
  const [notificationLogs, setNotificationLogs] = useState<EmailLog[]>(() => {
    try {
      const cached = localStorage.getItem('gs_setu_admin_logs_cache');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [businessEmail, setBusinessEmail] = useState('pandeysudhanshu413@gmail.com');
  const [hasSmtpConfigured, setHasSmtpConfigured] = useState(false);
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<string | null>(null);

  // Handle Admin Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default demo passcode for hackathon demo: "gssetu2026" or "admin"
    if (adminPin === 'gssetu2026' || adminPin === 'admin' || adminPin === '1234') {
      setIsAuthenticated(true);
      localStorage.setItem('gs_setu_admin_auth', 'true');
      setAuthError(null);
    } else {
      setAuthError('Invalid Admin Passcode. Use demo code: gssetu2026');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('gs_setu_admin_auth');
  };

  // Resilient Fetch Orders
  const fetchOrders = async (isRetry = false) => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
          try {
            localStorage.setItem('gs_setu_admin_orders_cache', JSON.stringify(data.orders));
          } catch {}
        }
      }
    } catch {
      // Gracefully fall back to local cache without loud console error
      const cached = localStorage.getItem('gs_setu_admin_orders_cache');
      if (cached) {
        try {
          setOrders(JSON.parse(cached));
        } catch {}
      }
      if (!isRetry) {
        setTimeout(() => fetchOrders(true), 1500);
      }
    } finally {
      setOrdersLoading(false);
    }
  };

  // Resilient Fetch Applications
  const fetchApplications = async (isRetry = false) => {
    setAppsLoading(true);
    try {
      const res = await fetch('/api/partners');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.applications)) {
          setApplications(data.applications);
          try {
            localStorage.setItem('gs_setu_admin_apps_cache', JSON.stringify(data.applications));
          } catch {}
        }
      }
    } catch {
      const cached = localStorage.getItem('gs_setu_admin_apps_cache');
      if (cached) {
        try {
          setApplications(JSON.parse(cached));
        } catch {}
      }
      if (!isRetry) {
        setTimeout(() => fetchApplications(true), 1500);
      }
    } finally {
      setAppsLoading(false);
    }
  };

  // Resilient Fetch Notification Logs
  const fetchNotificationLogs = async (isRetry = false) => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.logs)) {
          setNotificationLogs(data.logs);
          setBusinessEmail(data.businessEmail || 'pandeysudhanshu413@gmail.com');
          setHasSmtpConfigured(Boolean(data.hasSmtpConfigured));
          try {
            localStorage.setItem('gs_setu_admin_logs_cache', JSON.stringify(data.logs));
          } catch {}
        }
      }
    } catch {
      const cached = localStorage.getItem('gs_setu_admin_logs_cache');
      if (cached) {
        try {
          setNotificationLogs(JSON.parse(cached));
        } catch {}
      }
      if (!isRetry) {
        setTimeout(() => fetchNotificationLogs(true), 1500);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchApplications();
      fetchNotificationLogs();
    }
  }, [isAuthenticated]);

  // Update Order Status Handler with immediate optimistic UI update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus, reason?: string) => {
    // Optimistically update local state & cache
    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          statusReason: reason || o.statusReason,
          updatedAt: new Date().toISOString(),
          statusHistory: [
            ...o.statusHistory,
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
              note: reason || `Status updated to ${newStatus} by GS Setu Admin`
            }
          ]
        };
      }
      return o;
    });
    setOrders(updatedOrders);
    try {
      localStorage.setItem('gs_setu_admin_orders_cache', JSON.stringify(updatedOrders));
    } catch {}

    setActionSuccessMsg(`Order #${orderId} marked as ${newStatus}`);
    setTimeout(() => setActionSuccessMsg(null), 4000);

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, reason })
      });
      const data = await res.json();
      if (data.success && selectedOrderForDetails && selectedOrderForDetails.id === orderId) {
        setSelectedOrderForDetails(data.order);
      }
      fetchOrders(true);
      fetchNotificationLogs(true);
    } catch {
      // Keep optimistic update
    }
  };

  // Product Add / Edit Submit
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      if (productModalMode === 'add') {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct)
        });
        const data = await res.json();
        if (data.success) {
          onRefreshProducts();
          setProductModalMode(null);
          setEditingProduct(null);
        }
      } else if (productModalMode === 'edit' && editingProduct.id) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct)
        });
        const data = await res.json();
        if (data.success) {
          onRefreshProducts();
          setProductModalMode(null);
          setEditingProduct(null);
        }
      }
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

  // Toggle Availability
  const handleToggleProductAvailability = async (product: FoodProduct) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !product.isAvailable })
      });
      const data = await res.json();
      if (data.success) {
        onRefreshProducts();
      }
    } catch (err) {
      console.error('Error toggling availability:', err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        onRefreshProducts();
        setDeleteProductConfirm(null);
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Send Test Email
  const handleSendTestEmail = async () => {
    setTestEmailLoading(true);
    setTestEmailResult(null);
    try {
      const res = await fetch('/api/notifications/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: businessEmail })
      });
      const data = await res.json();
      setTestEmailResult(data.message);
      fetchNotificationLogs();
    } catch (err: any) {
      setTestEmailResult(`Request error: ${err.message}`);
    } finally {
      setTestEmailLoading(false);
    }
  };

  // Calculations for Metrics Cards
  const totalOrdersCount = orders.length;
  const newOrdersCount = orders.filter((o) => o.status === 'New').length;
  const acceptedOrdersCount = orders.filter((o) => o.status === 'Accepted').length;
  const preparingOrdersCount = orders.filter((o) => o.status === 'Preparing').length;
  const outForDeliveryOrdersCount = orders.filter((o) => o.status === 'Out for Delivery').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'Delivered').length;
  const cancelledOrdersCount = orders.filter((o) => o.status === 'Cancelled').length;
  const totalSalesAmount = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  // Filtered orders list
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status.toLowerCase() !== orderStatusFilter.toLowerCase()) {
      return false;
    }
    if (orderSearchTerm.trim()) {
      const term = orderSearchTerm.toLowerCase();
      const matchId = o.id.toLowerCase().includes(term);
      const matchName = o.customerName.toLowerCase().includes(term);
      const matchPhone = o.customerPhone.includes(term);
      const matchLoc = o.location.toLowerCase().includes(term);
      if (!matchId && !matchName && !matchPhone && !matchLoc) return false;
    }
    return true;
  });

  // Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl max-w-md w-full space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#0B4626] text-emerald-300 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-[#0B4626]">GS Setu Admin Portal</h1>
            <p className="text-xs text-slate-500">
              Authorized access for kitchen order fulfillment & catalog control.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Admin Access Passcode
              </label>
              <input
                type="password"
                required
                placeholder="Enter admin passcode"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#168548]/30 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#168548] hover:bg-[#126e3c] text-white font-bold text-sm rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Sign In to Admin Dashboard
            </button>
          </form>

          {/* Quick Demo Login Button for Judges / Users */}
          <div className="pt-2 border-t border-slate-100 text-center space-y-2">
            <div className="text-[11px] text-slate-400">
              Demo Hackathon Mode (Passcode: <code className="font-bold text-slate-600">gssetu2026</code>)
            </div>
            <button
              type="button"
              onClick={() => {
                setAdminPin('gssetu2026');
                setIsAuthenticated(true);
                localStorage.setItem('gs_setu_admin_auth', 'true');
              }}
              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-[#0B4626] border border-emerald-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              🚀 1-Click Quick Demo Access
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={onBackToApp}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              ← Back to GS Setu Public App
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-20">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-[#168548] uppercase tracking-wider">
              Protected Admin Portal • Live Realtime
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B4626] mt-0.5">
            GS Setu Operations & Orders
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchOrders();
              fetchApplications();
              fetchNotificationLogs();
            }}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#168548] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Refresh database records"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          <button
            onClick={onBackToApp}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            View Customer App
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
            title="Log out of Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#168548]" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 8 Metric Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Orders</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{totalOrdersCount}</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-amber-700">New</div>
          <div className="text-xl font-black text-amber-900 mt-0.5">{newOrdersCount}</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-blue-200 bg-blue-50/30 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-blue-700">Accepted</div>
          <div className="text-xl font-black text-blue-900 mt-0.5">{acceptedOrdersCount}</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-indigo-200 bg-indigo-50/30 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-indigo-700">Preparing</div>
          <div className="text-xl font-black text-indigo-900 mt-0.5">{preparingOrdersCount}</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-purple-200 bg-purple-50/30 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-purple-700">Out for Deliv.</div>
          <div className="text-xl font-black text-purple-900 mt-0.5">{outForDeliveryOrdersCount}</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 bg-[#EAF7EE]/60 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-emerald-700">Delivered</div>
          <div className="text-xl font-black text-[#0B4626] mt-0.5">{deliveredOrdersCount}</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-red-200 bg-red-50/30 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-red-600">Cancelled</div>
          <div className="text-xl font-black text-red-800 mt-0.5">{cancelledOrdersCount}</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-300 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-500">Total Sales</div>
          <div className="text-xl font-black text-[#0B4626] mt-0.5">₹{totalSalesAmount}</div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#168548] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Live Orders Management ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'bg-[#168548] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Menu & Product Management ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'applications'
              ? 'bg-[#168548] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Seller & Partner Applications ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-[#168548] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Gmail Dispatcher & Logs</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: LIVE ORDERS MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {['all', 'New', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    orderStatusFilter === st
                      ? 'bg-[#168548] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all' ? 'All Statuses' : st}
                </button>
              ))}
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search ID, customer, phone..."
                value={orderSearchTerm}
                onChange={(e) => setOrderSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-[#168548]/30"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="p-3.5">Order ID & Date</th>
                    <th className="p-3.5">Customer & Phone</th>
                    <th className="p-3.5">Location & Address</th>
                    <th className="p-3.5">Dishes & Qty</th>
                    <th className="p-3.5">Total (₹)</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400">
                        {ordersLoading ? 'Loading orders from database...' : 'No orders found matching filters.'}
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* ID & Date */}
                        <td className="p-3.5 font-mono font-bold text-slate-900">
                          <div>{order.id}</div>
                          <div className="text-[10px] font-normal text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString('en-IN')} {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="p-3.5">
                          <div className="font-bold text-slate-800">{order.customerName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">+91 {order.customerPhone}</div>
                        </td>

                        {/* Address */}
                        <td className="p-3.5 max-w-[200px]">
                          <div className="font-semibold text-slate-800 truncate">{order.location}</div>
                          <div className="text-[11px] text-slate-500 truncate" title={order.deliveryAddress}>
                            {order.deliveryAddress}
                          </div>
                        </td>

                        {/* Items */}
                        <td className="p-3.5">
                          <div className="space-y-0.5">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="text-slate-700">
                                <span className="font-semibold">{item.name}</span> × {item.quantity}
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="p-3.5 font-black text-sm text-[#0B4626]">
                          ₹{order.totalAmount}
                        </td>

                        {/* Status */}
                        <td className="p-3.5">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              order.status === 'New'
                                ? 'bg-amber-100 text-amber-900'
                                : order.status === 'Accepted'
                                ? 'bg-blue-100 text-blue-900'
                                : order.status === 'Preparing'
                                ? 'bg-indigo-100 text-indigo-900'
                                : order.status === 'Out for Delivery'
                                ? 'bg-purple-100 text-purple-900'
                                : order.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-red-100 text-red-900'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button
                              onClick={() => setSelectedOrderForDetails(order)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {order.status === 'New' && (
                              <>
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'Accepted')}
                                  className="px-2.5 py-1 bg-[#168548] hover:bg-[#126e3c] text-white rounded-lg font-bold text-[11px] cursor-pointer"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => {
                                    setCancelModalOrder(order);
                                    setCancelReasonInput('');
                                  }}
                                  className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-bold text-[11px] cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {order.status === 'Accepted' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'Preparing')}
                                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                              >
                                Mark Preparing
                              </button>
                            )}

                            {order.status === 'Preparing' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'Out for Delivery')}
                                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                              >
                                Dispatch Rider
                              </button>
                            )}

                            {order.status === 'Out for Delivery' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                              >
                                Mark Delivered
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: MENU & PRODUCTS MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">Food Menu Catalog</h2>
              <p className="text-xs text-slate-500">
                Manage prices, availability, and menu items. Changes reflect immediately in customer app.
              </p>
            </div>
            <button
              onClick={() => {
                setProductModalMode('add');
                setEditingProduct({
                  name: '',
                  description: '',
                  price: 40,
                  category: 'Maggi & Noodles',
                  image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
                  isVeg: true,
                  preparationTimeMinutes: 12,
                  sellerName: 'Local Kitchen',
                  sellerLocation: 'Rohania Market',
                  tags: ['Fresh', 'Desi Spices']
                });
              }}
              className="px-4 py-2 bg-[#168548] hover:bg-[#126e3c] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase text-[#168548] bg-[#EAF7EE] px-1.5 py-0.5 rounded-sm">
                        {p.category}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 truncate mt-1">{p.name}</h4>
                      <div className="text-sm font-extrabold text-[#0B4626]">₹{p.price}</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>
                  <div className="text-[11px] text-slate-400">
                    Seller: <strong className="text-slate-600">{p.sellerName}</strong> ({p.sellerLocation})
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleToggleProductAvailability(p)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                      p.isAvailable
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {p.isAvailable ? 'In Stock' : 'Out of Stock'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setProductModalMode('edit');
                        setEditingProduct({ ...p });
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      title="Edit dish"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteProductConfirm(p)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                      title="Delete dish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: PARTNER & SELLER APPLICATIONS */}
      {/* ========================================================= */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">Partner & Seller Onboarding Requests</h2>
            <p className="text-xs text-slate-500">
              Profiles submitted through the public website. Stored in persistent database.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Applicant Name</th>
                    <th className="p-3.5">Phone Number</th>
                    <th className="p-3.5">Village / Locality</th>
                    <th className="p-3.5">Offering / Vehicle</th>
                    <th className="p-3.5">Experience / Notes</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-slate-400">
                        {appsLoading ? 'Loading applications...' : 'No partner applications received yet.'}
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80">
                        <td className="p-3.5 text-slate-400">
                          {new Date(app.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="p-3.5 font-bold uppercase text-[10px]">
                          <span
                            className={`px-2 py-0.5 rounded-sm ${
                              app.type === 'seller'
                                ? 'bg-amber-100 text-amber-800'
                                : app.type === 'delivery'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {app.type}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-slate-800">{app.fullName}</td>
                        <td className="p-3.5 font-mono text-slate-600">+91 {app.phone}</td>
                        <td className="p-3.5 text-slate-700">{app.villageTown}</td>
                        <td className="p-3.5 text-slate-700">{app.serviceCategory}</td>
                        <td className="p-3.5 text-slate-500 max-w-xs truncate" title={app.experienceDescription}>
                          {app.experienceDescription || 'N/A'}
                        </td>
                        <td className="p-3.5 font-bold text-emerald-700">{app.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: GMAIL DISPATCHER & DIAGNOSTICS */}
      {/* ========================================================= */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#168548]">
                  Automated Order Notifications
                </span>
                <h2 className="text-xl font-black text-[#0B4626]">
                  Gmail Notification Engine & Diagnostics
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Every order placed on GS Setu is automatically routed through our server-side notification dispatcher.
                </p>
              </div>

              <button
                onClick={handleSendTestEmail}
                disabled={testEmailLoading}
                className="px-4 py-2.5 bg-[#168548] hover:bg-[#126e3c] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                {testEmailLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Test Email Dispatch to Founder</span>
              </button>
            </div>

            {/* Test result banner */}
            {testEmailResult && (
              <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-xs text-slate-800">
                <strong>Result:</strong> {testEmailResult}
              </div>
            )}

            {/* Status cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Configured Recipient</div>
                <div className="font-bold text-slate-800 text-sm">{businessEmail}</div>
                <div className="text-[11px] text-slate-500">Founder & Operations Lead (Sudhanshu Pandey)</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">SMTP Connection Status</div>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {hasSmtpConfigured ? (
                    <span className="text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Live Gmail SMTP Connected
                    </span>
                  ) : (
                    <span className="text-amber-800 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600" />
                      Server Queue Active (Awaiting SMTP Credentials)
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500">
                  {hasSmtpConfigured
                    ? 'Orders dispatch live emails directly to your Gmail inbox.'
                    : 'All order notification payloads are formatted and logged below with zero loss.'}
                </div>
              </div>
            </div>

            {/* Setup Instructions Accordion */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
              <div className="font-bold text-[#0B4626] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#168548]" />
                How to activate live Gmail SMTP delivery in 1 minute:
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-700 pl-1">
                <li>Go to your Google Account at <code className="bg-white px-1 py-0.5 rounded border border-emerald-200 font-mono">myaccount.google.com/apppasswords</code></li>
                <li>Generate an <strong>App Password</strong> for app name "GS Setu".</li>
                <li>Add these two variables to your environment / secrets:
                  <div className="bg-white p-2 rounded-lg border border-emerald-200 font-mono mt-1 space-y-0.5">
                    <div>GMAIL_USER="your-email@gmail.com"</div>
                    <div>GMAIL_APP_PASSWORD="your-16-char-password"</div>
                  </div>
                </li>
                <li>Click "Test Email Dispatch" above to confirm instant live delivery.</li>
              </ol>
            </div>
          </div>

          {/* Email Outbox Logs Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm space-y-2 p-6">
            <h3 className="font-black text-base text-slate-900">
              Notification Dispatch Outbox Logs ({notificationLogs.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="p-3">Time</th>
                    <th className="p-3">Order Ref</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Recipient</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {notificationLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        No notification dispatches recorded yet. Place an order to see it logged here!
                      </td>
                    </tr>
                  ) : (
                    notificationLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80">
                        <td className="p-3 text-slate-400 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="p-3 font-bold text-slate-800 font-mono">{log.orderId}</td>
                        <td className="p-3 font-medium text-slate-800 max-w-xs truncate" title={log.subject}>
                          {log.subject}
                        </td>
                        <td className="p-3 text-slate-600">{log.recipient}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              log.status === 'Sent'
                                ? 'bg-emerald-100 text-emerald-800'
                                : log.status === 'Logged'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 max-w-xs truncate" title={log.details}>
                          {log.details}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ORDER DETAILS */}
      {/* ========================================================= */}
      {selectedOrderForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="p-5 bg-[#0B4626] text-white flex items-center justify-between">
              <div>
                <div className="text-[10px] text-emerald-300 uppercase font-bold">Order Details</div>
                <h3 className="font-mono font-bold text-lg">{selectedOrderForDetails.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrderForDetails(null)}
                className="p-1 rounded-lg hover:bg-emerald-800 text-emerald-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-black text-sm text-[#0B4626] bg-[#EAF7EE] px-2.5 py-1 rounded-full">
                  {selectedOrderForDetails.status}
                </span>
              </div>

              <div>
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Customer Information
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 text-sm">{selectedOrderForDetails.customerName}</div>
                  <div className="text-slate-600">Phone: +91 {selectedOrderForDetails.customerPhone}</div>
                  <div className="text-slate-600">Location: {selectedOrderForDetails.location}</div>
                  <div className="text-slate-600">Address: {selectedOrderForDetails.deliveryAddress}</div>
                  {selectedOrderForDetails.deliveryInstructions && (
                    <div className="text-slate-500 italic">
                      Special Note: "{selectedOrderForDetails.deliveryInstructions}"
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Ordered Dishes
                </div>
                <div className="space-y-1.5">
                  {selectedOrderForDetails.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span>{it.name} × {it.quantity}</span>
                      <span className="font-bold text-slate-800">₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-[#0B4626]">
                <span>Total Collected / Payable:</span>
                <span>₹{selectedOrderForDetails.totalAmount}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedOrderForDetails(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CANCEL / REJECT REASON */}
      {/* ========================================================= */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-red-900 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <span>Cancel Order #{cancelModalOrder.id}</span>
            </h3>
            <p className="text-xs text-slate-600">
              Please enter the specific reason for rejecting this order (e.g. "Kitchen item out of stock", "Location too far"):
            </p>
            <input
              type="text"
              required
              placeholder="e.g. Masala Maggi out of stock today"
              value={cancelReasonInput}
              onChange={(e) => setCancelReasonInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-red-400"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelModalOrder(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Go Back
              </button>
              <button
                onClick={() => {
                  handleUpdateOrderStatus(cancelModalOrder.id, 'Cancelled', cancelReasonInput || 'Kitchen unavailable');
                  setCancelModalOrder(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ========================================================= */}
      {productModalMode && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="p-5 bg-[#0B4626] text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {productModalMode === 'add' ? 'Add New Dish to Menu' : 'Edit Dish Details'}
              </h3>
              <button
                onClick={() => {
                  setProductModalMode(null);
                  setEditingProduct(null);
                }}
                className="text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#168548]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingProduct.price || 40}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category *</label>
                <select
                  value={editingProduct.category || 'Maggi & Noodles'}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Maggi & Noodles">Maggi & Noodles</option>
                  <option value="Pasta & Italian">Pasta & Italian</option>
                  <option value="Desi Macaroni">Desi Macaroni</option>
                  <option value="Tea & Snacks">Tea & Snacks</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL or Local Path</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /images/masala_maggi.jpg or https://..."
                  value={editingProduct.image || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Seller / Kitchen Name</label>
                  <input
                    type="text"
                    value={editingProduct.sellerName || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sellerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Seller Location</label>
                  <input
                    type="text"
                    value={editingProduct.sellerLocation || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sellerLocation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setProductModalMode(null);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#168548] hover:bg-[#126e3c] text-white rounded-xl font-bold"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE PRODUCT CONFIRMATION */}
      {/* ========================================================= */}
      {deleteProductConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-red-900 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              <span>Delete Dish Permanently?</span>
            </h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to remove <strong>"{deleteProductConfirm.name}"</strong> from the GS Setu food catalog?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteProductConfirm(null)}
                className="px-3.5 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteProductConfirm.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
