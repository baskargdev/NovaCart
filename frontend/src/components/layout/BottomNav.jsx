import { NavLink } from "react-router-dom";

import { FiHome, FiShoppingBag, FiGrid, FiGift, FiUser } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

const BottomNav = () => {
  const { token } = useAuth();
  const isLoggedIn = !!token;

  const navClass = ({ isActive }) =>
    `flex flex-col items-center gap-1 transition ${
      isActive ? "text-[#6D4AFF]" : "text-gray-500 hover:text-[#6D4AFF]"
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.08)] lg:hidden">
      <div className="grid grid-cols-5 py-3">
        {/* Home */}
        <NavLink to="/" className={navClass}>
          <FiHome className="text-xl" />
          <span className="text-sm">Home</span>
        </NavLink>

        {/* Shop */}
        <NavLink to="/shop" className={navClass}>
          <FiShoppingBag className="text-xl" />
          <span className="text-sm">Shop</span>
        </NavLink>

        {/* Categories */}
        <NavLink to="/categories" className={navClass}>
          <FiGrid className="text-xl" />
          <span className="text-sm">Category</span>
        </NavLink>

        {/* Deals */}
        <NavLink to="/deals" className={navClass}>
          <FiGift className="text-xl" />
          <span className="text-sm">Deals</span>
        </NavLink>

        {/* Profile / Login */}
        <NavLink to={isLoggedIn ? "/profile" : "/login"} className={navClass}>
          <FiUser className="text-xl" />
          <span className="text-sm">{isLoggedIn ? "Profile" : "Login"}</span>
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNav;
