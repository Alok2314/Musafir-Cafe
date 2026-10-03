import React, { useState } from 'react';
import { ActivePage } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Coffee, ShoppingBag, Menu, X, ArrowRight, User as UserIcon, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const { itemCount } = useCart();
  const { user, profile, isAdmin, setIsAuthModalOpen } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActivePage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'menu', label: 'Menu' },
    { id: 'orders', label: 'My Orders' },
    { id: 'contact', label: 'Contact' },
    { id: 'feedback', label: 'Feedback' },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin Portal' });
  }

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E7DFD5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Wordmark (Zone 1) */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-[#3F2A1D] flex items-center justify-center text-[#F4EFE6] shadow-sm group-hover:scale-105 transition-transform">
              <Coffee className="w-5 h-5 text-[#E08A3C]" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#2B1B14] block leading-none">
                Musafir Cafe
              </span>
              <span className="text-[11px] font-medium tracking-widest uppercase text-[#8C7A6B] block mt-0.5">
                Artisan Roastery & Kitchen
              </span>
            </div>
          </button>

          {/* Desktop Nav Links (Zone 2) */}
          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map(item => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-sm font-medium transition-colors relative py-1 focus:outline-none flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#2B1B14] font-semibold'
                      : 'text-[#6B5A4D] hover:text-[#2B1B14]'
                  }`}
                >
                  {item.id === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C26D2B] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Zone (Zone 3) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Admin Quick Portal Access */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  activePage === 'admin'
                    ? 'bg-emerald-800 text-white border border-emerald-900'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                }`}
                title="Open Admin Portal"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline">Admin Portal</span>
              </button>
            )}

            {/* User Account / Auth Trigger */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#D5C7B8] hover:border-[#3F2A1D] bg-white text-xs font-semibold text-[#3F2A1D] transition-colors"
              aria-label="User Account"
            >
              {user ? (
                <div className="w-5 h-5 rounded-full bg-[#3F2A1D] text-[#E08A3C] flex items-center justify-center text-[10px] font-bold">
                  {profile?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
              ) : (
                <UserIcon className="w-4 h-4 text-[#C26D2B]" />
              )}
              <span className="hidden sm:inline max-w-[90px] truncate">
                {user ? (profile?.name ? profile.name.split(' ')[0] : 'Account') : 'Sign In'}
              </span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => handleNavClick('cart')}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all ${
                activePage === 'cart'
                  ? 'bg-[#3F2A1D] text-[#FAF7F2] border-[#3F2A1D]'
                  : 'bg-white text-[#3F2A1D] border-[#E2D8CC] hover:border-[#3F2A1D] hover:bg-[#FAF7F2]'
              }`}
              aria-label={`View cart with ${itemCount} items`}
            >
              <ShoppingBag className="w-4 h-4 text-[#C26D2B]" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 ? (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-[#C26D2B] rounded-full tabular-nums shadow-sm animate-pulse">
                  {itemCount}
                </span>
              ) : (
                <span className="text-xs text-[#8C7A6B] hidden sm:inline tabular-nums">0</span>
              )}
            </button>

            {/* Quick Order Button */}
            <button
              onClick={() => handleNavClick('order')}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#3F2A1D] hover:bg-[#2B1B14] rounded-xl transition-all shadow-sm active:scale-95"
            >
              <span>Order Now</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E08A3C]" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#3F2A1D] hover:bg-[#F0EAE1] transition-colors focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E7DFD5] py-4 space-y-1 animate-fadeIn">
            {navItems.map(item => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                    isActive
                      ? 'bg-[#3F2A1D] text-[#FAF7F2]'
                      : 'text-[#5A4B40] hover:bg-[#F2ECE3]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.id === 'admin' && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                    <span>{item.label}</span>
                  </span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#E08A3C]" />}
                </button>
              );
            })}

            <div className="pt-3 border-t border-[#E7DFD5] flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#D5C7B8] text-xs font-semibold text-[#3F2A1D] bg-white"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#C26D2B]" />
                <span>{user ? 'My Profile' : 'Sign In'}</span>
              </button>

              <button
                onClick={() => handleNavClick('cart')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#D5C7B8] text-xs font-semibold text-[#3F2A1D] bg-white"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#C26D2B]" />
                <span>Cart ({itemCount})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
