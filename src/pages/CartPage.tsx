import React from 'react';
import { ActivePage } from '../types';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck } from 'lucide-react';

interface CartPageProps {
  setActivePage: (page: ActivePage) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ setActivePage }) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    tax,
    getDeliveryCharge,
    getGrandTotal
  } = useCart();

  const deliveryCharge = getDeliveryCharge('delivery');
  const grandTotal = getGrandTotal('delivery');

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
            Looks like you haven't added any delicious food or coffee yet. Explore our handcrafted selection and pick your favorites.
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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E7DFD5]">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C26D2B] block mb-1">
            Review Your Order
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1B14] tracking-tight">
            Shopping Cart
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-[#8C7A6B] hover:text-rose-600 transition-colors self-start sm:self-auto"
        >
          Clear entire cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map(cartItem => {
            const { menuItem, quantity, notes } = cartItem;
            const itemTotal = menuItem.price * quantity;

            return (
              <div
                key={menuItem.id}
                className="bg-white rounded-2xl border border-[#E7DFD5] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
              >
                {/* Item Thumbnail & Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#E7DFD5]">
                    <img
                      src={menuItem.image}
                      alt={menuItem.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`w-2 h-2 rounded-full ${menuItem.veg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8C7A6B]">
                        {menuItem.category}
                      </span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-[#2B1B14] truncate">
                      {menuItem.name}
                    </h3>
                    
                    <p className="text-xs text-[#6B5A4D] mt-0.5">
                      ₹{menuItem.price} each
                    </p>

                    {notes && (
                      <p className="text-[11px] text-[#C26D2B] mt-1 italic">
                        Note: {notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quantity & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F2ECE3]">
                  {/* Stepper */}
                  <div className="flex items-center gap-2 bg-[#FAF7F2] px-2 py-1 rounded-xl border border-[#E7DFD5]">
                    <button
                      onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-white transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-7 text-center font-semibold text-xs text-[#2B1B14] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-white transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[70px]">
                    <span className="font-serif text-base font-bold text-[#2B1B14] tabular-nums">
                      ₹{itemTotal}
                    </span>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => removeFromCart(menuItem.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    aria-label={`Remove ${menuItem.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <button
              onClick={() => {
                setActivePage('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3F2A1D] hover:text-[#C26D2B] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-[#E7DFD5] p-6 sm:p-7 space-y-6 shadow-sm sticky top-28">
            <h3 className="font-serif text-xl font-bold text-[#2B1B14] pb-4 border-b border-[#E7DFD5]">
              Bill Summary
            </h3>

            <div className="space-y-3 text-sm text-[#5A4B40]">
              <div className="flex justify-between items-center">
                <span>Item Subtotal</span>
                <span className="font-medium text-[#2B1B14] tabular-nums">₹{subtotal}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <span>Cafe GST (5%)</span>
                </span>
                <span className="font-medium text-[#2B1B14] tabular-nums">₹{tax}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Estimated Delivery</span>
                <span className="font-medium tabular-nums">
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </span>
              </div>

              {subtotal < 500 && (
                <p className="text-[11px] text-[#C26D2B] bg-[#FFF8F0] p-2.5 rounded-xl border border-[#FDE8D4]">
                  Add items worth ₹{500 - subtotal} more to get <strong>FREE delivery</strong>!
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-[#E7DFD5] flex justify-between items-baseline">
              <span className="font-serif text-lg font-bold text-[#2B1B14]">Grand Total</span>
              <div className="text-right">
                <span className="font-serif text-2xl font-bold text-[#C26D2B] tabular-nums">
                  ₹{grandTotal}
                </span>
                <span className="block text-[10px] text-[#8C7A6B]">Inclusive of all taxes</span>
              </div>
            </div>

            <button
              onClick={() => {
                setActivePage('order');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-4 rounded-2xl bg-[#3F2A1D] hover:bg-[#2B1B14] text-white font-semibold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Proceed to Order</span>
              <ArrowRight className="w-4 h-4 text-[#E08A3C]" />
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-[#8C7A6B] pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe & Secure Cafe Checkout</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
