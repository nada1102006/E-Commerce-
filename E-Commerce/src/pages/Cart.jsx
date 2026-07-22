import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, updateQuantity, removeItem, applyCoupon } = useCart();
  const [coupon, setCoupon] = useState("");

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-slate-950">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Your Cart is Empty
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen p-6 transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Cart Items & Coupon */}
        <div className="lg:col-span-2">
          {cart.items.map((item) => {
            // SAFELY EXTRACT PRODUCT ID for your CartContext
            const productId = item.product?._id || item.product || item.id || item._id;

            return (
              <div
                key={item._id || item.id || productId}
                className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5 mb-4 flex gap-5 items-center transition-colors duration-300"
              >
                <img
                  src={item.image || item.product?.image}
                  alt={item.name || item.product?.name}
                  className="w-28 h-28 object-cover rounded-lg bg-gray-100 dark:bg-slate-800"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {item.name || item.product?.name}
                  </h2>
                  <p className="text-gray-500 dark:text-slate-400 mt-2">
                    ${item.price || item.product?.price}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-4">
                    {/* Decrement Button */}
                    <button
                      onClick={() => item.quantity > 1 && updateQuantity(productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="font-semibold text-lg w-8 text-center">
                      {item.quantity}
                    </span>
                    {/* Increment Button */}
                    <button
                      onClick={() => updateQuantity(productId, item.quantity + 1)}
                      className="w-8 h-8 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                    >
                      +
                    </button>
                    
                    <button
                      onClick={() => removeItem(productId)}
                      className="ml-4 text-red-500 dark:text-red-400 hover:underline text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                <div className="font-bold text-lg text-slate-900 dark:text-white">
                  ${((item.price || item.product?.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            );
          })}

          {/* Coupon Box */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5 mt-5 transition-colors duration-300">
            <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">
              Discount Code
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <button
                onClick={() => applyCoupon(coupon)}
                className="bg-black dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 text-white px-6 rounded-lg font-semibold transition-colors hover:opacity-90"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 h-fit transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-5 text-slate-900 dark:text-white">
            Order Summary
          </h2>
          
          <div className="flex justify-between mb-3 text-slate-600 dark:text-slate-300">
            <span>Items</span>
            <span>{cart.itemCount}</span>
          </div>
          <div className="flex justify-between mb-3 text-slate-600 dark:text-slate-300">
            <span>Subtotal</span>
            <span>${cart.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-3 text-red-500 dark:text-red-400">
            <span>Discount</span>
            <span>-${cart.discountAmount.toFixed(2)}</span>
          </div>
          
          <hr className="my-4 border-gray-200 dark:border-slate-800" />
          
          <div className="flex justify-between text-xl font-bold text-slate-900 dark:text-white">
            <span>Total</span>
            <span>${cart.total.toFixed(2)}</span>
          </div>

          <Link
            to="/checkout"
            className="block w-full mt-6 bg-black dark:bg-cyan-500 dark:text-slate-950 text-white py-3 rounded-lg text-center font-semibold hover:opacity-90 transition-opacity"
          >
            Checkout
          </Link>
          <Link
            to="/shop"
            className="block w-full mt-3 border border-black dark:border-slate-600 text-black dark:text-slate-200 py-3 rounded-lg text-center font-medium hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default Cart;