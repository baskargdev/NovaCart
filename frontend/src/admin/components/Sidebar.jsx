import { NavLink, useNavigate } from "react-router-dom";

import {
  FiHome,
  FiBox,
  FiPlusSquare,
  FiShoppingCart,
  FiUsers,
  FiMail,
  FiLogOut,
  FiX,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: FiHome,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: FiBox,
    },
    {
      name: "Add Product",
      path: "/admin/add-product",
      icon: FiPlusSquare,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: FiShoppingCart,
    },
    {
      name: "Messages",
      path: "/admin/messages",
      icon: FiMail,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: FiUsers,
    },
  ];

  // Close sidebar when navigating on mobile
  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className={`
          fixed inset-0 z-40 bg-black/50
          lg:hidden
          transition-opacity duration-300
          ${
            isOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }
        `}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          w-[270px] max-w-[82vw]
          h-screen
          bg-gradient-to-b from-[#0B1035] via-[#0D1240] to-[#11154A]
          text-white
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="relative h-full flex flex-col overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute bottom-[-180px] left-[-150px] w-[450px] h-[450px] rounded-full bg-purple-700/20 blur-3xl pointer-events-none" />

          {/* Logo */}
          <div className="relative h-[108px] px-7 flex items-center border-b border-white/10">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#4F20E8] flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">N</span>
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  Nova<span className="text-[#7C3AED]">Cart</span>
                </h1>

                <p className="text-sm text-gray-300">Admin Panel</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="ml-auto lg:hidden text-white hover:text-purple-300 cursor-pointer"
              aria-label="Close sidebar"
            >
              <FiX size={30} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="relative flex-1 px-4 pt-5 overflow-y-auto">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/admin"}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `
                      relative
                      flex items-center gap-4
                      px-5 py-4
                      rounded-xl
                      font-semibold
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-gradient-to-r from-[#4520C7] to-[#3920A8] text-white shadow-lg"
                          : "text-gray-200 hover:bg-white/5 hover:text-white"
                      }
                      `
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active Indicator */}
                        {isActive && (
                          <span className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-[#8B5CF6]" />
                        )}

                        <Icon size={25} strokeWidth={isActive ? 2.3 : 1.8} />

                        <span>{item.name}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="relative px-4 pb-7 pt-5">
            <div className="border-t border-white/10 mb-5" />

            <button
              type="button"
              onClick={handleLogout}
              className="
                w-full
                flex items-center gap-4
                px-5 py-4
                rounded-xl
                border border-white/10
                text-white
                font-semibold
                hover:bg-red-500/10
                hover:border-red-500/30
                hover:text-red-400
                transition
                cursor-pointer
              "
            >
              <FiLogOut size={24} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
