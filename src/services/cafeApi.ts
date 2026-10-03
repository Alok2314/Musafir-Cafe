/**
 * Musafir Cafe - Real Firebase Firestore API Layer
 * 
 * Provides live persistence for:
 * - users
 * - menuItems
 * - orders (with order history and admin status updates)
 * - feedback
 * - contacts
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import {
  MenuItem,
  OrderDetails,
  FeedbackItem,
  ContactSubmission,
  OrderStatus
} from '../types';
import { MENU_ITEMS } from '../data/menuData';
import { INITIAL_REVIEWS } from '../data/reviewsData';

const MENU_COLLECTION = 'menuItems';
const ORDERS_COLLECTION = 'orders';
const FEEDBACK_COLLECTION = 'feedback';
const CONTACTS_COLLECTION = 'contacts';

let isSeedingMenu = false;

/**
 * Fetch all menu items from Cloud Firestore.
 */
export async function getMenuItems(): Promise<MenuItem[]> {
  console.log('[MENU FETCH] Requesting menuItems from Firestore...');
  try {
    const colRef = collection(db, MENU_COLLECTION);
    const snap = await getDocs(colRef);

    if (!snap.empty) {
      const items: MenuItem[] = [];
      snap.forEach(docSnap => {
        const data = docSnap.data();
        const isVegVal = data.isVeg !== undefined ? Boolean(data.isVeg) : (data.veg !== undefined ? Boolean(data.veg) : true);
        items.push({
          id: docSnap.id,
          name: data.name || 'Unnamed Dish',
          category: data.category || 'Coffee',
          description: data.description || '',
          price: Number(data.price) || 0,
          image: data.image || '/src/assets/images/coffee_pour_latte_1790988158134.jpg',
          rating: typeof data.rating === 'number' ? data.rating : 4.8,
          reviewsCount: data.reviewsCount ?? 50,
          ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
          isVeg: isVegVal,
          veg: isVegVal,
          available: data.available !== undefined ? Boolean(data.available) : true,
          popular: Boolean(data.popular),
          prepTime: data.prepTime || '10-15 mins',
          calories: data.calories || '350 kcal',
          createdAt: data.createdAt || new Date().toISOString()
        });
      });
      console.log(`[MENU FETCH] Successfully loaded ${items.length} items from Firestore.`);
      return items;
    }

    console.log('[MENU FETCH] Firestore menu collection is currently empty.');

    // Seed database if admin is signed in and empty
    if (!isSeedingMenu && auth.currentUser) {
      isSeedingMenu = true;
      console.log('[MENU FETCH] Attempting initial database seed...');
      try {
        for (const item of MENU_ITEMS) {
          const docRef = doc(db, MENU_COLLECTION, item.id);
          await setDoc(docRef, {
            name: item.name,
            category: item.category,
            description: item.description,
            price: item.price,
            image: item.image,
            rating: item.rating,
            reviewsCount: item.reviewsCount || 10,
            ingredients: item.ingredients || [],
            isVeg: Boolean(item.veg),
            veg: Boolean(item.veg),
            available: true,
            popular: Boolean(item.popular),
            prepTime: item.prepTime || '10-15 mins',
            calories: item.calories || '300 kcal',
            createdAt: new Date().toISOString()
          });
        }
        console.log('[MENU FETCH] Seeding complete.');
      } catch (seedErr: any) {
        console.warn('[MENU FETCH] Auto-seed skipped (requires admin):', seedErr?.message);
      } finally {
        isSeedingMenu = false;
      }
    }

    // Fallback to initial local items while seeding or if offline
    return [...MENU_ITEMS.map(i => ({ ...i, isVeg: Boolean(i.veg), available: true }))];
  } catch (error: any) {
    console.error('[MENU FETCH] Error loading menu from Firestore:', error?.code, error?.message);
    return [...MENU_ITEMS.map(i => ({ ...i, isVeg: Boolean(i.veg), available: true }))];
  }
}

