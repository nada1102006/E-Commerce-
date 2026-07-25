
import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FiSun,
  FiMoon,
  FiSearch,
  FiX,
  FiMenu,
  FiHeart,
  FiShoppingCart,
} from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { useAllProduct } from "../context/AllProductContext";
import { useCart } from "../context/CartContext";


export default function Header() {
  const [openSearch, setOpenSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const { cart } = useCart();
  const searchWrapperRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const { wishlistCount } = useAllProduct();

  // Dark Mode State with LocalStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const checkLoginStatus = () => {
    try {
      const token = localStorage.getItem("userToken") || localStorage.getItem("token");
      const isLoginString = localStorage.getItem("isLogin");
      const usernameString = localStorage.getItem("username") || localStorage.getItem("name") || localStorage.getItem("userName");

      if (token) {
        let loginStatus = true;
        let username = "";

        if (isLoginString) {
          try {
            loginStatus = JSON.parse(isLoginString);
          } catch {
            loginStatus = true;
          }
        }

        if (usernameString) {
          try {
            username = usernameString.startsWith('"') ? JSON.parse(usernameString) : usernameString;
          } catch {
            username = usernameString;
          }
        }

        setIsLogin(loginStatus && !!token);
        setName(username || "User");
      } else {
        setIsLogin(false);
        setName("");
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLogin(false);
      setName("");
    }
  };

  useEffect(() => {
    checkLoginStatus();
    const handleStorageChange = (e) => {
      if (
        e.key === "userToken" ||
        e.key === "token" ||
        e.key === "isLogin" ||
        e.key === "username" ||
        e.key === "name"
      ) {
        checkLoginStatus();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Sync Dark Mode with DOM and LocalStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

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

  const handleProfileClick = () => {
    if (isLogin) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Orders", path: "/orders" },
    { name: "Wishlist", path: "/wishlist" },
  ];

  return (
      <header className="fixed top-3 md:top-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl dark:bg-[#070B1A]/95 backdrop-blur-lg rounded-2xl lg:rounded-full shadow-2xl border border-white/10">

      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">

        {/* Logo */}

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg">

            <FiShoppingCart />

          </div>

          <div>

            <h2 className="text-black font-bold text-lg md:text-xl dark:text-white">

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

                  : "text-black hover:text-indigo-500 dark:text-white"

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

              flex items-center h-10 md:h-11 rounded-full bg-indigo-500 dark:bg-[#111827]

              transition-[width] duration-300 ease-in-out overflow-hidden shrink-0

              ${openSearch ? "w-[200px] sm:w-[280px] px-3" : "w-10 md:w-11"}

            `}

          >

            <button

              type="button"

              onClick={() => setOpenSearch((v) => !v)}

              aria-label={openSearch ? "Close search" : "Open search"}

              className="flex items-center justify-center cursor-pointer w-10 h-10 md:w-11 md:h-11  shrink-0  dark:hover:text-indigo-500 transition-colors"

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

             focus:shadow-none dark:text-white placeholder:text-gray-400 min-w-0

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

            className="w-10 h-10 cursor-pointer md:w-11 md:h-11 rounded-full bg-indigo-500 dark:bg-[#111827] text-white flex items-center justify-center dark:hover:bg-[#1f2937] dark:hover:text-indigo-500 transition"

          >

            {darkMode ? <FiMoon  /> : <FiSun />}

          </button>
          {/* Wishlist */}

          <Link to="/wishlist"

            className="relative w-10 h-10 md:w-11 md:h-11 rounded-full bg-indigo-500 dark:bg-[#111827] text-white flex items-center justify-center dark:hover:bg-[#1f2937] hover:text-pink-500 transition">

            <FiHeart />

            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}

          </Link>
          {/* Cart */}

          <Link to="/cart"

            className="relative w-10 h-10 md:w-11 md:h-11 rounded-full bg-indigo-500 dark:bg-[#111827] text-white flex items-center justify-center dark:hover:bg-[#1f2937] dark:hover:text-indigo-500 transition">

            <FiShoppingCart />

            {cart.itemCount > 0 && (
  <span
    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
  >
    {cart.itemCount}
  </span>
)}

          </Link>

          {/* Profile/Login Button - Desktop */}
          {isLogin ? (
            <button
              onClick={handleProfileClick}
              className="justify-center items-center gap-1 rounded-full dark:border border-slate-700  bg-indigo-500 dark:bg-[#111827] text-white px-4 py-2 text-slate-300 dark:text-gray-200 shadow-sm transition-colors dark:hover:bg-slate-800 dark:hover:bg-gray-800 dark:hover:text-indigo-400 hidden md:flex"
            >
              <FaRegUser className="text-sm" />
              <span className="text-md font-medium">{name || "User"}</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden lg:block bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white px-6 py-2.5 rounded-full font-semibold transition duration-300 shadow-lg"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#111827] dark:bg-gray-900 text-white dark:text-gray-200 flex items-center justify-center hover:bg-[#1f2937] dark:hover:bg-gray-800 transition"
          >
            <FiMenu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          menuOpen ? "max-h-[600px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className="px-5 border-t border-gray-700 dark:border-gray-800">
          <nav className="flex flex-col gap-3 mt-4">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-base font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 dark:text-gray-300 hover:bg-[#111827] dark:hover:bg-gray-900 hover:text-indigo-400"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Profile/Login Button */}
          {isLogin ? (
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/profile");
              }}
              className="w-full mt-5 flex items-center justify-center gap-3 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
            >
              <FaRegUser className="text-lg" />
              <span className="text-base">{name || "Profile"}</span>
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="w-full mt-5 flex items-center justify-center gap-2 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}