import React, { useState, useEffect } from 'react';
import { ActivePage, OrderDetails, OrderStatus } from '../types';
import { getCustomerOrders } from '../services/cafeApi';
import { useAuth } from '../context/AuthContext';
import { Clock, ShoppingBag, ArrowRight, Truck, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface OrderHistoryPageProps {
  setActivePage: (page: ActivePage) => void;
}

export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ setActivePage }) => {
  const { user, profile, setIsAuthModalOpen } = useAuth();
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getCustomerOrders(user.uid);
      setOrders(data);
    } catch (err) {
      console.warn('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'preparing':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'out_for_delivery':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'pending':
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  if (!user) {
    return (
      <div className="py-16 sm:py-24 max-w-lg mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-white border border-[#E7DFD5] text-[#C26D2B] flex items-center justify-center mx-auto shadow-sm">
          <Clock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-[#2B1B14]">
            Order History
          </h2>
          <p className="text-sm text-[#6B5A4D]">
            Please sign in to view your recent cafe orders, real-time preparation status, and past receipts.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-8 py-3.5 rounded-2xl bg-[#3F2A1D] hover:bg-[#2B1B14] text-white font-semibold text-sm transition-all shadow-md active:scale-95"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E7DFD5]">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C26D2B] block mb-1">
            Welcome back, {profile?.name || user.displayName || 'Musafir Diner'}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1B14] tracking-tight">
            My Order History
          </h1>
        </div>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D5C7B8] text-xs font-medium text-[#3F2A1D] hover:bg-white transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-[#8C7A6B]">
          Loading your past orders from Cloud Firestore...
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-[#E7DFD5] p-8 space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] text-[#C26D2B] flex items-center justify-center mx-auto border border-[#E7DFD5]">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#2B1B14]">No orders yet</h3>
          <p className="text-xs text-[#6B5A4D]">
            You haven't placed an order with this account yet. Indulge in our artisan coffees and food today!
          </p>
          <button
            onClick={() => {
              setActivePage('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-2.5 rounded-xl bg-[#3F2A1D] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#2B1B14] transition-colors"
          >
            Explore Menu
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order.orderId}
              className="bg-white rounded-3xl border border-[#E7DFD5] p-6 space-y-4 shadow-xs"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F2ECE3]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg font-bold text-[#2B1B14]">
                      Order #{order.orderId}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${getStatusBadge(order.status)}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-xs text-[#8C7A6B]">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-serif text-xl font-bold text-[#C26D2B] tabular-nums">
                    ₹{order.total}
                  </span>
                  <span className="block text-[10px] text-[#8C7A6B] capitalize">
                    {order.orderType} · {order.paymentMethod.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#F2ECE3] text-xs">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#2B1B14]">
                        {item.quantity}x {item.menuItem?.name || 'Item'}
                      </span>
                      {item.notes && (
                        <span className="text-[#C26D2B] italic">({item.notes})</span>
                      )}
                    </div>
                    <span className="font-medium text-[#2B1B14] tabular-nums">
                      ₹{(item.menuItem?.price || 0) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery Details */}
              {order.orderType === 'delivery' && order.deliveryAddress && (
                <div className="pt-2 text-[11px] text-[#6B5A4D] bg-[#FAF7F2] p-3 rounded-xl border border-[#E7DFD5]">
                  <strong className="text-[#2B1B14] block">Delivery Location:</strong>
                  {order.deliveryAddress}{order.city ? `, ${order.city}` : ''}{order.pincode ? ` - ${order.pincode}` : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
