/**
 * Musafir Cafe - Main Application Root
 * Good Food. Good Coffee. Good Memories.
 */

import React, { useState, useEffect } from 'react';
import { ActivePage, MenuItem } from './types';
import { getMenuItems, getPopularMenuItems, subscribeToMenuItems } from './services/cafeApi';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { ToastContainer } from './components/ToastContainer';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { OrderPage } from './pages/OrderPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { AdminPage } from './pages/AdminPage';
import { ContactPage } from './pages/ContactPage';
import { FeedbackPage } from './pages/FeedbackPage';

const parsePageFromUrl = (): ActivePage => {
  const path = window.location.pathname.replace(/^\/+/, '').toLowerCase();
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  const target = hash || path;

  if (target === 'admin') return 'admin';
  if (target === 'orders' || target === 'my-orders') return 'orders';
  if (target === 'menu') return 'menu';
  if (target === 'about') return 'about';
  if (target === 'cart') return 'cart';
  if (target === 'order' || target === 'checkout') return 'order';
  if (target === 'contact') return 'contact';
  if (target === 'feedback' || target === 'reviews') return 'feedback';
  return 'home';
};

function CafeApp() {
  const [activePage, setActivePage] = useState<ActivePage>(parsePageFromUrl);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);

  // Sync navigation with browser URL
  const navigateTo = (page: ActivePage) => {
    setActivePage(page);
    const targetPath = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== targetPath) {
      try {
        window.history.pushState({ page }, '', targetPath);
      } catch {
        // Fallback for sandboxed iframes
        window.location.hash = `#${page}`;
      }
    }
  };

  useEffect(() => {
    const handleUrlChange = () => {
      setActivePage(parsePageFromUrl());
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const loadMenu = async () => {
    setIsLoadingMenu(true);
    try {
      const items = await getMenuItems();
      setMenuItems(items);
      const popular = await getPopularMenuItems();
      setPopularItems(popular);
    } catch (err) {
      console.warn('Error fetching live menu from Firestore:', err);
    } finally {
      setIsLoadingMenu(false);
    }
  };

  useEffect(() => {
    setIsLoadingMenu(true);
    const unsubscribe = subscribeToMenuItems(
      items => {
        setMenuItems(items);
        const popular = items.filter(i => i.popular);
        setPopularItems(popular.length > 0 ? popular.slice(0, 6) : items.slice(0, 6));
        setIsLoadingMenu(false);
      },
      err => {
        console.warn('Live menu subscription fallback:', err);
        loadMenu();
      }
    );
    return () => unsubscribe();
  }, []);

  const handleOpenDetails = (item: MenuItem) => {
    setModalItem(item);
  };

  const handleCloseDetails = () => {
    setModalItem(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#292524]">
      {/* Sticky Responsive Navbar */}
      <Navbar activePage={activePage} setActivePage={navigateTo} />

      {/* Main Page Content */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            popularItems={popularItems}
            setActivePage={navigateTo}
            setSelectedCategory={setSelectedCategory}
            onOpenDetails={handleOpenDetails}
          />
        )}

        {activePage === 'about' && (
          <AboutPage setActivePage={navigateTo} />
        )}

        {activePage === 'menu' && (
          <MenuPage
            items={menuItems}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onOpenDetails={handleOpenDetails}
          />
        )}

        {activePage === 'cart' && (
          <CartPage setActivePage={navigateTo} />
        )}

        {activePage === 'order' && (
          <OrderPage setActivePage={navigateTo} />
        )}

        {activePage === 'orders' && (
          <OrderHistoryPage setActivePage={navigateTo} />
        )}

        {activePage === 'admin' && (
          <AdminPage setActivePage={navigateTo} />
        )}

        {activePage === 'contact' && (
          <ContactPage />
        )}

        {activePage === 'feedback' && (
          <FeedbackPage />
        )}
      </main>

      {/* Item Details Modal */}
      <ItemDetailsModal item={modalItem} onClose={handleCloseDetails} />

      {/* Customer / Admin Auth & Profile Modal */}
      <AuthModal setActivePage={navigateTo} />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Footer */}
      <Footer setActivePage={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <CafeApp />
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
