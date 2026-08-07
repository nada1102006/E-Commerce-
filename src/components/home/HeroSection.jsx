import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiTruck,
  FiAward,
  FiHeadphones,
} from "react-icons/fi";

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
      <section
        className="
        relative
        pt-6
        sm:pt-8
        lg:pt-10
        pb-6
        lg:pb-8
        w-full
        flex
        items-center
        justify-center
        bg-gradient-to-r
        from-indigo-50
        via-white
        to-purple-50
        dark:from-black
        dark:via-gray-900
        dark:to-indigo-950
        animate-gradient
      "
      >
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-indigo-400/30 blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] rounded-full bg-pink-400/30 blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-[180px] sm:w-[300px] h-[180px] sm:h-[300px] rounded-full bg-cyan-400/30 blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 xl:gap-14 w-full">
            {/* Left Content Column */}
            <div className="w-full lg:w-1/2 text-center lg:text-left dark:text-white">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
                Shop the future,
                <br />
                delivered today
              </h1>

              <p className="mt-2.5 sm:mt-4 text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Discover premium products at unbeatable prices.
              </p>

              <div className="flex flex-col min-[380px]:flex-row items-center justify-center lg:justify-start gap-3 mt-4 sm:mt-5 w-full">
                <Link to="/shop" className="w-full min-[380px]:w-auto">
                  <button className="w-full min-[380px]:w-[170px] h-11 sm:h-12 group flex items-center justify-center gap-2 rounded-full border-2 border-indigo-600 bg-indigo-600 hover:bg-indigo-700 hover:border-indigo-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-indigo-500/25 active:scale-95">
                    <span>Shop Now</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
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
                  className="w-full min-[380px]:w-[170px] h-11 sm:h-12 inline-flex items-center justify-center rounded-full border-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white font-semibold text-xs sm:text-sm transition-all active:scale-95 text-center"
                >
                  View Categories
                </a>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3.5 sm:gap-5 mt-5 sm:mt-7 text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
                <div className="flex items-center gap-1.5 hover:text-indigo-600 transition">
                  <FiTruck size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Free Shipping</span>
                </div>

                <div className="flex items-center gap-1.5 hover:text-indigo-600 transition">
                  <FiAward size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Quality Guarantee</span>
                </div>

                <div className="flex items-center gap-1.5 hover:text-indigo-600 transition">
                  <FiHeadphones size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Right Showcase Column */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative flex flex-col items-center w-full max-w-[340px]">
                <span className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-indigo-600 text-white px-3 py-1 rounded-full shadow-md text-xs font-semibold z-10">
                  {products[current].badge}
                </span>

                <div
                  className="
                  relative
                  mt-2 sm:mt-3
                  w-[190px]
                  h-[190px]
                  sm:w-[240px]
                  sm:h-[240px]
                  md:w-[280px]
                  md:h-[280px]
                  lg:w-[310px]
                  lg:h-[310px]
                  rounded-full
                  flex
                  items-center
                  justify-center
                  p-3
                  bg-gradient-to-br from-white/90 via-indigo-50/50 to-purple-100/50 dark:from-slate-900/90 dark:via-slate-800/80 dark:to-indigo-950/70
                  border border-white/80 dark:border-slate-700/60
                  shadow-2xl shadow-indigo-500/25 dark:shadow-indigo-950/80
                "
                >
                  <img
                    src={products[current].image}
                    alt={products[current].name}
                    className="
                    w-3/4
                    h-3/4
                    object-contain
                    transition-all
                    duration-700
                    hover:scale-105
                    drop-shadow-2xl
                  "
                  />
                </div>

                <h2 className="mt-2 sm:mt-3 text-lg sm:text-xl lg:text-2xl font-bold text-center text-gray-800 dark:text-white line-clamp-1">
                  {products[current].name}
                </h2>

                <div className="flex items-center gap-2.5 mt-1">
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {products[current].price}
                  </span>

                  <del className="text-xs sm:text-sm text-gray-400 font-medium">
                    {products[current].oldPrice}
                  </del>
                </div>

                <div className="flex gap-2 mt-2 pb-1">
                  {products.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrent(index)}
                      aria-label={`Slide ${index + 1}`}
                      className={`transition-all duration-300 rounded-full ${
                        current === index
                          ? "w-6 h-2.5 bg-indigo-600"
                          : "w-2.5 h-2.5 bg-gray-300 dark:bg-gray-700 hover:bg-indigo-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}