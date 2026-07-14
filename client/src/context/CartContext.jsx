import { createContext, useContext, useEffect, useState } from "react";
import { getCart } from "../services/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await getCart();
      setCart(data.cart || []);
    } catch (error) {
      // Not logged in, or request failed — just show an empty cart
      setCart([]);
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, loadCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);