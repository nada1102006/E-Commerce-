import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
 const { cart, updateQuantity, removeItem, applyCoupon } = useCart();
  const [coupon, setCoupon] = useState("");
 
  if (!cart?.items || cart.items.length === 0) {
  return (
    <div className="flex justify-center items-center h-screen">
      <h2 className="text-2xl font-bold">
        Your Cart is Empty
      </h2>
    </div>
  );
}
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">
        Shopping Cart
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {cart.items.map((item)=> (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow p-5 mb-4 flex gap-5 items-center"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-28 h-28 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">
                  {item.name}
                </h2>
                <p className="text-gray-500 mt-2">
                  ${item.price}
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product,
                        item.quantity - 1
                      )
                    }
                    className="w-8 h-8 border rounded"
                  >
                    -
                  </button>
                  <span className="font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product,
                        item.quantity + 1
                      )
                    }
                    className="w-8 h-8 border rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() =>
                      removeItem(item.product)
                    }
                    className="ml-4 text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="font-bold text-lg">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
          <div className="bg-white rounded-xl shadow p-5 mt-5">
            <h3 className="font-bold text-lg mb-3">
              Discount Code
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e)=>setCoupon(e.target.value)}
                className="border rounded-lg p-3 flex-1"
              />
              <button
              onClick={() => applyCoupon(coupon)}
                className="bg-black text-white px-6 rounded-lg"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 h-fit">
          <h2 className="text-2xl font-bold mb-5">
            Order Summary
          </h2>
          <div className="flex justify-between mb-3">
            <span>Items</span>
            <span>{cart.itemCount}</span>
          </div>
          <div className="flex justify-between mb-3">
            <span>Subtotal</span>
            <span>
              ${cart.subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between mb-3 text-red-500">
            <span>Discount</span>
            <span>
              -${cart.discountAmount.toFixed(2)}
            </span>
          </div>
          <hr className="my-4"/>
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>
              ${cart.total.toFixed(2)}
            </span>
          </div>
         <Link
  to="/checkout"
  className="block w-full mt-6 bg-black text-white py-3 rounded-lg text-center hover:opacity-90"
>
  Checkout
</Link>
<Link
  to="/shop"
  className="block w-full mt-3 border border-black py-3 rounded-lg text-center hover:bg-gray-100"
>
  Continue Shopping
</Link>
        </div>
      </div>
    </div>

  );
};
export default Cart;