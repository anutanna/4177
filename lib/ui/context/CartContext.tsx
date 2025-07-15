"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { authClient } from "@/auth-client";
import { getCartCount } from "@/lib/actions/cart_actions";

interface CartContextType {
  cartCount: number;
  fetchCartItems: () => void; // 🔁 renamed from refreshCart
}

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  fetchCartItems: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);
  const { data: session } = authClient.useSession();

  const fetchCartItems = useCallback(async () => {
    if (!session?.user) {
      // If not logged in, cart count is 0
      setCartCount(0);
      return;
    }

    try {
      const count = await getCartCount();
      setCartCount(count);
    } catch (err) {
      console.error("Failed to refresh cart:", err);
    }
  }, [session?.user]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartItems }}>
      {children}
    </CartContext.Provider>
  );
};
