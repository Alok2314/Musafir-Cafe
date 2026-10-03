import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CartItem, OrderType } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, notes?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  tax: number;
  getDeliveryCharge: (orderType: OrderType) => number;
  getGrandTotal: (orderType: OrderType) => number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CART_STORAGE_KEY = 'musafir_cafe_cart_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn('Unable to persist cart to localStorage', err);
    }
  }, [items]);

  const addToCart = (menuItem: MenuItem, quantity = 1, notes?: string) => {
    const qtyToAdd = Math.max(1, quantity);
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(i => i.menuItem.id === menuItem.id);
      if (existingIndex > -1) {
        const next = [...prevItems];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + qtyToAdd,
          notes: notes !== undefined ? notes : next[existingIndex].notes
        };
        return next;
      } else {
        return [...prevItems, { menuItem, quantity: qtyToAdd, notes }];
      }
    });

    showToast(`Added ${qtyToAdd > 1 ? `${qtyToAdd}x ` : ''}${menuItem.name} to cart!`, 'success');
  };

  const removeFromCart = (itemId: string) => {
    const itemToRemove = items.find(i => i.menuItem.id === itemId);
    setItems(prevItems => prevItems.filter(i => i.menuItem.id !== itemId));
    if (itemToRemove) {
      showToast(`Removed ${itemToRemove.menuItem.name} from cart`, 'info');
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.menuItem.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  
  // 5% Restaurant GST
  const tax = Math.round(subtotal * 0.05);

  const getDeliveryCharge = (orderType: OrderType): number => {
    if (orderType === 'pickup' || subtotal === 0) return 0;
    // Free delivery on orders ₹500 and above
    return subtotal >= 500 ? 0 : 40;
  };

  const getGrandTotal = (orderType: OrderType): number => {
    return subtotal + tax + getDeliveryCharge(orderType);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        tax,
        getDeliveryCharge,
        getGrandTotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
