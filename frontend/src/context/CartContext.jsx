import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  const fetchCart = async () => {
    if (!token) {
      setCartItems([]);
      setCartLoading(false);
      return;
    }

    try {
      setCartLoading(true);

      const { data } = await axiosInstance.get("/cart");

      if (data.success) {
        setCartItems(data.cartItems);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCartLoading(false);
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        fetchCart,
        cartCount,
        cartLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
