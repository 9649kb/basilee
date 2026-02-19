
import React from 'react';
import { useShop } from '../context/ShopContext';
import CheckoutModal from './CheckoutModal';

const GlobalCheckout: React.FC = () => {
  const { orderItem, closeCheckout } = useShop();

  return (
    <CheckoutModal 
      isOpen={orderItem !== null} 
      item={orderItem}
      onClose={closeCheckout}
    />
  );
};

export default GlobalCheckout;
