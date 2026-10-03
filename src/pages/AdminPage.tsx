import React, { useState, useEffect } from 'react';
import { OrderDetails, OrderStatus, MenuItem, FeedbackItem, ContactSubmission, MenuCategory } from '../types';
import {
  getAllOrders,
  subscribeToAllOrders,
  updateOrderStatus,
  getMenuItems,
  subscribeToMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
  getFeedbacks,
  subscribeToFeedbacks,
  getContactSubmissions,
  subscribeToContacts
} from '../services/cafeApi';
import { useAuth, ADMIN_EMAIL } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  ShieldCheck,
  ShoppingBag,
  Coffee,
  MessageSquare,
  Mail,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  Search,
  Filter,
  Flame,
  UserCheck
} from 'lucide-react';

interface AdminPageProps {
  setActivePage?: (page: any) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ setActivePage }) => {
  const { user, profile, isAdmin, loading: authLoading, signInWithGoogle, setIsAuthModalOpen } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'menu' | 'feedback' | 'contacts'>('dashboard');
  
  // Data states
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Filters & Search
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [menuSearch, setMenuSearch] = useState<string>('');

  // Modals for Menu Management
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Add Item Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<Exclude<MenuCategory, 'All'>>('Coffee');
  const [newItemPrice, setNewItemPrice] = useState<number>(199);
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemVeg, setNewItemVeg] = useState(true);
  const [newItemPrep, setNewItemPrep] = useState('10-12 mins');
  const [newItemCalories, setNewItemCalories] = useState('320 kcal');

  // Edit Item Form State
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<Exclude<MenuCategory, 'All'>>('Coffee');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDesc, setEditDesc] = useState('');
  const [editVeg, setEditVeg] = useState(true);

  const loadData = async () => {
    setDataLoading(true);
    console.log('[ADMIN ORDERS FETCH] loadData initiated in AdminPage');
    try {
      const [ordersRes, menuRes, feedRes, contactRes] = await Promise.allSettled([
        getAllOrders(),
        getMenuItems(),
        getFeedbacks(),
        getContactSubmissions()
      ]);

      if (ordersRes.status === 'fulfilled' && ordersRes.value) {
        setOrders(ordersRes.value);
      } else if (ordersRes.status === 'rejected') {
        console.error('[ADMIN ORDERS FETCH] Error:', ordersRes.reason);
      }

      if (menuRes.status === 'fulfilled' && menuRes.value) {
        setMenuItems(menuRes.value);
      } else if (menuRes.status === 'rejected') {
        console.error('[MENU FETCH] Error:', menuRes.reason);
      }

      if (feedRes.status === 'fulfilled' && feedRes.value) {
        setFeedback(feedRes.value);
      }

      if (contactRes.status === 'fulfilled' && contactRes.value) {
        setContacts(contactRes.value);
      }
    } catch (err) {
      console.warn('Error fetching admin data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;

    loadData();

    console.log('[ADMIN ORDERS FETCH] Subscribing to live orders in AdminPage...');
    const unsubOrders = subscribeToAllOrders(
      liveOrders => {
        console.log(`[ADMIN ORDERS LIVE] Received ${liveOrders.length} orders in AdminPage`);
        setOrders(liveOrders);
        setDataLoading(false);
      },
      err => {
        console.error('[ADMIN ORDERS LIVE] Listener error:', err);
      }
    );

    console.log('[MENU FETCH] Subscribing to live menu in AdminPage...');
    const unsubMenu = subscribeToMenuItems(
      liveMenu => {
        console.log(`[MENU LIVE] Received ${liveMenu.length} menu items in AdminPage`);
        setMenuItems(liveMenu);
      },
      err => {
        console.error('[MENU LIVE] AdminPage listener error:', err);
      }
    );

    console.log('[CONTACT ADMIN FETCH] Subscribing to live contacts in AdminPage...');
    const unsubContacts = subscribeToContacts(
      liveContacts => {
        console.log(`[CONTACT ADMIN FETCH] AdminPage received ${liveContacts.length} contacts`);
        setContacts(liveContacts);
      },
      err => {
        console.error('[CONTACT ADMIN FETCH] AdminPage listener error:', err);
      }
    );

    console.log('[FEEDBACK ADMIN FETCH] Subscribing to live feedback in AdminPage...');
    const unsubFeedback = subscribeToFeedbacks(
      liveFeedback => {
        console.log(`[FEEDBACK ADMIN FETCH] AdminPage received ${liveFeedback.length} feedback submissions`);
        setFeedback(liveFeedback);
      },
      err => {
        console.error('[FEEDBACK ADMIN FETCH] AdminPage listener error:', err);
      }
    );

    return () => {
      unsubOrders();
      unsubMenu();
      unsubContacts();
      unsubFeedback();
    };
  }, [isAdmin]);

  // Order status transition
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const ok = await updateOrderStatus(orderId, newStatus);
      if (ok) {
        setOrders(prev =>
          prev.map(o => (o.orderId === orderId ? { ...o, status: newStatus } : o))
        );
        showToast(`Order #${orderId} updated to ${newStatus}`, 'success');
      }
    } catch (err: any) {
      console.error('[ORDER STATUS UPDATE] Error:', err);
      showToast('Failed to update order status: ' + (err?.message || 'Database error'), 'error');
    }
  };

  // Toggle availability
  const handleToggleStock = async (item: MenuItem) => {
    const nextStock = !item.available;
    try {
      await toggleMenuItemAvailability(item.id, nextStock);
      setMenuItems(prev =>
        prev.map(i => (i.id === item.id ? { ...i, available: nextStock } : i))
      );
      showToast(
        `${item.name} is now ${nextStock ? 'In Stock' : 'Marked Sold Out'}`,
        nextStock ? 'success' : 'info'
      );
    } catch (err: any) {
      showToast('Could not update stock status: ' + (err?.message || 'Permission denied'), 'error');
    }
  };

  // Create new menu item
  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || newItemPrice <= 0) {
      showToast('Please provide a valid item name and price', 'error');
      return;
    }

    try {
      const newId = await createMenuItem({
        name: newItemName.trim(),
        category: newItemCategory,
        price: Number(newItemPrice),
        description: newItemDesc.trim() || 'Freshly handcrafted to order at Musafir Cafe.',
        image: '/src/assets/images/coffee_pour_latte_1790988158134.jpg',
        rating: 5.0,
        reviewsCount: 1,
        ingredients: ['Artisan Herbs', 'Fresh Ingredients'],
        isVeg: newItemVeg,
        veg: newItemVeg,
        available: true,
        popular: false,
        prepTime: newItemPrep,
        calories: newItemCalories
      });

      console.log(`[MENU CREATE] New menu item added with ID: ${newId}`);
      showToast(`Added "${newItemName}" to menu successfully!`, 'success');
      setIsAddModalOpen(false);
      // Reset form
      setNewItemName('');
      setNewItemDesc('');
      setNewItemPrice(199);
      loadData();
    } catch (err: any) {
      console.error('[MENU CREATE] Error creating menu item:', err);
      const errMsg = err?.message || 'Firestore permission denied or network error';
      showToast(`Failed to add menu item: ${errMsg}`, 'error');
    }
  };

  // Open edit modal
  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditPrice(item.price);
    setEditDesc(item.description);
    setEditVeg(Boolean(item.isVeg || item.veg));
  };

  // Save edit item
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      await updateMenuItem(editingItem.id, {
        name: editName.trim(),
        category: editCategory,
        price: Number(editPrice),
        description: editDesc.trim(),
        isVeg: editVeg,
        veg: editVeg
      });

      setMenuItems(prev =>
        prev.map(i =>
          i.id === editingItem.id
            ? {
                ...i,
                name: editName.trim(),
                category: editCategory,
                price: Number(editPrice),
                description: editDesc.trim(),
                isVeg: editVeg,
                veg: editVeg
              }
            : i
        )
      );
      showToast(`Updated ${editName}`, 'success');
      setEditingItem(null);
    } catch (err) {
      showToast('Failed to update menu item', 'error');
    }
  };

  // Delete item
  const handleDeleteItem = async (itemId: string, itemName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${itemName}" from the menu?`)) {
      return;
    }

    try {
      await deleteMenuItem(itemId);
      setMenuItems(prev => prev.filter(i => i.id !== itemId));
      showToast(`Deleted ${itemName}`, 'info');
    } catch (err) {
      showToast('Failed to delete item', 'error');
    }
  };

  // Dashboard Stats Calculations
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'confirmed' || o.status === 'preparing').length;
  const completedOrdersCount = orders.filter(o => o.status === 'completed').length;
  const totalMenuItemsCount = menuItems.length;

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  // Filtered menu
  const filteredMenu = menuItems.filter(item => {
    if (!menuSearch.trim()) return true;
    const q = menuSearch.toLowerCase();
    return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
  });

  // 1. Loading auth state
  if (authLoading) {
    return (
      <div className="py-24 text-center text-sm text-[#8C7A6B]">
        <div className="w-8 h-8 border-2 border-[#C26D2B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span>Verifying Administrator Credentials...</span>
      </div>
    );
  }

  // 2. Unauthenticated: Prompt to log in as admin
  if (!user) {
    return (
      <div className="py-16 sm:py-24 max-w-lg mx-auto px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
          <ShieldCheck className="w-10 h-10 text-[#C26D2B]" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C26D2B]">
            Restricted Area
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#2B1B14]">
            Musafir Cafe Admin Portal
          </h2>
          <p className="text-sm text-[#6B5A4D] leading-relaxed">
            Please log in with the designated administrator account (<strong className="text-[#3F2A1D]">{ADMIN_EMAIL}</strong>) to access order dispatch and menu management.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => signInWithGoogle()}
            className="px-6 py-3.5 rounded-2xl bg-[#3F2A1D] hover:bg-[#2B1B14] text-white font-semibold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Sign In with Google</span>
          </button>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-[#FAF7F2] text-[#3F2A1D] border border-[#D5C7B8] font-semibold text-sm transition-all"
          >
            Sign In with Email
          </button>
        </div>
      </div>
    );
  }

  // 3. Authenticated, but not an admin: ACCESS DENIED
  if (!isAdmin) {
    return (
      <div className="py-20 max-w-lg mx-auto px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-rose-950">
          Access Denied
        </h2>
        <p className="text-sm text-[#6B5A4D] leading-relaxed">
          You do not have administrative permissions to view or manage the cafe backend.
        </p>
        <div className="p-3 bg-white rounded-xl border border-[#E7DFD5] text-xs text-[#8C7A6B]">
          Signed in as: <strong className="text-[#2B1B14]">{user.email}</strong> (Role: {profile?.role || 'customer'})
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-2.5 rounded-xl border border-[#3F2A1D] text-xs font-semibold text-[#3F2A1D] hover:bg-[#FAF7F2]"
          >
            Switch Account
          </button>
          {setActivePage && (
            <button
              onClick={() => setActivePage('home')}
              className="px-6 py-2.5 rounded-xl bg-[#3F2A1D] text-xs font-semibold text-white hover:bg-[#2B1B14]"
            >
              Back to Cafe
            </button>
          )}
        </div>
      </div>
    );
  }

  // 4. Authenticated Admin: Full Dashboard
  return (
    <div className="py-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E7DFD5]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Authenticated Administrator: {user.email}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1B14] tracking-tight">
            Admin Management Portal
          </h1>
          <p className="text-xs text-[#6B5A4D] mt-0.5">
            Real-time management for Musafir Cafe orders, live stock, menu items, and customer interactions.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={dataLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D5C7B8] text-xs font-bold text-[#3F2A1D] bg-white hover:bg-[#FAF7F2] shadow-xs transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${dataLoading ? 'animate-spin text-[#C26D2B]' : ''}`} />
          <span>Sync Database</span>
        </button>
      </div>

      {/* DASHBOARD STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Orders */}
        <div
          onClick={() => setActiveTab('orders')}
          className="cursor-pointer bg-white p-5 rounded-2xl border border-[#E7DFD5] hover:border-[#3F2A1D] transition-all shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[#8C7A6B] mb-2">
            <span className="font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#C26D2B]" />
          </div>
          <span className="font-serif text-3xl font-bold text-[#2B1B14] tabular-nums block">
            {totalOrdersCount}
          </span>
          <span className="text-[11px] text-[#6B5A4D] mt-1 block">Lifetime online orders</span>
        </div>

        {/* Pending Orders */}
        <div
          onClick={() => {
            setActiveTab('orders');
            setOrderFilter('pending');
          }}
          className="cursor-pointer bg-white p-5 rounded-2xl border border-[#E7DFD5] hover:border-amber-500 transition-all shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-amber-800 mb-2">
            <span className="font-bold uppercase tracking-wider">Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="font-serif text-3xl font-bold text-amber-700 tabular-nums block">
            {pendingOrdersCount}
          </span>
          <span className="text-[11px] text-[#6B5A4D] mt-1 block">Awaiting kitchen preparation</span>
        </div>

        {/* Completed Orders */}
        <div
          onClick={() => {
            setActiveTab('orders');
            setOrderFilter('completed');
          }}
          className="cursor-pointer bg-white p-5 rounded-2xl border border-[#E7DFD5] hover:border-emerald-500 transition-all shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-emerald-800 mb-2">
            <span className="font-bold uppercase tracking-wider">Completed Orders</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-serif text-3xl font-bold text-emerald-700 tabular-nums block">
            {completedOrdersCount}
          </span>
          <span className="text-[11px] text-[#6B5A4D] mt-1 block">Successfully fulfilled</span>
        </div>

        {/* Total Menu Items */}
        <div
          onClick={() => setActiveTab('menu')}
          className="cursor-pointer bg-white p-5 rounded-2xl border border-[#E7DFD5] hover:border-[#3F2A1D] transition-all shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[#8C7A6B] mb-2">
            <span className="font-bold uppercase tracking-wider">Total Menu Items</span>
            <Coffee className="w-4 h-4 text-[#C26D2B]" />
          </div>
          <span className="font-serif text-3xl font-bold text-[#2B1B14] tabular-nums block">
            {totalMenuItemsCount}
          </span>
          <span className="text-[11px] text-[#6B5A4D] mt-1 block">
            {menuItems.filter(i => i.available !== false).length} in stock
          </span>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E7DFD5]">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'border-[#C26D2B] text-[#C26D2B]'
              : 'border-transparent text-[#6B5A4D] hover:text-[#2B1B14]'
          }`}
        >
          Dashboard Overview
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-[#C26D2B] text-[#C26D2B]'
              : 'border-transparent text-[#6B5A4D] hover:text-[#2B1B14]'
          }`}
        >
          <span>Orders Management</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-200 text-stone-800">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'menu'
              ? 'border-[#C26D2B] text-[#C26D2B]'
              : 'border-transparent text-[#6B5A4D] hover:text-[#2B1B14]'
          }`}
        >
          <span>Menu Management</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-200 text-stone-800">
            {menuItems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'feedback'
              ? 'border-[#C26D2B] text-[#C26D2B]'
              : 'border-transparent text-[#6B5A4D] hover:text-[#2B1B14]'
          }`}
        >
          <span>Customer Feedback</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-200 text-stone-800">
            {feedback.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'contacts'
              ? 'border-[#C26D2B] text-[#C26D2B]'
              : 'border-transparent text-[#6B5A4D] hover:text-[#2B1B14]'
          }`}
        >
          <span>Contact Messages</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-200 text-stone-800">
            {contacts.length}
          </span>
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* 1. DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Orders Preview */}
            <div className="bg-white rounded-3xl border border-[#E7DFD5] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE3]">
                <h3 className="font-serif text-lg font-bold text-[#2B1B14]">
                  Recent Customer Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-[#C26D2B] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-[#8C7A6B] py-6 text-center">No orders recorded yet.</p>
              ) : (
                <div className="divide-y divide-[#F2ECE3]">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.orderId} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#2B1B14]">#{order.orderId}</span>
                          <span className="font-semibold text-stone-700">{order.customerName}</span>
                        </div>
                        <span className="text-[#8C7A6B] text-[11px]">
                          {order.items.length} items · {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#2B1B14] block">₹{order.total}</span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions & Menu Inventory Status */}
            <div className="bg-white rounded-3xl border border-[#E7DFD5] p-6 space-y-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE3]">
                  <h3 className="font-serif text-lg font-bold text-[#2B1B14]">
                    Kitchen Quick Actions
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button
                    onClick={() => {
                      setActiveTab('menu');
                      setIsAddModalOpen(true);
                    }}
                    className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] hover:border-[#3F2A1D] text-left transition-all group"
                  >
                    <Plus className="w-5 h-5 text-[#C26D2B] mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xs text-[#2B1B14] block">Add Menu Item</span>
                    <span className="text-[11px] text-[#8C7A6B]">Create fresh dish or beverage</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('orders');
                      setOrderFilter('pending');
                    }}
                    className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] hover:border-[#3F2A1D] text-left transition-all group"
                  >
                    <Clock className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xs text-[#2B1B14] block">Pending Orders</span>
                    <span className="text-[11px] text-[#8C7A6B]">{pendingOrdersCount} orders needing prep</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 mt-4">
                <strong className="block font-bold">Cloud Firestore Sync Active:</strong>
                All operations performed here synchronously update the database and reflect across customer devices.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E7DFD5]">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">Filter by Status:</span>
              <select
                value={orderFilter}
                onChange={e => setOrderFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#D5C7B8] text-xs font-semibold bg-[#FAF7F2] text-[#2B1B14] focus:outline-none"
              >
                <option value="all">All Orders ({orders.length})</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <span className="text-xs text-[#8C7A6B]">
              Showing {filteredOrders.length} of {orders.length} orders
            </span>
          </div>

          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#E7DFD5] text-sm text-[#8C7A6B]">
                No orders match the selected filter.
              </div>
            ) : (
              filteredOrders.map(order => (
                <div
                  key={order.orderId}
                  className="bg-white rounded-3xl border border-[#E7DFD5] p-6 space-y-4 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F2ECE3]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-lg font-bold text-[#2B1B14]">
                          Order #{order.orderId}
                        </span>
                        <span className="text-xs text-[#8C7A6B]">·</span>
                        <span className="font-semibold text-sm text-[#3F2A1D]">
                          {order.customerName}
                        </span>
                        <span className="text-xs text-[#8C7A6B]">({order.phone})</span>
                      </div>
                      <span className="text-xs text-[#8C7A6B]">
                        Placed: {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Mode: {order.orderType.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-serif text-xl font-bold text-[#C26D2B] tabular-nums block">
                          ₹{order.total}
                        </span>
                        <span className="text-[10px] text-[#8C7A6B] uppercase">{order.paymentMethod}</span>
                      </div>

                      {/* Status Dropdown */}
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.orderId, e.target.value as OrderStatus)}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider focus:outline-none ${
                          order.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : order.status === 'preparing' || order.status === 'pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : order.status === 'out_for_delivery'
                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                            : 'bg-stone-50 text-stone-800 border-stone-300'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl text-xs space-y-1.5">
                    <div className="font-semibold text-[#2B1B14]">
                      Items: {order.items.map(i => `${i.quantity}x ${i.menuItem?.name}`).join(', ')}
                    </div>
                    {order.deliveryAddress && (
                      <div className="text-[#6B5A4D]">
                        Delivery Address: {order.deliveryAddress}, {order.city} - {order.pincode}
                      </div>
                    )}
                    {order.specialInstructions && (
                      <div className="text-[#C26D2B] italic">
                        Special Instructions: {order.specialInstructions}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. MENU MANAGEMENT */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E7DFD5]">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={menuSearch}
                onChange={e => setMenuSearch(e.target.value)}
                placeholder="Search menu items..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#D5C7B8] text-xs focus:outline-none focus:border-[#C26D2B]"
              />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3F2A1D] hover:bg-[#2B1B14] text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#E08A3C]" />
              <span>Add New Menu Item</span>
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-[#E7DFD5] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#5A4B40]">
                <thead className="bg-[#FAF7F2] text-[#8C7A6B] font-bold uppercase tracking-wider border-b border-[#E7DFD5]">
                  <tr>
                    <th className="py-3.5 px-4">Item Name</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Dietary</th>
                    <th className="py-3.5 px-4">Stock Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE3]">
                  {filteredMenu.map(item => (
                    <tr key={item.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#2B1B14]">
                        {item.name}
                      </td>
                      <td className="py-3.5 px-4">{item.category}</td>
                      <td className="py-3.5 px-4 font-bold tabular-nums">₹{item.price}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.isVeg || item.veg ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                          {item.isVeg || item.veg ? 'Veg' : 'Non-Veg'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleStock(item)}
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                            item.available !== false
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                          }`}
                        >
                          {item.available !== false ? 'In Stock (Available)' : 'Sold Out'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-stone-600 hover:text-[#3F2A1D] hover:bg-[#FAF7F2] transition-colors"
                          title="Edit Item"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. CUSTOMER FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <div className="text-xs text-[#8C7A6B]">
            Total Reviews: <strong className="text-[#2B1B14]">{feedback.length}</strong>
          </div>
          {feedback.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E7DFD5] p-12 text-center text-sm text-[#8C7A6B]">
              No customer feedback submissions yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedback.map(fb => (
                <div key={fb.id} className="bg-white rounded-3xl border border-[#E7DFD5] p-5 space-y-2 shadow-xs">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-sm text-[#2B1B14]">
                      {fb.customerName || fb.name || 'Musafir Guest'}
                    </span>
                    <div className="flex items-center text-amber-500 font-bold">
                      ★ {fb.rating} / 5
                    </div>
                  </div>
                  <p className="text-xs text-[#5A4B40] leading-relaxed italic bg-[#FAF7F2] p-3 rounded-xl">
                    “{fb.message}”
                  </p>
                  <div className="text-[11px] text-[#8C7A6B] flex justify-between pt-1">
                    <span>{fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : 'Recent'}</span>
                    <span>Customer ID: {fb.customerId || 'Guest'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. CONTACT MESSAGES */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          <div className="text-xs text-[#8C7A6B]">
            Inquiries Received: <strong className="text-[#2B1B14]">{contacts.length}</strong>
          </div>
          {contacts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E7DFD5] p-12 text-center text-sm text-[#8C7A6B]">
              No contact inquiries yet.
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map(c => (
                <div key={c.id} className="bg-white rounded-3xl border border-[#E7DFD5] p-5 space-y-2 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 border-b border-[#F2ECE3] pb-2">
                    <span className="font-bold text-sm text-[#2B1B14]">{c.name}</span>
                    <div className="text-[#8C7A6B] flex items-center gap-3">
                      <span>{c.email}</span>
                      <span>·</span>
                      <span>{c.phone}</span>
                      <span>·</span>
                      <span>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recent'}</span>
                    </div>
                  </div>
                  {c.subject && (
                    <span className="text-xs font-semibold text-[#C26D2B] block">
                      Subject: {c.subject}
                    </span>
                  )}
                  <p className="text-xs text-[#5A4B40] leading-relaxed bg-[#FAF7F2] p-3.5 rounded-xl">
                    {c.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADD ITEM MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-[#E7DFD5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
              <h3 className="font-serif text-xl font-bold text-[#2B1B14]">
                Add New Menu Item
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMenuItem} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="block font-bold uppercase tracking-wider text-[#8C7A6B]">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  placeholder="e.g. Saffron Rose Latte"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5C7B8] text-sm focus:outline-none focus:border-[#C26D2B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold uppercase tracking-wider text-[#8C7A6B]">
                    Category *
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={e => setNewItemCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5C7B8] text-sm focus:outline-none focus:border-[#C26D2B] bg-white"
                  >
                    <option value="Coffee">Coffee</option>
                    <option value="Tea">Tea</option>
                    <option value="Cold Drinks">Cold Drinks</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Burger">Burger</option>
                    <option value="Sandwich">Sandwich</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold uppercase tracking-wider text-[#8C7A6B]">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newItemPrice}
                    onChange={e => setNewItemPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D5C7B8] text-sm focus:outline-none focus:border-[#C26D2B]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold uppercase tracking-wider text-[#8C7A6B]">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newItemDesc}
                  onChange={e => setNewItemDesc(e.target.value)}
                  placeholder="Appetizing description of ingredients, aroma, and taste..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5C7B8] text-sm focus:outline-none focus:border-[#C26D2B]"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={newItemVeg}
                    onChange={() => setNewItemVeg(true)}
                    className="text-[#C26D2B] focus:ring-[#C26D2B]"
                  />
                  <span className="font-semibold text-emerald-800">Vegetarian</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!newItemVeg}
                    onChange={() => setNewItemVeg(false)}
                    className="text-[#C26D2B] focus:ring-[#C26D2B]"
                  />
                  <span className="font-semibold text-rose-800">Non-Vegetarian</span>
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#3F2A1D] hover:bg-[#2B1B14] text-white font-semibold text-xs transition-colors"
                >
                  Save Item to Menu
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-3 rounded-xl border border-[#D5C7B8] text-stone-600 text-xs font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ITEM MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-[#E7DFD5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
              <h3 className="font-serif text-xl font-bold text-[#2B1B14]">
                Edit Menu Item
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="block font-bold uppercase tracking-wider text-[#8C7A6B]">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5C7B8] text-sm focus:outline-none focus:border-[#C26D2B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold uppercase tracking-wider text-[#8C7A6B]">
                    Category *
                  </label>
                  <select
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5C7B8] text-sm focus:outline-none focus:border-[#C26D2B] bg-white"
                  >
                    <option value="Coffee">Coffee</option>
                    <option value="Tea">Tea</option>
                    <option value="Cold Drinks">Cold Drinks</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Burger">Burger</option>
                    <option value="Sandwich">Sandwich</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold uppercase tracking-wider text-[#8C7A6B]">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editPrice}
                    onChange={e => setEditPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D5C7B8] text-sm focus:outline-none focus:border-[#C26D2B]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold uppercase tracking-wider text-[#8C7A6B]">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5C7B8] text-sm focus:outline-none focus:border-[#C26D2B]"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={editVeg}
                    onChange={() => setEditVeg(true)}
                    className="text-[#C26D2B] focus:ring-[#C26D2B]"
                  />
                  <span className="font-semibold text-emerald-800">Vegetarian</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!editVeg}
                    onChange={() => setEditVeg(false)}
                    className="text-[#C26D2B] focus:ring-[#C26D2B]"
                  />
                  <span className="font-semibold text-rose-800">Non-Vegetarian</span>
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#3F2A1D] hover:bg-[#2B1B14] text-white font-semibold text-xs transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-3 rounded-xl border border-[#D5C7B8] text-stone-600 text-xs font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
