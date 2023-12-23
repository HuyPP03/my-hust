"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, useState } from "react";

export const CartContext = createContext({});
export const AuthProvider = ({ children }) => {
  const [cartProducts, setCartProducts] = useState([]);
  function addToCart(orderItem) {
    setCartProducts(orderItem);
  }
  return (
    <SessionProvider>
      <CartContext.Provider
        value={{
          cartProducts,
          setCartProducts,
          addToCart,
        }}
      >
        {children}
      </CartContext.Provider>
    </SessionProvider>
  );
};
