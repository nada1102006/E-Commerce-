import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    itemCount: 0,
    subtotal: 0,
    discountAmount: 0,
    total: 0,
    coupon: null,
  });


  const getCart = async () => {
    try {
      const res = await api.get("/carts");
      setCart(res.data);
    } catch (error) {
      console.log(error);
    }
  };


  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      await api.patch("/carts/items", {
        productId,
        quantity,
      });

      await getCart();

    } catch (error) {
      console.log(error);
    }
  };


  const removeItem = async (productId) => {
    try {
      await api.delete(`/carts/items/${productId}`);

      await getCart();

    } catch (error) {
      console.log(error);
    }
  };


  const applyCoupon = async (coupon) => {
    try {
      await api.post("/carts/coupon", {
        coupon,
      });

      await getCart();

    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getCart();
  }, []);


  return (
    <CartContext.Provider
      value={{
        cart,
        getCart,
        updateQuantity,
        removeItem,
        applyCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => useContext(CartContext);