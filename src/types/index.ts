export type MenuCategory =
  | 'All'
  | 'Coffee'
  | 'Tea'
  | 'Cold Drinks'
  | 'Pizza'
  | 'Burger'
  | 'Sandwich'
  | 'Snacks'
  | 'Main Course'
  | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<MenuCategory, 'All'>;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviewsCount?: number;
  ingredients?: string[];
  isVeg?: boolean;
  veg?: boolean;
  available?: boolean;
  popular?: boolean;
  prepTime?: string;
  calories?: string;
  createdAt?: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export type OrderType = 'delivery' | 'pickup';
export type PaymentMethod = 'cod' | 'upi' | 'card';
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

export interface OrderDetails {
  orderId: string;
  customerId: string;
  customerName: string;
  phone: string;
  mobile?: string;
  email?: string;
  items: CartItem[];
  subtotal: number;
  GST: number;
  tax?: number;
  deliveryCharge: number;
  total: number;
  orderType: OrderType;
  deliveryAddress?: string;
  city?: string;
  pincode?: string;
  specialInstructions?: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  estimatedMinutes?: number;
}

export interface FeedbackItem {
  id: string;
  customerId?: string;
  customerName?: string;
  name?: string;
  email?: string;
  orderId?: string;
  rating: number;
  message: string;
  date?: string;
  createdAt?: string;
  verified?: boolean;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  createdAt?: string;
  submittedAt?: string;
}

export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export type ActivePage =
  | 'home'
  | 'about'
  | 'menu'
  | 'order'
  | 'cart'
  | 'contact'
  | 'feedback'
  | 'orders'
  | 'admin';
