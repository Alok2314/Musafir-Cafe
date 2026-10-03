import React, { useState, useEffect } from 'react';
import { ActivePage, OrderType, PaymentMethod, OrderDetails } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/cafeApi';
import {
  CheckCircle,
  Truck,
  ShoppingBag,
  CreditCard,
  QrCode,
  Banknote,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  MapPin,
  Sparkles,
  UserCheck
} from 'lucide-react';

interface OrderPageProps {
  setActivePage: (page: ActivePage) => void;
}

export const OrderPage: React.FC<OrderPageProps> = ({ setActivePage }) => {
  const { items, clearCart, subtotal, tax, getDeliveryCharge, getGrandTotal } = useCart();
  const { user, profile, setIsAuthModalOpen } = useAuth();

  // Checkout Form State
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('110001');
  const [instructions, setInstructions] = useState('');

  // Auto pre-fill if logged in
  useEffect(() => {
    if (user) {
      if (profile?.name || user.displayName) {
        setName(profile?.name || user.displayName || '');
      }
      if (profile?.phone) {
        setMobile(profile.phone);
      }
      if (user.email) {
        setEmail(user.email);
      }
    }
  }, [user, profile]);

  // Validation & Loading
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);

  const deliveryCharge = getDeliveryCharge(orderType);
  const grandTotal = getGrandTotal(orderType);

  // Validate form
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = 'Please enter your full name';
    if (!mobile.trim() || !/^\+?[0-9]{10,12}$/.test(mobile.replace(/[\s-]/g, ''))) {
      errs.mobile = 'Please enter a valid 10-digit mobile number';
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (orderType === 'delivery') {
      if (!address.trim()) errs.address = 'Please enter delivery street address';
      if (!city.trim()) errs.city = 'Please enter city';
      if (!pincode.trim() || !/^[0-9]{6}$/.test(pincode.trim())) {
        errs.pincode = 'Please enter valid 6-digit postal code';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert('Your cart is empty! Please add items before checking out.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrder({
        customerId: user?.uid || 'guest',
        customerName: name.trim(),
        phone: mobile.trim(),
        email: email.trim(),
        orderType,
        deliveryAddress: orderType === 'delivery' ? address.trim() : (address.trim() || 'Musafir Cafe Counter Pickup'),
        city: orderType === 'delivery' ? city.trim() : undefined,
        pincode: orderType === 'delivery' ? pincode.trim() : undefined,
        specialInstructions: instructions.trim() ? instructions.trim() : undefined,
        paymentMethod,
        items: [...items],
        subtotal,
        GST: tax,
        tax,
        deliveryCharge,
        total: grandTotal,
        estimatedMinutes: orderType === 'delivery' ? 35 : 20
      });

      setConfirmedOrder(order);
      clearCart();
    } catch (err: any) {
      console.error('[ORDER CREATE] Failed to submit order:', err);
      const errMsg = err?.message || 'Database error occurred while saving your order.';
      setErrors(prev => ({
        ...prev,
        submit: `Unable to place order: ${errMsg}. Please try again.`
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order is successfully confirmed, show the Celebration Receipt
  if (confirmedOrder) {
    return (
      <div className="py-12 sm:py-20 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-[#E7DFD5] shadow-xl overflow-hidden animate-fadeIn">
          
          {/* Header Banner */}
          <div className="bg-[#241712] text-white p-8 sm:p-10 text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-[#E08A3C] text-[#241712] flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Order Confirmed!
            </h2>
            <p className="text-sm text-[#D5C7B8] mt-2 max-w-md mx-auto">
              Thank you for ordering from <strong className="text-white">Musafir Cafe</strong>. We’re preparing your fresh culinary experience now.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-[#E08A3C] border border-white/15 tabular-nums">
              <span>Order ID: {confirmedOrder.orderId}</span>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Status & Estimated Time */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3F2A1D] text-[#E08A3C] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                    Estimated {confirmedOrder.orderType === 'delivery' ? 'Delivery' : 'Pickup'} Time
                  </h4>
                  <p className="font-serif text-lg font-bold text-[#2B1B14] tabular-nums">
                    {confirmedOrder.estimatedMinutes} Minutes
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wide">
                Freshly Brewing
              </span>
            </div>

            {/* Customer & Delivery Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#5A4B40] pt-2">
              <div className="p-4 rounded-xl border border-[#F0EAE1]">
                <span className="block font-bold uppercase tracking-wider text-[#8C7A6B] mb-1">
                  Customer Information
                </span>
                <p className="font-semibold text-sm text-[#2B1B14]">{confirmedOrder.customerName}</p>
                <p className="mt-0.5">{confirmedOrder.mobile}</p>
                <p>{confirmedOrder.email}</p>
              </div>

              <div className="p-4 rounded-xl border border-[#F0EAE1]">
                <span className="block font-bold uppercase tracking-wider text-[#8C7A6B] mb-1">
                  Fulfillment Mode
                </span>
                <p className="font-semibold text-sm text-[#2B1B14] capitalize">
                  {confirmedOrder.orderType === 'delivery' ? 'Home / Office Delivery' : 'Self Pickup'}
                </p>
                {confirmedOrder.orderType === 'delivery' ? (
                  <p className="mt-0.5 leading-relaxed">
                    {confirmedOrder.deliveryAddress}, {confirmedOrder.city} - {confirmedOrder.pincode}
                  </p>
                ) : (
                  <p className="mt-0.5 leading-relaxed text-[#C26D2B]">
                    Pickup at Musafir Cafe: 14, Heritage Lane, Near Central Park
                  </p>
                )}
              </div>
            </div>

            {/* Items Receipt */}
            <div className="border-t border-[#E7DFD5] pt-5">
              <h4 className="font-serif text-base font-bold text-[#2B1B14] mb-3">
                Ordered Items
              </h4>
              <div className="divide-y divide-[#F2ECE3] text-sm">
                {confirmedOrder.items.map(item => (
                  <div key={item.menuItem.id} className="py-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-medium text-[#2B1B14]">
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      {item.notes && (
                        <span className="block text-xs text-[#C26D2B] italic">Note: {item.notes}</span>
                      )}
                    </div>
                    <span className="font-medium text-[#2B1B14] tabular-nums">
                      ₹{item.menuItem.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E7DFD5] pt-3 mt-3 space-y-1.5 text-xs text-[#6B5A4D]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums">₹{confirmedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="tabular-nums">₹{confirmedOrder.tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="tabular-nums">
                    {confirmedOrder.deliveryCharge === 0 ? 'FREE' : `₹${confirmedOrder.deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#2B1B14] pt-2 border-t border-[#F2ECE3]">
                  <span>Total Amount Paid / Due</span>
                  <span className="text-[#C26D2B] tabular-nums">₹{confirmedOrder.total}</span>
                </div>
                <p className="text-[11px] text-[#8C7A6B] pt-1">
                  Payment Method: <span className="font-semibold uppercase">{confirmedOrder.paymentMethod}</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setConfirmedOrder(null);
                  setActivePage('orders');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 py-3.5 rounded-2xl bg-[#E08A3C] hover:bg-[#C26D2B] text-[#241712] font-semibold text-sm transition-all shadow-sm text-center"
              >
                Track in My Orders
              </button>
              <button
                onClick={() => {
                  setConfirmedOrder(null);
                  setActivePage('menu');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 py-3.5 rounded-2xl bg-[#3F2A1D] hover:bg-[#2B1B14] text-white font-semibold text-sm transition-all shadow-sm text-center"
              >
                Order More Items
              </button>
              <button
                onClick={() => {
                  setConfirmedOrder(null);
                  setActivePage('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 py-3.5 rounded-2xl bg-white hover:bg-[#FAF7F2] text-[#3F2A1D] border border-[#D5C7B8] font-semibold text-sm transition-all text-center"
              >
                Back to Home
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // If cart is empty, show prompt to explore menu
  if (items.length === 0) {
    return (
      <div className="py-16 sm:py-24 max-w-2xl mx-auto px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-white border border-[#E7DFD5] text-[#C26D2B] flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-[#2B1B14]">
            Your cart is empty.
          </h2>
          <p className="text-sm text-[#6B5A4D]">
            Please add items from our artisan menu before proceeding to checkout.
          </p>
        </div>
        <div>
          <button
            onClick={() => {
              setActivePage('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#3F2A1D] hover:bg-[#2B1B14] text-white font-semibold text-sm transition-all shadow-sm"
          >
            <span>Explore Menu</span>
            <ArrowRight className="w-4 h-4 text-[#E08A3C]" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Title */}
      <div className="pb-6 border-b border-[#E7DFD5]">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C26D2B] block mb-1">
          Final Step
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1B14] tracking-tight">
          Checkout & Place Order
        </h1>
        <p className="mt-1 text-sm text-[#6B5A4D]">
          Choose your delivery preference, fill in your contact information, and review your order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Form Column */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-8">
          
          {/* Order Type Toggle */}
          <div className="bg-white rounded-3xl border border-[#E7DFD5] p-6 space-y-4 shadow-xs">
            <h3 className="font-serif text-xl font-bold text-[#2B1B14]">
              1. Choose Order Type
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                  orderType === 'delivery'
                    ? 'border-[#3F2A1D] bg-[#3F2A1D] text-white shadow-sm'
                    : 'border-[#E7DFD5] bg-[#FAF7F2] text-[#5A4B40] hover:border-stone-400'
                }`}
              >
                <Truck className="w-6 h-6 mb-2 text-[#E08A3C]" />
                <span className="font-semibold text-sm">Delivery</span>
                <span className={`text-[11px] mt-0.5 ${orderType === 'delivery' ? 'text-white/80' : 'text-[#8C7A6B]'}`}>
                  To your doorstep (~35 mins)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                  orderType === 'pickup'
                    ? 'border-[#3F2A1D] bg-[#3F2A1D] text-white shadow-sm'
                    : 'border-[#E7DFD5] bg-[#FAF7F2] text-[#5A4B40] hover:border-stone-400'
                }`}
              >
                <ShoppingBag className="w-6 h-6 mb-2 text-[#E08A3C]" />
                <span className="font-semibold text-sm">Takeaway / Pickup</span>
                <span className={`text-[11px] mt-0.5 ${orderType === 'pickup' ? 'text-white/80' : 'text-[#8C7A6B]'}`}>
                  Ready in cafe (~20 mins)
                </span>
              </button>
            </div>

            {orderType === 'pickup' && (
              <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FDE8D4] flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C26D2B] shrink-0 mt-0.5" />
                <div className="text-xs text-[#6B5A4D]">
                  <strong className="text-[#3F2A1D] block">Pickup from Musafir Cafe:</strong>
                  14, Heritage Lane, Near Central Park & Metro Gate 2, Connaught Place, New Delhi.
                  Your order will be packaged hot upon arrival.
                </div>
              </div>
            )}
          </div>

          {/* Customer Details Form */}
          <div className="bg-white rounded-3xl border border-[#E7DFD5] p-6 sm:p-7 space-y-5 shadow-xs">
            <h3 className="font-serif text-xl font-bold text-[#2B1B14]">
              2. Customer Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g., Alok Sharma"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                    errors.name ? 'border-rose-500 bg-rose-50/30' : 'border-[#D5C7B8] focus:border-[#C26D2B]'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="e.g., 9876543210"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                    errors.mobile ? 'border-rose-500 bg-rose-50/30' : 'border-[#D5C7B8] focus:border-[#C26D2B]'
                  }`}
                />
                {errors.mobile && (
                  <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.mobile}</span>
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g., alok@example.com"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                    errors.email ? 'border-rose-500 bg-rose-50/30' : 'border-[#D5C7B8] focus:border-[#C26D2B]'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Delivery address fields if orderType === 'delivery' */}
            {orderType === 'delivery' && (
              <div className="space-y-4 pt-2 border-t border-[#F2ECE3]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C26D2B]">
                  Delivery Address Details
                </h4>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                    Street Address, Flat / House No., Landmark *
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="e.g., Flat 402, Royal Residency, Near Metro Pillar 12"
                    className={`w-full px-4 py-2 rounded-xl border text-sm focus:outline-none transition-colors ${
                      errors.address ? 'border-rose-500 bg-rose-50/30' : 'border-[#D5C7B8] focus:border-[#C26D2B]'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.address}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                      City *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D5C7B8] text-sm focus:outline-none focus:border-[#C26D2B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={e => setPincode(e.target.value)}
                      placeholder="110001"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                        errors.pincode ? 'border-rose-500 bg-rose-50/30' : 'border-[#D5C7B8] focus:border-[#C26D2B]'
                      }`}
                    />
                    {errors.pincode && (
                      <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.pincode}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="space-y-1 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                Special Instructions (Optional)
              </label>
              <input
                type="text"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="e.g., Ring bell twice, deliver at security gate, extra ketchup"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D5C7B8] text-sm focus:outline-none focus:border-[#C26D2B]"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl border border-[#E7DFD5] p-6 sm:p-7 space-y-4 shadow-xs">
            <h3 className="font-serif text-xl font-bold text-[#2B1B14]">
              3. Payment Method
            </h3>

            <div className="space-y-3">
              {/* COD */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#3F2A1D] bg-[#FAF7F2]'
                    : 'border-[#E7DFD5] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="w-4 h-4 text-[#C26D2B] focus:ring-[#C26D2B]"
                  />
                  <div className="flex items-center gap-2.5">
                    <Banknote className="w-5 h-5 text-[#C26D2B]" />
                    <div>
                      <span className="font-semibold text-sm text-[#2B1B14] block">Cash on Delivery / Pay on Pickup</span>
                      <span className="text-xs text-[#8C7A6B]">Pay with cash or scan delivery partner QR at your doorstep</span>
                    </div>
                  </div>
                </div>
              </label>

              {/* UPI */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-[#3F2A1D] bg-[#FAF7F2]'
                    : 'border-[#E7DFD5] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="w-4 h-4 text-[#C26D2B] focus:ring-[#C26D2B]"
                  />
                  <div className="flex items-center gap-2.5">
                    <QrCode className="w-5 h-5 text-[#C26D2B]" />
                    <div>
                      <span className="font-semibold text-sm text-[#2B1B14] block">UPI / QR Code</span>
                      <span className="text-xs text-[#8C7A6B]">Google Pay, PhonePe, Paytm or any UPI app</span>
                    </div>
                  </div>
                </div>
              </label>

              {paymentMethod === 'upi' && (
                <div className="p-4 ml-7 rounded-xl bg-white border border-[#E7DFD5] space-y-2 text-xs text-[#6B5A4D]">
                  <p className="font-medium text-[#2B1B14]">Musafir Cafe Verified UPI ID:</p>
                  <code className="block bg-[#FAF7F2] p-2 rounded-lg text-xs font-mono text-[#3F2A1D] font-bold">
                    musafir.cafe@okhdfcbank
                  </code>
                  <p className="text-[11px] text-[#8C7A6B]">
                    You can also request a dynamic payment link upon delivery.
                  </p>
                </div>
              )}

              {/* Card */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#3F2A1D] bg-[#FAF7F2]'
                    : 'border-[#E7DFD5] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="w-4 h-4 text-[#C26D2B] focus:ring-[#C26D2B]"
                  />
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-5 h-5 text-[#C26D2B]" />
                    <div>
                      <span className="font-semibold text-sm text-[#2B1B14] block">Credit / Debit Card</span>
                      <span className="text-xs text-[#8C7A6B]">Visa, Mastercard, RuPay & Amex supported</span>
                    </div>
                  </div>
                </div>
              </label>

              {paymentMethod === 'card' && (
                <div className="p-4 ml-7 rounded-xl bg-white border border-[#E7DFD5] space-y-3 text-xs text-[#6B5A4D]">
                  <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Simulated sandbox mode: Card payments ready for backend gateway integration.</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Error Banner if any */}
          {errors.submit && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-[#3F2A1D] hover:bg-[#2B1B14] text-white font-semibold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Placing your order...</span>
            ) : (
              <>
                <span>Place Order · ₹{grandTotal}</span>
                <ArrowRight className="w-4 h-4 text-[#E08A3C]" />
              </>
            )}
          </button>
        </form>

        {/* Right Summary Column */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-[#E7DFD5] p-6 sm:p-7 space-y-6 shadow-sm sticky top-28">
            <h3 className="font-serif text-xl font-bold text-[#2B1B14] pb-4 border-b border-[#E7DFD5]">
              Order Summary ({items.length} items)
            </h3>

            {/* Items list preview */}
            <div className="max-h-64 overflow-y-auto space-y-3 divide-y divide-[#F2ECE3] pr-1">
              {items.map(item => (
                <div key={item.menuItem.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${item.menuItem.veg ? 'bg-emerald-600' : 'bg-rose-600'} shrink-0`} />
                    <div>
                      <span className="font-semibold text-stone-800 line-clamp-1">
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      {item.notes && (
                        <span className="text-[10px] text-[#C26D2B] italic">Note: {item.notes}</span>
                      )}
                    </div>
                  </div>
                  <span className="font-medium text-stone-900 tabular-nums shrink-0 ml-2">
                    ₹{item.menuItem.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-3 pt-4 border-t border-[#E7DFD5] text-sm text-[#5A4B40]">
              <div className="flex justify-between items-center">
                <span>Item Subtotal</span>
                <span className="font-medium text-[#2B1B14] tabular-nums">₹{subtotal}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Cafe GST (5%)</span>
                <span className="font-medium text-[#2B1B14] tabular-nums">₹{tax}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Fulfillment ({orderType === 'delivery' ? 'Delivery' : 'Pickup'})</span>
                <span className="font-medium tabular-nums">
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </span>
              </div>

              <div className="pt-4 border-t border-[#E7DFD5] flex justify-between items-baseline">
                <span className="font-serif text-lg font-bold text-[#2B1B14]">Total Amount</span>
                <div className="text-right">
                  <span className="font-serif text-2xl font-bold text-[#C26D2B] tabular-nums">
                    ₹{grandTotal}
                  </span>
                  <span className="block text-[10px] text-[#8C7A6B]">Inclusive of all taxes</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] flex items-center gap-3 text-xs text-[#6B5A4D]">
              <Sparkles className="w-4 h-4 text-[#C26D2B] shrink-0" />
              <span>Orders freshly packed in eco-friendly biodegradable food containers.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
