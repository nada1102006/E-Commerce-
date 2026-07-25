// import { createContext, useContext, useEffect, useState } from "react";
// import api from "../api/api";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState({
//     items: [],
//     itemCount: 0,
//     subtotal: 0,
//     discountAmount: 0,
//     total: 0,
//     coupon: null,
//   });


//   const getCart = async () => {
//     try {
//       const res = await api.get("/carts");
//       setCart(res.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };


//   const updateQuantity = async (productId, quantity) => {
//     if (quantity < 1) return;

//     try {
//       await api.patch("/carts/items", {
//         productId,
//         quantity,
//       });

//       await getCart();

//     } catch (error) {
//       console.log(error);
//     }
//   };


//   const removeItem = async (productId) => {
//     try {
//       await api.delete(`/carts/items/${productId}`);

//       await getCart();

//     } catch (error) {
//       console.log(error);
//     }
//   };


//   const applyCoupon = async (coupon) => {
//     try {
//       await api.post("/carts/coupon", {
//         coupon,
//       });

//       await getCart();

//     } catch (error) {
//       console.log(error);
//     }
//   };


//   useEffect(() => {
//     getCart();
//   }, []);


//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         getCart,
//         updateQuantity,
//         removeItem,
//         applyCoupon,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };


// export const useCart = () => useContext(CartContext);



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

  // Helper function to calculate totals locally
  const calcTotals = (items, discountAmount = 0) => {
    let itemCount = 0;
    let subtotal = 0;
    items.forEach((item) => {
      const price = item.price || item.product?.price || 0;
      itemCount += item.quantity;
      subtotal += price * item.quantity;
    });
    const total = subtotal - (discountAmount || 0);
    return { itemCount, subtotal, total };
  };

  const getCart = async () => {
    try {
      const res = await api.get("/carts");
      const cartData = res.data;
      
      // Safety check to prevent the cart from clearing if backend sends bad data
      if (cartData && Array.isArray(cartData.items)) {
        const totals = calcTotals(cartData.items, cartData.discountAmount || 0);
        setCart({ ...cartData, ...totals });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Add to Cart
  const addToCart = async (productId, quantity) => {
    try {
      await api.post("/carts/items", { productId, quantity });
      await getCart(); 
    } catch (error) {
      console.log("Add to cart error:", error);
      throw error;
    }
  };

  // Optimistic UI for updating quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    // 1. Save the current state in case we need to revert
    const prevCart = cart;

    // 2. Update UI and Totals instantly
    setCart((prev) => {
      const items = prev.items.map((it) => {
        const pId = it.product?._id || it.product || it.productId || it._id || it.id;
        return pId === productId ? { ...it, quantity } : it;
      });
      const totals = calcTotals(items, prev.discountAmount);
      return { ...prev, items, ...totals };
    });

    try {
      // 3. Send request to backend
      await api.patch("/carts/items", { productId, quantity });
      // We DO NOT call getCart() here. This prevents the "page reload" effect.
    } catch (error) {
      console.log("Update failed, reverting locally", error);
      // 4. If it fails, revert to the saved state WITHOUT reloading the whole cart
      setCart(prevCart);
    }
  };

  // Optimistic UI for removing item
  const removeItem = async (productId) => {
    // 1. Save the current state
    const prevCart = cart;

    // 2. Remove from UI and recalculate totals instantly
    setCart((prev) => {
      const items = prev.items.filter((it) => {
        const pId = it.product?._id || it.product || it.productId || it._id || it.id;
        return pId !== productId;
      });
      const totals = calcTotals(items, prev.discountAmount);
      return { ...prev, items, ...totals };
    });

    try {
      // 3. Send delete request
      await api.delete(`/carts/items/${productId}`);
    } catch (error) {
      console.log("Remove failed, reverting locally", error);
      // 4. Revert locally if failed
      setCart(prevCart);
    }
  };

  const applyCoupon = async (coupon) => {
    try {
      await api.post("/carts/coupon", { coupon });
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
      value={{ cart, getCart, addToCart, updateQuantity, removeItem, applyCoupon }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);