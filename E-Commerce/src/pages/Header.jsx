
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {  Link } from "react-router-dom";
// import {FiSun,FiMoon,FiSearch,FiX,FiMenu,FiLogIn} from "react-icons/fi";
import { FiSun, FiMoon, FiSearch, FiX, FiMenu, FiHeart, FiShoppingCart } from "react-icons/fi";

export default function Header() {
  const [openSearch, setOpenSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
            <FiShoppingCart/>
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

          <div className="relative">
            {!openSearch && (
              <button
                onClick={() => setOpenSearch(true)}
                className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#111827] flex items-center justify-center text-white hover:bg-[#1f2937] hover:text-indigo-500 transition"
              >
                <FiSearch />
              </button>
            )}

            {openSearch && (
              <div className="absolute right-0 top-0 z-50 flex items-center bg-[#111827] rounded-full px-4 py-2 w-[260px] sm:w-[320px] shadow-xl animate-in fade-in duration-300">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search..."
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-400"
                />

                <button
                  onClick={() => setOpenSearch(false)}
                  className="ml-2 text-white hover:text-red-400"
                >
                  <FiX size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Dark Mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#111827] text-white flex items-center justify-center hover:bg-[#1f2937] hover:text-indigo-500 transition"
          >
            {darkMode ? <FiMoon /> : <FiSun />}
          </button>

          {/* Wishlist */}
          <Link  to="/wishlist"
          className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#111827] text-white flex items-center justify-center hover:bg-[#1f2937] hover:text-pink-500 transition">
           <FiHeart/>
          </Link>

          {/* Cart */}
          <Link to="/cart"
          className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#111827] text-white flex items-center justify-center hover:bg-[#1f2937] hover:text-indigo-500 transition">
            <FiShoppingCart/>
          </Link>

          {/* Login */}
          <Link  to="/login"
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