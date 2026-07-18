import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../../pages/Header";
import Footer from "../../pages/Footr";
import {FiShoppingCart,FiTruck,FiAward,FiHeadphones,} from "react-icons/fi";

import phone from "../../imges/phone.jfif";
import watch from "../../imges/watch.jfif";
import airpods from "../../imges/airpods.jfif";
import phoneCase from "../../imges/case.jfif";

export default function HeroSection() {
  const products = [
    {
      id: 1,
      name: "iPhone 16 Pro Max",
      price: "$999",
      oldPrice: "$1099",
      image: phone,
      badge: "Best Seller",
    },
    {
      id: 2,
      name: "Apple Watch Ultra 2",
      price: "$799",
      oldPrice: "$899",
      image: watch,
      badge: "New",
    },
    {
      id: 3,
      name: "AirPods Pro",
      price: "$249",
      oldPrice: "$299",
      image: airpods,
      badge: "Hot",
    },
    {
      id: 4,
      name: "Phone Case",
      price: "$49",
      oldPrice: "$69",
      image: phoneCase,
      badge: "Sale",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
     

      <section className="min-h-screen bg-gray-100 dark:bg-black flex flex-col lg:flex-row items-center justify-between px-10 py-20">

        {/* Left */}

        <div className=" dark:text-white lg:w-1/2">

          <h1 className="text-6xl font-bold">
            Shop the future,
            <br />
            delivered today
          </h1>

          <p className="mt-6 text-xl">
            Discover premium products at unbeatable prices.
          </p>

          <div className="flex flex-wrap gap-8 mt-6">

            <Link to="/shop">
              <button className="group relative flex items-center gap-2 border-2 border-indigo-500 rounded-full px-6 py-3 text-indigo-500 hover:text-white hover:bg-indigo-500 transition-all duration-300">

                <span
                  className="relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-white after:scale-x-0 after:transition-all group-hover:after:scale-x-100"
                >
                  Shop Now
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={4}
                  className="w-4 h-4 group-hover:translate-x-1 transition"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>

              </button>
            </Link>
            <a
              href="#categories"
              className="group relative flex items-center gap-2 border-2 border-indigo-500 rounded-full px-6 py-3 text-white-500 bg-indigo-500 hover:text-black hover:bg-indigo-500 transition-all duration-300"
            >
              View Categories
            </a>

          </div>

          <div className="flex flex-wrap gap-8 mt-12  text-gray-600 dark:text-gray-300">

            <div className="flex items-center gap-2 hover:text-indigo-500">
              <FiTruck />
              <span>Free Shipping</span>
            </div>

            <div className="flex items-center gap-2 hover:text-indigo-500">
              <FiAward />
              <span>Quality Guarantee</span>
            </div>

            <div className="flex items-center gap-2 hover:text-indigo-500">
              <FiHeadphones />
              <span>24/7 Support</span>
            </div>

          </div>

        </div>
        {/* Right */}

        <div className="lg:w-1/2 flex justify-center mt-16 lg:mt-0">

          <div className="relative flex flex-col items-center">

            {/* Badge */}

            <span className="absolute top-5 left-5 bg-indigo-600 text-white px-5 py-2 rounded-full shadow-lg text-sm font-semibold z-10">

              {products[current].badge}

            </span>


            <div className="w-[430px] h-[430px] rounded-full bg-gradient-to-br from-indigo-100 via-purple-50 to-white shadow-2xl flex items-center justify-center">

              <img
                src={products[current].image}
                alt={products[current].name}
                className="w-[280px] h-[280px] object-contain transition-all duration-700 hover:scale-105"
              />

            </div>

            {/* اسم المنتج */}

            <h2 className="mt-8 text-3xl font-bold text-gray-800 dark:text-white">

              {products[current].name}

            </h2>

            {/* السعر */}

            <div className="flex items-center gap-4 mt-3">

              <span className="text-4xl font-bold text-indigo-600">

                {products[current].price}

              </span>

              <del className="text-xl text-gray-400">

                {products[current].oldPrice}

              </del>

            </div>

            {/* النقط */}

            <div className="flex gap-3 mt-8">

              {products.map((_, index) => (

                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${current === index
                    ? "bg-indigo-600 w-8"
                    : "bg-gray-300"
                    }`}
                />

              ))}

            </div>

          </div>

        </div>




      </section>

{/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
      

       

      
     

    </>
  );
}