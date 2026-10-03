import React, { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import { X, Star, Clock, Flame, Plus, Minus, ShoppingBag, Check } from 'lucide-react';

interface ItemDetailsModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({ item, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [specialNote, setSpecialNote] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setSpecialNote('');
    setAddedAnimation(false);
  }, [item]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const handleAddToCart = () => {
    addToCart(item, quantity, specialNote.trim() ? specialNote.trim() : undefined);
    setAddedAnimation(true);
    setTimeout(() => {
      onClose();
    }, 450);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E7DFD5] max-h-[92vh] flex flex-col animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur text-stone-700 hover:text-stone-900 hover:bg-white flex items-center justify-center shadow-md transition-all focus:outline-none"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto">
          {/* Header Image */}
          <div className="relative w-full h-64 sm:h-72 bg-[#F3EFE9] overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                // styled CSS fallback container
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Fallback pattern behind */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#3F2A1D] to-[#8C6D58] flex items-center justify-center p-6 text-white text-center">
              <span className="font-serif text-2xl font-bold">{item.name}</span>
            </div>

            {/* Gradient scrim for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* Floating badges */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded border ${item.veg ? 'border-emerald-500 bg-emerald-950/80' : 'border-rose-500 bg-rose-950/80'}`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${item.veg ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                </span>
                <span className="text-xs uppercase tracking-wider font-semibold text-white/90">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-amber-300 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{item.rating.toFixed(1)}</span>
                <span className="text-white/70">({item.reviewsCount})</span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 sm:p-7 space-y-5">
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-2xl font-bold text-[#2B1B14] leading-snug">
                  {item.name}
                </h3>
                <span className="font-serif text-2xl font-bold text-[#C26D2B] tabular-nums whitespace-nowrap">
                  ₹{item.price}
                </span>
              </div>
              <p className="mt-2 text-sm text-[#6B5A4D] leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Metadata metrics */}
            <div className="flex flex-wrap items-center gap-4 py-2 border-y border-[#F0EAE1] text-xs text-[#7A695C]">
              {item.prepTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#C26D2B]" />
                  <span>Prep time: <strong className="text-[#3F2A1D]">{item.prepTime}</strong></span>
                </div>
              )}
              {item.calories && (
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>Calories: <strong className="text-[#3F2A1D]">{item.calories}</strong></span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Freshly prepared to order</span>
              </div>
            </div>

            {/* Ingredients */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B] mb-2">
                  Key Ingredients & Notes
                </h4>
                <div className="flex flex-wrap gap-2 text-xs text-[#5A4B40]">
                  {item.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Customization notes */}
            <div>
              <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B] mb-1.5">
                Special Requests (Optional)
              </label>
              <input
                id="notes"
                type="text"
                value={specialNote}
                onChange={e => setSpecialNote(e.target.value)}
                placeholder="e.g., Less spicy, no ice, extra sugar on side..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#D5C7B8] focus:border-[#C26D2B] focus:ring-1 focus:ring-[#C26D2B] focus:outline-none transition-colors"
                maxLength={100}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-[#E7DFD5] flex items-center justify-between gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-2xl border border-[#D5C7B8]">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-[#FAF7F2] disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-semibold text-sm text-[#2B1B14] tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(prev => prev + 1)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-[#FAF7F2] transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl text-sm font-semibold transition-all shadow-sm ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-[#3F2A1D] hover:bg-[#2B1B14] text-white active:scale-95'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Order</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#E08A3C]" />
                <span>Add to Cart · ₹{item.price * quantity}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