/**
 * Real-time listener for Menu Items (auto-updates customer MenuPage and Admin)
 */
export function subscribeToMenuItems(
  onUpdate: (items: MenuItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  console.log('[MENU FETCH] Subscribing to live menuItems collection...');
  const colRef = collection(db, MENU_COLLECTION);
  return onSnapshot(
    colRef,
    snap => {
      if (!snap.empty) {
        const items: MenuItem[] = [];
        snap.forEach(docSnap => {
          const data = docSnap.data();
          const isVegVal = data.isVeg !== undefined ? Boolean(data.isVeg) : (data.veg !== undefined ? Boolean(data.veg) : true);
          items.push({
            id: docSnap.id,
            name: data.name || 'Unnamed Dish',
            category: data.category || 'Coffee',
            description: data.description || '',
            price: Number(data.price) || 0,
            image: data.image || '/src/assets/images/coffee_pour_latte_1790988158134.jpg',
            rating: typeof data.rating === 'number' ? data.rating : 4.8,
            reviewsCount: data.reviewsCount ?? 50,
            ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
            isVeg: isVegVal,
            veg: isVegVal,
            available: data.available !== undefined ? Boolean(data.available) : true,
            popular: Boolean(data.popular),
            prepTime: data.prepTime || '10-15 mins',
            calories: data.calories || '350 kcal',
            createdAt: data.createdAt || new Date().toISOString()
          });
        });
        console.log(`[MENU LIVE] Real-time update: ${items.length} items from Firestore.`);
        onUpdate(items);
      } else {
        console.log('[MENU LIVE] Collection is empty, using fallback items.');
        onUpdate(MENU_ITEMS.map(i => ({ ...i, isVeg: Boolean(i.veg), available: true })));
      }
    },
    error => {
      console.error('[MENU LIVE] Snapshot listener error:', error?.code, error?.message);
      if (onError) onError(error);
    }
  );
}

/**
 * Fetch a single menu item by ID
 */
export async function getMenuItemById(id: string): Promise<MenuItem | undefined> {
  try {
    const docRef = doc(db, MENU_COLLECTION, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        id: snap.id,
        name: data.name,
        category: data.category,
        description: data.description,
        price: data.price,
        image: data.image,
        rating: data.rating,
        reviewsCount: data.reviewsCount,
        ingredients: data.ingredients,
        isVeg: data.isVeg ?? true,
        veg: data.isVeg ?? true,
        available: data.available ?? true,
        popular: data.popular,
        prepTime: data.prepTime,
        calories: data.calories
      };
    }
  } catch (err) {
    console.warn('Error fetching item by ID:', err);
  }
  return MENU_ITEMS.find(i => i.id === id) as MenuItem | undefined;
}

/**
 * Get popular items from Firestore
 */
export async function getPopularMenuItems(): Promise<MenuItem[]> {
  const all = await getMenuItems();
  const popular = all.filter(i => i.popular);
  return popular.length > 0 ? popular.slice(0, 6) : all.slice(0, 6);
}

/**
 * Create a new customer order and write to Firestore orders/{orderId}
 */
