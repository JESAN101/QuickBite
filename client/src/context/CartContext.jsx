import { createContext, useContext, useEffect, useState } from "react";
import { getCart } from "../services/cartService";
import { isLoggedIn } from "../utils/auth";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const loadCart = async () => {
    if (!isLoggedIn()) {
      setCart([]);
      return;
    }

    try {
      const data = await getCart();
      setCart(data.cart || []);
    } catch {
      // Request failed — just show an empty cart
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, loadCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);