import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i._id === item._id);
      if (existingItem) {
        return prevItems.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const incrementItem = (item) => {
    setCartItems((prevItems) =>
      prevItems.map((i) =>
        i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const decrementItem = (item) => {
    setCartItems((prevItems) =>
      prevItems.map((i) =>
        i._id === item._id ? { ...i, quantity: Math.max(i.quantity - 1, 1) } : i
      )
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, incrementItem, decrementItem }}>
      {children}
    </CartContext.Provider>
  );
};