export async function createOrder(orderPayload: {
  customerId: string;
  customerName: string;
  phone: string;
  email?: string;
  items: any[];
  subtotal: number;
  GST: number;
  tax?: number;
  deliveryCharge: number;
  total: number;
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  city?: string;
  pincode?: string;
  specialInstructions?: string;
  paymentMethod: 'cod' | 'upi' | 'card';
  estimatedMinutes?: number;
}): Promise<OrderDetails> {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `MC-${randomSuffix}`;
  const now = new Date().toISOString();

  // Ensure authenticated user UID is prioritized so security rules match request.auth.uid
  const effectiveCustomerId = auth.currentUser?.uid || orderPayload.customerId || 'guest';

  // Sanitize every single field to prevent "undefined" Firestore serialization errors
  const sanitizedItems = (orderPayload.items || []).map(item => ({
    menuItem: {
      id: item.menuItem?.id || 'item',
      name: item.menuItem?.name || 'Dish',
      category: item.menuItem?.category || 'Food',
      price: Number(item.menuItem?.price) || 0,
      image: item.menuItem?.image || '',
      description: item.menuItem?.description || '',
      isVeg: Boolean(item.menuItem?.isVeg ?? item.menuItem?.veg ?? true),
      rating: Number(item.menuItem?.rating) || 4.8
    },
    quantity: Number(item.quantity) || 1,
    notes: item.notes || ''
  }));

  const orderData: OrderDetails = {
    orderId,
    customerId: effectiveCustomerId,
    customerName: orderPayload.customerName?.trim() || 'Valued Guest',
    phone: orderPayload.phone?.trim() || '',
    email: orderPayload.email?.trim() || '',
    items: sanitizedItems,
    subtotal: Number(orderPayload.subtotal) || 0,
    GST: Number(orderPayload.GST ?? orderPayload.tax ?? Math.round(orderPayload.subtotal * 0.05)),
    tax: Number(orderPayload.tax ?? orderPayload.GST ?? Math.round(orderPayload.subtotal * 0.05)),
    deliveryCharge: Number(orderPayload.deliveryCharge) || 0,
    total: Number(orderPayload.total) || 0,
    orderType: orderPayload.orderType || 'delivery',
    deliveryAddress: orderPayload.deliveryAddress?.trim() || '',
    city: orderPayload.city?.trim() || '',
    pincode: orderPayload.pincode?.trim() || '',
    specialInstructions: orderPayload.specialInstructions?.trim() || '',
    paymentMethod: orderPayload.paymentMethod || 'cod',
    status: 'pending',
    createdAt: now,
    estimatedMinutes: orderPayload.estimatedMinutes ?? (orderPayload.orderType === 'delivery' ? 35 : 20)
  };

  console.log('[ORDER CREATE] Writing order to Firestore:', orderId, 'customerId:', effectiveCustomerId);

  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await setDoc(docRef, orderData);
    console.log(`[ORDER CREATE] Successfully created order document in Firestore: orders/${orderId}`);
  } catch (error: any) {
    console.error(`[ORDER CREATE] Firestore write FAILED:`, error?.code, error?.message);
    handleFirestoreError(error, OperationType.CREATE, `${ORDERS_COLLECTION}/${orderId}`);
  }

  return orderData;
}

/**
 * Fetch orders for a specific customer (Order History)
 */
export async function getCustomerOrders(customerId: string): Promise<OrderDetails[]> {
  if (!customerId) return [];
  console.log(`[CUSTOMER ORDERS FETCH] Querying orders for customerId: ${customerId}`);
  try {
    const colRef = collection(db, ORDERS_COLLECTION);
    const q = query(colRef, where('customerId', '==', customerId));
    const snap = await getDocs(q);
    const orders: OrderDetails[] = [];
    snap.forEach(d => {
      orders.push(d.data() as OrderDetails);
    });
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err: any) {
    console.error('[CUSTOMER ORDERS FETCH] Error:', err?.code, err?.message);
    return [];
  }
}

/**
 * Fetch all orders across all customers (Admin authorized query)
 */
export async function getAllOrders(): Promise<OrderDetails[]> {
  console.log('[ADMIN ORDERS FETCH] Fetching all orders from Firestore orders collection...');
  try {
    const colRef = collection(db, ORDERS_COLLECTION);
    const snap = await getDocs(colRef);
    const orders: OrderDetails[] = [];
    snap.forEach(d => {
      orders.push(d.data() as OrderDetails);
    });
    console.log(`[ADMIN ORDERS FETCH] Successfully loaded ${orders.length} orders.`);
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err: any) {
    console.error('[ADMIN ORDERS FETCH] Error fetching orders:', err?.code, err?.message);
    handleFirestoreError(err, OperationType.LIST, ORDERS_COLLECTION);
  }
}

