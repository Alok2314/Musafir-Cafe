import React, { useState } from 'react';
import { ActivePage, MenuItem } from '../types';
import { FEATURED_CATEGORIES } from '../data/menuData';
import { INITIAL_REVIEWS } from '../data/reviewsData';
import { useCart } from '../context/CartContext';
import {
  ArrowRight,
  Star,
  Plus,
  Sparkles,
  ShieldCheck,
  Zap,
  HeartHandshake,
  Coffee,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface HomePageProps {
  popularItems: MenuItem[];
  setActivePage: (page: ActivePage) => void;
  setSelectedCategory: (cat: string) => void;
  onOpenDetails: (item: MenuItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  popularItems,
  setActivePage,
  setSelectedCategory,
  onOpenDetails
}) => {
  const { addToCart } = useCart();
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setActivePage('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item, 1);
    setQuickAddedId(item.id);
    setTimeout(() => setQuickAddedId(null), 1200);
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-6 sm:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE7DC] border border-[#D5C7B8] text-xs font-semibold uppercase tracking-wider text-[#6B5A4D]">
                <Coffee className="w-3.5 h-3.5 text-[#C26D2B]" />
                <span>Good Food · Good Coffee · Good Memories</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2B1B14] leading-[1.15] text-balance">
                Welcome to <span className="text-[#C26D2B]">Musafir</span> Cafe
              </h1>

              <p className="text-base sm:text-lg text-[#6B5A4D] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                A place for great food, refreshing drinks, and unforgettable moments. From artisanal single-origin brews to wood-fired sourdough pizzas, we craft everyday pause into pure indulgence.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => {
                    setActivePage('order');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#3F2A1D] hover:bg-[#2B1B14] text-white font-semibold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-4 h-4 text-[#E08A3C]" />
                </button>

                <button
                  onClick={() => {
                    setActivePage('menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-[#FAF7F2] text-[#3F2A1D] border border-[#D5C7B8] font-semibold text-sm transition-all shadow-sm active:scale-95"
                >
                  Explore Menu
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-[#E7DFD5] flex items-center justify-center lg:justify-start gap-8 text-xs text-[#7A695C]">
                <div>
                  <span className="block font-serif text-lg font-bold text-[#2B1B14] tabular-nums">4.9 / 5.0</span>
                  <span>1,200+ Guest Ratings</span>
                </div>
                <div className="h-7 w-[1px] bg-[#E7DFD5]" />
                <div>
                  <span className="block font-serif text-lg font-bold text-[#2B1B14] tabular-nums">25 mins</span>
                  <span>Average Table & Delivery Time</span>
                </div>
                <div className="h-7 w-[1px] bg-[#E7DFD5] hidden sm:block" />
                <div className="hidden sm:block">
                  <span className="block font-serif text-lg font-bold text-[#2B1B14] tabular-nums">100% Fresh</span>
                  <span>Artisanal Ingredients</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E7DFD5] bg-[#EFE7DC] aspect-[16/10] sm:aspect-[16/11]">
                <img
                  src="/src/assets/images/hero_musafir_cafe_1790988144996.jpg"
                  alt="Musafir Cafe warm interior"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#3F2A1D] flex items-center justify-center text-[#E08A3C]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B5A4D]">
                        Daily Special
                      </h4>
                      <p className="text-sm font-semibold text-[#2B1B14]">
                        Kulhad Masala Chai & Sourdough Toastie
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCategoryClick('Tea')}
                    className="text-xs font-semibold text-[#C26D2B] hover:text-[#9A4E17] flex items-center gap-1"
                  >
                    <span>View</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C26D2B] block mb-1">
              Curated Selection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1B14] tracking-tight">
              Featured Categories
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setActivePage('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#3F2A1D] hover:text-[#C26D2B] transition-colors"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {FEATURED_CATEGORIES.map(cat => (
            <div
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className="group cursor-pointer rounded-2xl bg-white border border-[#E7DFD5] hover:border-[#C26D2B] p-3 text-center transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-md flex flex-col items-center"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#FAF7F2] mb-3 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-serif text-base font-bold text-[#2B1B14] group-hover:text-[#C26D2B] transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-[#8C7A6B] mt-0.5">
                {cat.count}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR MENU ITEMS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C26D2B] block mb-1">
            Guest Favorites
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1B14] tracking-tight text-balance">
            Popular Items at Musafir Cafe
          </h2>
          <p className="mt-2 text-sm text-[#6B5A4D]">
            Hand-picked selections most celebrated by our regular visitors and food critics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {popularItems.map(item => (
            <div
              key={item.id}
              onClick={() => onOpenDetails(item)}
              className="group bg-white rounded-2xl border border-[#E7DFD5] hover:border-[#3F2A1D]/30 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/3] bg-[#FAF7F2] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Veg / Non-Veg Indicator */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2 py-1 rounded-md shadow-sm flex items-center gap-1.5 border border-[#E7DFD5]">
                  <span className={`w-2 h-2 rounded-full ${item.veg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-700">
                    {item.veg ? 'Veg' : 'Non-Veg'}
                  </span>
                </div>

                {/* Rating */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2 py-1 rounded-md shadow-sm flex items-center gap-1 text-xs font-bold text-stone-800 border border-[#E7DFD5]">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="tabular-nums">{item.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Content */}
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
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 shadow-sm ${
                        quickAddedId === item.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#3F2A1D] hover:bg-[#2B1B14] text-white active:scale-95'
                      }`}
                      aria-label={`Add ${item.name} to cart`}
                    >
                      {quickAddedId === item.id ? (
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
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-white border-y border-[#E7DFD5] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C26D2B] block mb-1">
              The Musafir Promise
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1B14] tracking-tight">
              Why Choose Us
            </h2>
            <p className="mt-2 text-sm text-[#6B5A4D]">
              We take pride in every cup poured and every meal served with authentic care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#3F2A1D] text-[#E08A3C] flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2B1B14]">Fresh Ingredients</h3>
              <p className="text-xs text-[#6B5A4D] leading-relaxed">
                Farm-sourced dairy, organic spices, and seasonal produce delivered fresh daily. No artificial preservatives.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#3F2A1D] text-[#E08A3C] flex items-center justify-center mx-auto shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2B1B14]">Quality Food</h3>
              <p className="text-xs text-[#6B5A4D] leading-relaxed">
                Traditional recipes met with artisanal bakery craft. Certified hygienic kitchen with strict quality standards.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#3F2A1D] text-[#E08A3C] flex items-center justify-center mx-auto shadow-sm">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2B1B14]">Fast Service</h3>
              <p className="text-xs text-[#6B5A4D] leading-relaxed">
                Prompt preparation and real-time delivery dispatch ensuring your tea and pizzas reach piping hot.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#3F2A1D] text-[#E08A3C] flex items-center justify-center mx-auto shadow-sm">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2B1B14]">Cozy Atmosphere</h3>
              <p className="text-xs text-[#6B5A4D] leading-relaxed">
                High-speed Wi-Fi, abundant charging docks, travel literature, and relaxing acoustic indie music.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C26D2B] block mb-1">
              Guest Stories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1B14] tracking-tight">
              Customer Reviews
            </h2>
          </div>
          <button
            onClick={() => {
              setActivePage('feedback');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-4 md:mt-0 px-5 py-2.5 rounded-xl border border-[#3F2A1D] text-xs font-semibold uppercase tracking-wider text-[#3F2A1D] hover:bg-[#3F2A1D] hover:text-white transition-all"
          >
            View All Reviews
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {INITIAL_REVIEWS.slice(0, 3).map(rev => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-white border border-[#E7DFD5] shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                    />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#5A4B40] leading-relaxed italic">
                  “{rev.message}”
                </p>
              </div>

              <div className="pt-3 border-t border-[#F2ECE3] flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-semibold text-[#2B1B14]">{rev.name}</h4>
                  <span className="text-[#8C7A6B] text-[11px]">{rev.date}</span>
                </div>
                {rev.verified && (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified Order
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#241712] text-white p-8 sm:p-14 border border-[#3E291F] shadow-xl">
          {/* Subtle warm glow background */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#C26D2B]/20 blur-3xl pointer-events-none" />

          <div className="relative max-w-2xl space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E08A3C] block">
              Ready for a memorable bite?
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Hungry? Let’s Fix That.
            </h2>
            <p className="text-sm sm:text-base text-[#D5C7B8] leading-relaxed">
              Order your favorite coffees, wood-fired pizzas, and gourmet toasties directly to your doorstep, or drop by our heritage cafe for a freshly brewed cup.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setActivePage('order');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-7 py-3.5 rounded-2xl bg-[#E08A3C] hover:bg-[#C26D2B] text-[#241712] font-semibold text-sm transition-all shadow-md active:scale-95"
              >
                Order Now
              </button>
              <button
                onClick={() => {
                  setActivePage('menu');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm transition-all backdrop-blur-sm"
              >
                View Menu
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
