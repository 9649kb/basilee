
import React, { createContext, useContext, useState } from 'react';

interface OrderItem {
  id: string;
  title: string;
  price: string;
  category: string;
}

interface ShopContextType {
  orderItem: OrderItem | null;
  openCheckout: (item: OrderItem) => void;
  closeCheckout: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orderItem, setOrderItem] = useState<OrderItem | null>(null);

  const openCheckout = (item: OrderItem) => setOrderItem(item);
  const closeCheckout = () => setOrderItem(null);

  return (
    <ShopContext.Provider value={{ orderItem, openCheckout, closeCheckout }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
