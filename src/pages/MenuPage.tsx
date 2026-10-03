import React, { useState, useEffect, useMemo } from 'react';
import { MenuItem, MenuCategory } from '../types';
import { CATEGORIES } from '../data/menuData';
import { useCart } from '../context/CartContext';
import { getMenuItems, subscribeToMenuItems } from '../services/cafeApi';
import { Search, Star, Plus, CheckCircle2, SlidersHorizontal, X, RefreshCw } from 'lucide-react';

interface MenuPageProps {
  items: MenuItem[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onOpenDetails: (item: MenuItem) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  items,
  selectedCategory,
  setSelectedCategory,
  onOpenDetails
}) => {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  // Live Firestore menu state
  const [menuList, setMenuList] = useState<MenuItem[]>(items && items.length > 0 ? items : []);
  const [isLoading, setIsLoading] = useState(items.length === 0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync when prop updates
  useEffect(() => {
    if (items && items.length > 0) {
      setMenuList(items);
    }
  }, [items]);

  // Load from Firestore on mount and subscribe in real time
  const loadFreshMenu = async () => {
    setIsRefreshing(true);
    console.log('[MENU FETCH] MenuPage querying fresh menu items from Firestore...');
    try {
      const freshItems = await getMenuItems();
      if (freshItems && freshItems.length > 0) {
        setMenuList(freshItems);
      }
    } catch (err: any) {
      console.error('[MENU FETCH] Error in MenuPage:', err);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFreshMenu();

    console.log('[MENU FETCH] Setting up MenuPage real-time listener...');
    const unsubscribe = subscribeToMenuItems(
      liveItems => {
        console.log(`[MENU LIVE] MenuPage received update: ${liveItems.length} items`);
        if (liveItems && liveItems.length > 0) {
          setMenuList(liveItems);
          setIsLoading(false);
        }
      },
      err => {
        console.error('[MENU LIVE] MenuPage subscription error:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    return menuList.filter(item => {
      // Category match
      const matchesCategory =
        selectedCategory === 'All' ||
        item.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase();

      // Veg match
      const isItemVeg = Boolean(item.isVeg ?? item.veg);
      const matchesVeg = !vegOnly || isItemVeg;

      // Search match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.ingredients || []).some(ing => ing.toLowerCase().includes(query));

      return matchesCategory && matchesVeg && matchesSearch;
    });
  }, [menuList, selectedCategory, vegOnly, searchQuery]);

  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item, 1);
    setQuickAddedId(item.id);
    setTimeout(() => setQuickAddedId(null), 1200);
  };

  return (
    <div className="py-8 pb-20 space-y-10">
      
      {/* Title & Search Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E7DFD5]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C26D2B] block mb-1">
              Freshly Prepared Daily
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B1B14] tracking-tight">
              Our Artisan Menu
            </h1>
            <p className="mt-1 text-sm text-[#6B5A4D]">
              Explore our handcrafted coffees, clay-oven teas, and fusion comfort food.
            </p>
          </div>

          {/* Search bar & dietary switch */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[260px] sm:min-w-[300px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search menu items..."
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-[#D5C7B8] bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#C26D2B] focus:ring-1 focus:ring-[#C26D2B] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Veg Only Toggle */}
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-colors ${
                vegOnly
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                  : 'bg-white border-[#D5C7B8] text-stone-600 hover:border-stone-400'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${vegOnly ? 'bg-emerald-600' : 'border border-stone-400'}`} />
              <span>Veg Only</span>
            </button>

            {/* Refresh Live Menu Button */}
            <button
              onClick={loadFreshMenu}
              disabled={isRefreshing}
              title="Refresh Menu from Firestore"
              aria-label="Refresh Menu"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#D5C7B8] bg-white text-stone-700 hover:text-[#C26D2B] hover:border-[#C26D2B] text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#C26D2B] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </section>

      {/* Categories Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(category => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#3F2A1D] text-white shadow-sm'
                    : 'bg-white text-[#6B5A4D] border border-[#E2D8CC] hover:border-[#3F2A1D] hover:bg-[#FAF7F2]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      {/* Menu Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Count indicator */}
        <div className="flex items-center justify-between text-xs text-[#8C7A6B] mb-6">
          <span>
            Showing <strong className="text-[#2B1B14]">{filteredItems.length}</strong> items in{' '}
            <strong className="text-[#2B1B14]">{selectedCategory}</strong>
          </span>
          {(selectedCategory !== 'All' || vegOnly || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setVegOnly(false);
                setSearchQuery('');
              }}
              className="text-[#C26D2B] hover:underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Empty Search State */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 px-4 bg-white rounded-3xl border border-[#E7DFD5] space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] text-[#8C7A6B] flex items-center justify-center mx-auto border border-[#E7DFD5]">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2B1B14]">No items found</h3>
            <p className="text-xs sm:text-sm text-[#6B5A4D]">
              We couldn’t find any menu item matching “{searchQuery || selectedCategory}”. Try searching for coffee, pizza, burger, or clearing filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setVegOnly(false);
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-xl bg-[#3F2A1D] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#2B1B14] transition-colors"
            >
              View Full Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map(item => (
              <div
                key={item.id}
                onClick={() => onOpenDetails(item)}
                className="group bg-white rounded-2xl border border-[#E7DFD5] hover:border-[#3F2A1D]/30 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-[#FAF7F2] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* Veg / Non-Veg & Availability */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <div className="bg-white/95 backdrop-blur px-2 py-1 rounded-md shadow-sm flex items-center gap-1.5 border border-[#E7DFD5]">
                      <span className={`w-2 h-2 rounded-full ${item.isVeg || item.veg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-700">
                        {item.isVeg || item.veg ? 'Veg' : 'Non-Veg'}
                      </span>
                    </div>
                    {item.available === false && (
                      <span className="bg-stone-900/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
                        Sold Out
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2 py-1 rounded-md shadow-sm flex items-center gap-1 text-xs font-bold text-stone-800 border border-[#E7DFD5]">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="tabular-nums">{item.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#8C7A6B] mb-1">
                      <span>{item.category}</span>
                      {item.prepTime && <span>{item.prepTime}</span>}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#2B1B14] group-hover:text-[#C26D2B] transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-[#6B5A4D] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F2ECE3] flex items-center justify-between gap-3">
                    <span className="font-serif text-xl font-bold text-[#2B1B14] tabular-nums">
                      ₹{item.price}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onOpenDetails(item);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-[#6B5A4D] hover:text-[#2B1B14] hover:bg-[#FAF7F2] rounded-lg transition-colors border border-transparent hover:border-[#E7DFD5]"
                      >
                        Details
                      </button>

                      <button
                        onClick={e => handleQuickAdd(item, e)}
                        disabled={item.available === false}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 shadow-sm ${
                          item.available === false
                            ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                            : quickAddedId === item.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#3F2A1D] hover:bg-[#2B1B14] text-white active:scale-95'
                        }`}
                        aria-label={`Add ${item.name} to cart`}
                      >
                        {item.available === false ? (
                          <span>Unavailable</span>
                        ) : quickAddedId === item.id ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-[#E08A3C]" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
