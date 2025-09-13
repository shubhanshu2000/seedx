import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface Seed {
  id: number;
  name: string;
  quality: string;
  price: number;
  farmer: string;
  image?: string;
}

interface CartItem {
  seed: Seed;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (seed: Seed, quantity: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  getTotal: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (seed: Seed, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.seed.id === seed.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.seed.id === seed.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { seed, quantity }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.seed.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.seed.id === id ? { ...item, quantity } : item
      )
    );
  };

  const getTotal = () => {
    return cart.reduce(
      (total, item) => total + item.seed.price * item.quantity,
      0
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
