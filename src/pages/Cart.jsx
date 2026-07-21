import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import api from "../api/api";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    discountAmount: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const getCart = async () => {
    try {
      const res = await api.get("/carts");
      console.log(res.data);
      setCart(res.data);

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCart();
  }, []);
  const removeItem = (id) => {

    setCart((prev) => ({
      ...prev,
      items: prev.items.filter(
        (item) => item._id !== id
      ),
    }));

  };

  if (loading) {
    return <h2>Loading...</h2>;
  }
  return (
    <div className="cart-page">
      <h1>Cart</h1>

      {
        cart?.items?.length === 0 ? (

          <div className="empty-cart">

            <h2>Your Cart is Empty</h2>

            <p>
              Add some products to see them here
            </p>

          </div>

        ) : (
          <div className="cart-layout">
    <div className="cart-left">
<div className="cart-products">
 {
 cart.items.map((item)=>(
     <div 
       className="cart-item"
      key={item._id}
    >
      <img
     src={item.product.image}
     alt={item.product.name}
     />
     <div>

     <h3>
      {item.product.name}
    </h3>
        <p>
        ${item.product.price}
         </p>
        <p>
         Quantity: {item.quantity}
        </p>
         </div>
        <button
        onClick={() => removeItem(item._id)}
         >
        <FaTrash />

     </button>
    </div>
     ))
    }
              </div>
              <div className="coupon-box">
                <h3>
                  Coupon Code
                </h3>
                <div className="coupon-input">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                  />
                  <button>
                    Apply
                  </button>
                </div>
              </div>
            </div>
            <div className="cart-summary">
              <h2>
                Summary
              </h2>
              <p>
                Subtotal: ${cart.subtotal}
              </p>
              <p>
                Discount: ${cart.discountAmount}
              </p>
              <h3>
                Total: ${cart.total}
              </h3>

              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed To Checkout
              </button>
              <button
                className="shopping-btn"
                onClick={() => navigate("/Shop")}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )
      }
    </div>
  );
}