import { Link } from "react-router-dom";
import logo from "../../assets/logos/novacart-main-logo.png";
import { FiChevronDown, FiPackage } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { FiHeart, FiShoppingCart, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

import SearchBar from "./SearchBar";

const Navbar = () => {
  const { token, user, logout } = useAuth();
  const { cartCount } = useCart();
  const isLoggedIn = !!token;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-[1800px] mx-auto px-4 lg:px-10 xl:px-12">
        {/* Top Navbar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="NovaCart" className="h-8 lg:h-10" />
          </Link>

          {/* Search Bar */}
          <div className="hidden lg:block w-[900px] px-10">
            <SearchBar />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link
              to="/wishlist"
              className="flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-2 text-sm lg:text-lg"
            >
              <FiHeart className="text-xl md:text-2xl" />
              Wishlist
            </Link>

            <Link
              to="/cart"
              className="flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-2 text-sm lg:text-lg"
            >
              <div className="relative">
                <ShoppingCart className="text-xl md:text-2xl" />

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              Cart
            </Link>

            <Link
              to="/orders"
              className="flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-2 text-sm lg:text-lg"
            >
              <FiPackage className="text-xl md:text-2xl" />
              Orders
            </Link>

            <Link
              to={token ? "/profile" : "/login"}
              className="hidden lg:flex items-center gap-2 text-lg"
            >
              <FiUser className="text-2xl" />
              {token ? "Profile" : "Login"}
            </Link>
          </div>
        </div>
        {/* Mobile Search */}
        <div className="lg:hidden w-full pt-2 pb-4">
          <SearchBar />
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block border-t border-gray-100">
        <div className="max-w-[1800px] mx-auto px-8 lg:px-10 xl:px-12">
          <nav className="flex items-center gap-10 h-16">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `h-16 flex items-center border-b-2 transition ${
                  isActive
                    ? "border-[#6D4AFF] text-[#6D4AFF] font-semibold"
                    : "border-transparent text-gray-700 hover:text-[#6D4AFF] hover:border-[#6D4AFF] duration-200"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `h-16 flex items-center border-b-2 transition ${
                  isActive
                    ? "border-[#6D4AFF] text-[#6D4AFF] font-semibold"
                    : "border-transparent text-gray-700 hover:text-[#6D4AFF] hover:border-[#6D4AFF] duration-200"
                }`
              }
            >
              Shop
            </NavLink>

            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `h-16 flex items-center gap-1 border-b-2 transition ${
                  isActive
                    ? "border-[#6D4AFF] text-[#6D4AFF] font-semibold"
                    : "border-transparent text-gray-700 hover:text-[#6D4AFF] hover:border-[#6D4AFF] duration-200"
                }`
              }
            >
              Categories
              <FiChevronDown />
            </NavLink>

            <NavLink
              to="/deals"
              className={({ isActive }) =>
                `h-16 flex items-center border-b-2 transition ${
                  isActive
                    ? "border-[#6D4AFF] text-[#6D4AFF] font-semibold"
                    : "border-transparent text-gray-700 hover:text-[#6D4AFF] hover:border-[#6D4AFF] duration-200"
                }`
              }
            >
              Deals
            </NavLink>

            <NavLink
              to="/new-arrivals"
              className={({ isActive }) =>
                `h-16 flex items-center border-b-2 transition ${
                  isActive
                    ? "border-[#6D4AFF] text-[#6D4AFF] font-semibold"
                    : "border-transparent text-gray-700 hover:text-[#6D4AFF] hover:border-[#6D4AFF] duration-200"
                }`
              }
            >
              New Arrival
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `h-16 flex items-center border-b-2 transition ${
                  isActive
                    ? "border-[#6D4AFF] text-[#6D4AFF] font-semibold"
                    : "border-transparent text-gray-700 hover:text-[#6D4AFF] hover:border-[#6D4AFF] duration-200"
                }`
              }
            >
              Contact Us
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
