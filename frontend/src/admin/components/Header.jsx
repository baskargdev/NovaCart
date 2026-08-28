import { FiMenu, FiBell, FiUser, FiSearch } from "react-icons/fi";

const Header = ({ setIsSidebarOpen }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 lg:sticky lg:top-0">
      <div className="h-[90px] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Hamburger - Mobile Only */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="
              lg:hidden
              flex items-center justify-center
              w-10 h-10
              text-[#111936]
              hover:bg-gray-100
              rounded-lg
              cursor-pointer
            "
            aria-label="Open sidebar"
          >
            <FiMenu size={28} />
          </button>

          {/* Mobile Logo */}
          <div className="lg:hidden">
            <h1 className="text-2xl font-bold text-[#111936]">
              Nova<span className="text-[#6D4AFF]">Cart</span>
            </h1>

            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>

          {/* Desktop Page Title */}
          <h1 className="hidden lg:block text-2xl font-bold text-[#111936]">
            Dashboard
          </h1>
        </div>

        {/* Desktop Search */}
        <div className="hidden lg:flex flex-1 max-w-[380px] mx-8">
          <div className="relative w-full">
            <FiSearch
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search..."
              className="
                w-full
                h-12
                pl-11 pr-4
                rounded-xl
                border border-gray-200
                bg-white
                outline-none
                text-gray-700
                placeholder:text-gray-400
                focus:border-[#6D4AFF]
                focus:ring-2
                focus:ring-purple-100
                transition
              "
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Notification */}
          <button
            type="button"
            className="
              relative
              flex items-center justify-center
              w-11 h-11
              rounded-full
              hover:bg-gray-100
              text-[#111936]
              cursor-pointer
              transition
            "
            aria-label="Notifications"
          >
            <FiBell size={24} strokeWidth={1.8} />

            {/* Notification Dot */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Profile */}
          <button
            type="button"
            className="
              flex items-center justify-center
              w-11 h-11
              rounded-full
              hover:bg-gray-100
              text-[#111936]
              cursor-pointer
              transition
            "
            aria-label="Profile"
          >
            <FiUser size={25} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
