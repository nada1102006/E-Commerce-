import { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { FiSun, FiMoon, FiSearch, FiX, FiMenu, FiHeart, FiShoppingCart } from "react-icons/fi";

export default function Header() {
  const [openSearch, setOpenSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const searchWrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Autofocus the input the moment the search bar finishes expanding.
  useEffect(() => {
    if (openSearch) searchInputRef.current?.focus();
  }, [openSearch]);


  useEffect(() => {
    function handleClickOutside(e) {
      if (openSearch && !searchWrapperRef.current?.contains(e.target)) {
        setOpenSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openSearch]);

  const links = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Orders", path: "/orders" },
    { name: "Wishlist", path: "/wishlist" },
  ];

  return (
    <header className="fixed top-3 md:top-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl bg-[#070B1A]/95 backdrop-blur-lg rounded-2xl lg:rounded-full shadow-2xl border border-white/10">

      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">

        {/* Logo */}
        <div className="flex items-center gap-3">

          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg">
            <FiShoppingCart />
          </div>

          <div>
            <h2 className="text-white font-bold text-lg md:text-xl">
              ShopWise
            </h2>

            <p className="hidden sm:block text-gray-400 text-xs md:text-sm">
              Premium Shopping
            </p>
          </div>

        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">

          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `
                relative pb-2 text-lg font-medium transition-all duration-300
                ${isActive
                  ? "text-indigo-500"
                  : "text-white hover:text-indigo-500"
                }

                after:absolute
                after:left-0
                after:-bottom-1
                after:h-[3px]
                after:w-full
                after:bg-indigo-500
                after:rounded-full
                after:transition-transform
                after:duration-300
                after:ease-in-out
                after:origin-left
                ${isActive
                  ? "after:scale-x-100"
                  : "after:scale-x-0 hover:after:scale-x-100"
                }
                `
              }
            >
              {link.name}
            </NavLink>
          ))}

        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2 md:gap-3">


          <div
            ref={searchWrapperRef}
            className={`
              flex items-center h-10 md:h-11 rounded-full bg-[#111827]
              transition-[width] duration-300 ease-in-out overflow-hidden shrink-0
              ${openSearch ? "w-[200px] sm:w-[280px] px-3" : "w-10 md:w-11"}
            `}
          >
            <button
              type="button"
              onClick={() => setOpenSearch((v) => !v)}
              aria-label={openSearch ? "Close search" : "Open search"}
              className="flex items-center justify-center cursor-pointer w-10 h-10 md:w-11 md:h-11  shrink-0 text-white hover:text-indigo-500 transition-colors"
            >
              <FiSearch />
            </button>

         <input
  ref={searchInputRef}
  type="text"
  placeholder="Search..."
  style={{ outline: "none", outlineColor: "#111827", boxShadow: "none" }}
  className={`
             bg-transparent
             
             border-0
             outline-none
             ring-0
             focus:border-0
             focus:outline-none
             focus:ring-0
             focus:ring-transparent
             focus-visible:outline-none
             focus-visible:ring-0
             shadow-none
             focus:shadow-none text-white placeholder:text-gray-400 min-w-0
             transition-opacity duration-200 ease-in-out
             ${openSearch ? "opacity-100 w-full ml-1 delay-150" : "opacity-0 w-0 pointer-events-none"}
           `}
/>

            <button
              type="button"
              onClick={() => setOpenSearch(false)}
              aria-label="Clear search"
              className={`
                shrink-0 text-white hover:text-red-400 transition-opacity duration-150
                ${openSearch ? "opacity-100" : "opacity-0 pointer-events-none"}
              `}
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Dark Mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-10 h-10 cursor-pointer md:w-11 md:h-11 rounded-full bg-[#111827] text-white flex items-center justify-center hover:bg-[#1f2937] hover:text-indigo-500 transition"
          >
            {darkMode ? <FiMoon  /> : <FiSun />}
          </button>

          {/* Wishlist */}
          <Link to="/wishlist"
            className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#111827] text-white flex items-center justify-center hover:bg-[#1f2937] hover:text-pink-500 transition">
            <FiHeart />
          </Link>

          {/* Cart */}
          <Link to="/cart"
            className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#111827] text-white flex items-center justify-center hover:bg-[#1f2937] hover:text-indigo-500 transition">
            <FiShoppingCart />
          </Link>

          {/* Login */}
          <Link to="/login"
            className="hidden lg:block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-semibold transition duration-300 shadow-lg">
            Login
          </Link>

          {/* Mobile Menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#111827] text-white flex items-center justify-center hover:bg-[#1f2937] transition"
          >
            <FiMenu size={22} />
          </button>

        </div>

      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${menuOpen
          ? "max-h-[500px] opacity-100 py-4"
          : "max-h-0 opacity-0 py-0"
          }`}
      >
        <div className="px-5 border-t border-gray-700">

          <nav className="flex flex-col gap-3 mt-4">

            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-base font-medium transition-all duration-300 ${isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:bg-[#111827] hover:text-indigo-400"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

          </nav>

          <Link
            to="/Login"
            className="w-full mt-5 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
          >
            Login
          </Link>

        </div>
      </div>

    </header>
  );
}