/**
 * Real-time listener for Admin Orders
 */
export function subscribeToAllOrders(
  onUpdate: (orders: OrderDetails[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  console.log('[ADMIN ORDERS LIVE] Subscribing to orders collection...');
  const colRef = collection(db, ORDERS_COLLECTION);
  return onSnapshot(
    colRef,
    snap => {
      const orders: OrderDetails[] = [];
      snap.forEach(d => {
        orders.push(d.data() as OrderDetails);
      });
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      console.log(`[ADMIN ORDERS LIVE] Received real-time update: ${orders.length} orders.`);
      onUpdate(orders);
    },
    error => {
      console.error('[ADMIN ORDERS LIVE] Snapshot listener error:', error?.code, error?.message);
      if (onError) onError(error);
    }
  );
}

/**
 * Update order status (Admin)
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  console.log(`[ORDER STATUS UPDATE] Setting order #${orderId} status to: ${status}`);
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, { status });
    console.log(`[ORDER STATUS UPDATE] Order #${orderId} successfully updated.`);
    return true;
  } catch (err: any) {
    console.error(`[ORDER STATUS UPDATE] Failed:`, err?.code, err?.message);
    handleFirestoreError(err, OperationType.UPDATE, `${ORDERS_COLLECTION}/${orderId}`);
    return false;
  }
}

/**
 * Submit customer feedback to Cloud Firestore
 */
export async function submitFeedback(feedbackPayload: {
  customerId?: string | null;
  customerName: string;
  rating: number;
  message: string;
}): Promise<FeedbackItem> {
  const now = new Date().toISOString();
  const clampedRating = Math.max(1, Math.min(5, Math.round(Number(feedbackPayload.rating) || 5)));
  const effectiveCustomerId = auth.currentUser?.uid || (feedbackPayload.customerId && feedbackPayload.customerId !== 'guest' ? feedbackPayload.customerId : 'guest');

  const feedbackData = {
    customerId: effectiveCustomerId,
    customerName: feedbackPayload.customerName?.trim() || 'Musafir Diner',
    rating: clampedRating,
    message: feedbackPayload.message?.trim() || '',
    createdAt: now
  };

  console.log('[FEEDBACK CREATE] Submitting customer feedback to Firestore:', feedbackData);

  try {
    const docRef = await addDoc(collection(db, FEEDBACK_COLLECTION), feedbackData);
    console.log(`[FEEDBACK CREATE] Successfully created document feedback/${docRef.id}`);
    return {
      id: docRef.id,
      ...feedbackData,
      date: 'Just now',
      verified: Boolean(effectiveCustomerId && effectiveCustomerId !== 'guest')
    };
  } catch (err: any) {
    console.error('[FEEDBACK CREATE] Firestore write FAILED:', err?.code, err?.message);
    throw err;
  }
}

/**
 * Fetch all customer feedback from Firestore (Admin query)
 */
export async function getFeedbacks(): Promise<FeedbackItem[]> {
  console.log('[FEEDBACK ADMIN FETCH] Fetching feedback from Firestore...');
  try {
    const colRef = collection(db, FEEDBACK_COLLECTION);
    const snap = await getDocs(colRef);
    const items: FeedbackItem[] = [];
    snap.forEach(d => {
      const data = d.data();
      items.push({
        id: d.id,
        customerId: data.customerId || 'guest',
        customerName: data.customerName || data.name || 'Musafir Diner',
        name: data.customerName || data.name || 'Musafir Diner',
        rating: Number(data.rating) || 5,
        message: data.message || '',
        createdAt: data.createdAt || new Date().toISOString(),
        date: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Recent',
        verified: Boolean(data.customerId && data.customerId !== 'guest')
      });
    });
    console.log(`[FEEDBACK ADMIN FETCH] Loaded ${items.length} feedback items from Firestore.`);
    return items.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
  } catch (err: any) {
    console.error('[FEEDBACK ADMIN FETCH] Error fetching feedback:', err?.code, err?.message);
    throw err;
  }
}

/**
 * Real-time listener for Customer Feedback (Admin Portal)
 */
export function subscribeToFeedbacks(
  onUpdate: (feedbacks: FeedbackItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  console.log('[FEEDBACK ADMIN FETCH] Subscribing to feedback collection in real time...');
  const colRef = collection(db, FEEDBACK_COLLECTION);
  return onSnapshot(
    colRef,
    snap => {
      const items: FeedbackItem[] = [];
      snap.forEach(d => {
        const data = d.data();
        items.push({
          id: d.id,
          customerId: data.customerId || 'guest',
          customerName: data.customerName || data.name || 'Musafir Diner',
          name: data.customerName || data.name || 'Musafir Diner',
          rating: Number(data.rating) || 5,
          message: data.message || '',
          createdAt: data.createdAt || new Date().toISOString(),
          date: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Recent',
          verified: Boolean(data.customerId && data.customerId !== 'guest')
        });
      });
      items.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
      console.log(`[FEEDBACK ADMIN FETCH] Live update: ${items.length} feedback submissions.`);
      onUpdate(items);
    },
    error => {
      console.error('[FEEDBACK ADMIN FETCH] Snapshot listener error:', error?.code, error?.message);
      if (onError) onError(error);
    }
  );
}

/**
 * Submit contact form to Firestore
 */
export async function submitContactForm(contactPayload: {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
}): Promise<ContactSubmission> {
  const now = new Date().toISOString();
  const contactData = {
    name: contactPayload.name?.trim() || '',
    email: contactPayload.email?.trim() || '',
    phone: contactPayload.phone?.trim() || '',
    subject: contactPayload.subject?.trim() || 'General Inquiry',
    message: contactPayload.message?.trim() || '',
    createdAt: now
  };

  console.log('[CONTACT CREATE] Writing contact inquiry to Firestore:', contactData);

  try {
    const docRef = await addDoc(collection(db, CONTACTS_COLLECTION), contactData);
    console.log(`[CONTACT CREATE] Successfully created document contacts/${docRef.id}`);
    return {
      id: docRef.id,
      ...contactData
    };
  } catch (err: any) {
    console.error('[CONTACT CREATE] Firestore write FAILED:', err?.code, err?.message);
    throw err;
  }
}

/**
 * Fetch all contact submissions (Admin only)
 */
export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  console.log('[CONTACT ADMIN FETCH] Fetching contacts from Firestore...');
  try {
    const colRef = collection(db, CONTACTS_COLLECTION);
    const snap = await getDocs(colRef);
    const contacts: ContactSubmission[] = [];
    snap.forEach(d => {
      const data = d.data();
      contacts.push({
        id: d.id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        subject: data.subject || 'General Inquiry',
        message: data.message || '',
        createdAt: data.createdAt || new Date().toISOString()
      });
    });
    console.log(`[CONTACT ADMIN FETCH] Successfully loaded ${contacts.length} inquiries.`);
    return contacts.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
  } catch (err: any) {
    console.error('[CONTACT ADMIN FETCH] Error fetching contact submissions:', err?.code, err?.message);
    throw err;
  }
}

/**
 * Real-time listener for Contact Messages (Admin Portal)
 */
export function subscribeToContacts(
  onUpdate: (contacts: ContactSubmission[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  console.log('[CONTACT ADMIN FETCH] Subscribing to contacts collection in real time...');
  const colRef = collection(db, CONTACTS_COLLECTION);
  return onSnapshot(
    colRef,
    snap => {
      const contacts: ContactSubmission[] = [];
      snap.forEach(d => {
        const data = d.data();
        contacts.push({
          id: d.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          subject: data.subject || 'General Inquiry',
          message: data.message || '',
          createdAt: data.createdAt || new Date().toISOString()
        });
      });
      contacts.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
      console.log(`[CONTACT ADMIN FETCH] Live update: ${contacts.length} contact submissions.`);
      onUpdate(contacts);
    },
    error => {
      console.error('[CONTACT ADMIN FETCH] Snapshot listener error:', error?.code, error?.message);
      if (onError) onError(error);
    }
  );
}

/**
 * Toggle menu item availability (Admin only)
 */
export async function toggleMenuItemAvailability(itemId: string, available: boolean): Promise<boolean> {
  try {
    const docRef = doc(db, MENU_COLLECTION, itemId);
    await updateDoc(docRef, { available });
    return true;
  } catch (err: any) {
    console.error('Error toggling availability in Firestore:', err?.code, err?.message);
    handleFirestoreError(err, OperationType.UPDATE, `${MENU_COLLECTION}/${itemId}`);
    return false;
  }
}

/**
 * Add new menu item to menuItems collection (Admin only)
 */
export async function createMenuItem(item: Omit<MenuItem, 'id'>): Promise<string> {
  console.log(`[MENU CREATE] Admin creating new menu item: ${item.name}`);

  const isVegVal = item.isVeg !== undefined ? Boolean(item.isVeg) : (item.veg !== undefined ? Boolean(item.veg) : true);

  // Guarantee all 9 fields requested by user are present and sanitized
  const docData = {
    name: item.name?.trim() || 'Untitled Dish',
    description: item.description?.trim() || '',
    price: Number(item.price) || 0,
    category: item.category || 'Coffee',
    image: item.image || '/src/assets/images/coffee_pour_latte_1790988158134.jpg',
    isVeg: isVegVal,
    veg: isVegVal,
    rating: Number(item.rating) || 5.0,
    available: item.available !== undefined ? Boolean(item.available) : true,
    createdAt: new Date().toISOString()
  };

  try {
    const colRef = collection(db, MENU_COLLECTION);
    const docRef = await addDoc(colRef, docData);
    console.log(`[MENU CREATE] Successfully created document menuItems/${docRef.id}`);
    return docRef.id;
  } catch (err: any) {
    console.error(`[MENU CREATE] Firestore write FAILED:`, err?.code, err?.message);
    throw err;
  }
}

/**
 * Update existing menu item (Admin only)
 */
export async function updateMenuItem(itemId: string, updates: Partial<MenuItem>): Promise<boolean> {
  try {
    const docRef = doc(db, MENU_COLLECTION, itemId);
    const sanitizedUpdates: Record<string, any> = {};
    if (updates.name !== undefined) sanitizedUpdates.name = updates.name;
    if (updates.category !== undefined) sanitizedUpdates.category = updates.category;
    if (updates.price !== undefined) sanitizedUpdates.price = Number(updates.price);
    if (updates.description !== undefined) sanitizedUpdates.description = updates.description;
    if (updates.isVeg !== undefined) sanitizedUpdates.isVeg = Boolean(updates.isVeg);
    if (updates.available !== undefined) sanitizedUpdates.available = Boolean(updates.available);

    await updateDoc(docRef, sanitizedUpdates);
    console.log(`[MENU UPDATE] Successfully updated menuItems/${itemId}`);
    return true;
  } catch (err: any) {
    console.error(`[MENU UPDATE] Failed:`, err?.code, err?.message);
    handleFirestoreError(err, OperationType.UPDATE, `${MENU_COLLECTION}/${itemId}`);
    return false;
  }
}

/**
 * Delete menu item (Admin only)
 */
export async function deleteMenuItem(itemId: string): Promise<boolean> {
  try {
    const docRef = doc(db, MENU_COLLECTION, itemId);
    await deleteDoc(docRef);
    console.log(`[MENU DELETE] Successfully deleted menuItems/${itemId}`);
    return true;
  } catch (err: any) {
    console.error(`[MENU DELETE] Failed:`, err?.code, err?.message);
    handleFirestoreError(err, OperationType.DELETE, `${MENU_COLLECTION}/${itemId}`);
    return false;
  }
}
