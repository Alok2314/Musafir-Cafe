import React from 'react';
import { ActivePage } from '../types';
import { GALLERY_ITEMS } from '../data/reviewsData';
import { Coffee, Heart, Sparkles, Smile, ShieldCheck, Compass, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  setActivePage: (page: ActivePage) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setActivePage }) => {
  return (
    <div className="space-y-20 sm:space-y-28 py-10 pb-20">
      
      {/* Header Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C26D2B] inline-flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5" />
          <span>Our Journey & Roots</span>
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2B1B14] tracking-tight">
          Where Every Wanderer Finds a Home
        </h1>
        <p className="text-base sm:text-lg text-[#6B5A4D] leading-relaxed max-w-2xl mx-auto">
          In Hindi and Urdu, <strong className="text-[#3F2A1D]">“Musafir”</strong> means a traveler. We built this cafe as an unhurried sanctuary for souls traversing life’s journeys—be it a morning work sprint, a quiet book reading, or heartfelt laughter with lifelong friends.
        </p>
      </section>

      {/* OUR STORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-[#E7DFD5] bg-[#EFE7DC] aspect-[4/3]">
              <img
                src="/src/assets/images/cafe_ambiance_gallery_1790988185503.jpg"
                alt="Musafir Cafe library corner and armchairs"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Stamp card */}
            <div className="absolute -bottom-6 -right-6 hidden sm:block p-4 rounded-2xl bg-[#3F2A1D] text-white shadow-xl max-w-xs border border-[#5A3F2E]">
              <p className="font-serif text-sm font-semibold text-[#F2ECE3]">
                “A cup of chai here isn’t just a beverage; it’s a moment of pause.”
              </p>
              <span className="block text-[11px] text-[#C4B7AC] mt-1">— Musafir Cafe Founders</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C26D2B] block">
              The Genesis
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1B14] tracking-tight">
              Our Story
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-[#6B5A4D] leading-relaxed">
              <p>
                Musafir Cafe was born out of an appreciation for authentic Indian hospitality blended with the craftsmanship of third-wave coffee roasteries. We noticed that modern coffee shops were often either too cold and sterile, or rushed fast-food hubs.
              </p>
              <p>
                We envisioned a warm, comfortable haven where people could sit without the rush of timers. Here, conversations unfold naturally, writers find their rhythm over slow-drip brews, and friends bond over steaming kulhad chai and wood-fired sourdough pizzas.
              </p>
              <p>
                Every recipe—from our Chikmagalur single-origin espressos to our hand-kneaded crusts and spiced chai blends—honors real ingredients and genuine care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR MISSION */}
      <section className="bg-white border-y border-[#E7DFD5] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C26D2B] block mb-1">
              Guiding Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1B14] tracking-tight">
              Our Mission
            </h2>
            <p className="mt-2 text-sm text-[#6B5A4D]">
              Four pillars that govern every dish, every beverage, and every customer interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#3F2A1D] text-[#E08A3C] flex items-center justify-center">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2B1B14]">Good Food</h3>
              <p className="text-xs text-[#6B5A4D] leading-relaxed">
                Flavor first. We never cut corners on fresh herbs, pure cow milk, organic spices, or hand-rolled doughs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#3F2A1D] text-[#E08A3C] flex items-center justify-center">
                <Smile className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2B1B14]">Good Service</h3>
              <p className="text-xs text-[#6B5A4D] leading-relaxed">
                Warm, attentive, and respectful hospitality that makes you feel welcomed like a dear guest in our home.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#3F2A1D] text-[#E08A3C] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2B1B14]">Clean Environment</h3>
              <p className="text-xs text-[#6B5A4D] leading-relaxed">
                Pristine food preparation areas, zero-tolerance hygiene standards, and meticulously cleaned seating spaces.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#3F2A1D] text-[#E08A3C] flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2B1B14]">Customer Satisfaction</h3>
              <p className="text-xs text-[#6B5A4D] leading-relaxed">
                If anything isn’t made to your complete liking, our baristas will happily brew or bake it again for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT MAKES US DIFFERENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C26D2B] block mb-1">
            Our Edge
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1B14] tracking-tight">
            What Makes Us Different
          </h2>
          <p className="mt-2 text-sm text-[#6B5A4D]">
            The small conscious decisions that set Musafir Cafe apart from standard commercial chains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-7 rounded-3xl bg-white border border-[#E7DFD5] flex gap-5 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#F0EAE1] text-[#C26D2B] flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-[#2B1B14]">
                Freshly Prepared Food
              </h3>
              <p className="text-xs sm:text-sm text-[#6B5A4D] leading-relaxed">
                No frozen patties, no reheating of day-old pastas. Everything from our grilled sandwich fillings to our brioche burger sauces is prepped in small scratch batches.
              </p>
            </div>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-[#E7DFD5] flex gap-5 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#F0EAE1] text-[#C26D2B] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-[#2B1B14]">
                Quality Ingredients
              </h3>
              <p className="text-xs sm:text-sm text-[#6B5A4D] leading-relaxed">
                Direct trade coffee beans from high-altitude estates in Karnataka and Kerala, pure Assam tea leaves, rich Amul butter, and authentic Belgian cocoa for our confections.
              </p>
            </div>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-[#E7DFD5] flex gap-5 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#F0EAE1] text-[#C26D2B] flex items-center justify-center shrink-0">
              <Smile className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-[#2B1B14]">
                Friendly Service
              </h3>
              <p className="text-xs sm:text-sm text-[#6B5A4D] leading-relaxed">
                Our team loves what they do. Whether you need a coffee recommendation, a quiet table to plug your laptop in, or extra spices for your pizza, we are here with a warm smile.
              </p>
            </div>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-[#E7DFD5] flex gap-5 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#F0EAE1] text-[#C26D2B] flex items-center justify-center shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-[#2B1B14]">
                Comfortable Environment
              </h3>
              <p className="text-xs sm:text-sm text-[#6B5A4D] leading-relaxed">
                Ergonomic wooden chairs, cozy reading corners, soft warm amber illumination, and carefully balanced acoustic music designed for focus, relaxation, and conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CAFE GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C26D2B] block mb-1">
            Visual Story
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1B14] tracking-tight">
            Cafe Gallery
          </h2>
          <p className="mt-2 text-sm text-[#6B5A4D]">
            A glimpse into the daily life, kitchen art, and cozy corners of Musafir Cafe.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="group rounded-3xl overflow-hidden border border-[#E7DFD5] bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[4/3] bg-[#EFE7DC] overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-white">
                  {item.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-base font-bold text-[#2B1B14]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#7A695C] mt-1 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              setActivePage('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-[#3F2A1D] hover:bg-[#2B1B14] text-white font-semibold text-sm transition-all shadow-sm"
          >
            <span>Explore the Menu & Experience It</span>
            <ArrowRight className="w-4 h-4 text-[#E08A3C]" />
          </button>
        </div>
      </section>

    </div>
  );
};
