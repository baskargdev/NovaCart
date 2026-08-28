import {
  FiBox,
  FiShoppingCart,
  FiUsers,
  FiArrowUp,
  FiCalendar,
  FiEye,
} from "react-icons/fi";

import { RiMoneyRupeeCircleLine } from "react-icons/ri";

import { useEffect, useState } from "react";

import axiosInstance from "../../api/axiosInstance";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);

  const fetchDashboard = async () => {
    try {
      const { data } = await axiosInstance.get("/dashboard/summary");

      setDashboard(data.dashboard);

      const productRes = await axiosInstance.get(
        "/product?sort=-createdAt&limit=5",
      );

      setLatestProducts(productRes.data.products);

      const orderRes = await axiosInstance.get("/admin/orders?limit=5");

      setRecentOrders(orderRes.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Indian Rupee formatter
  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Shipped":
        return "bg-blue-100 text-blue-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* ==================== WELCOME HEADER ==================== */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111936]">
          Welcome back, Admin! 👋
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* ==================== STAT CARDS ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white rounded-xl border border-purple-100 p-5 shadow-sm overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
                <FiBox size={22} className="text-[#6D4AFF]" strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-xs text-gray-500">Total Products</p>

                <h2 className="text-2xl font-bold text-[#111936] mt-1">
                  {dashboard.totalProducts.toLocaleString("en-IN")}
                </h2>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-5 text-xs">
            <FiArrowUp size={12} className="text-green-600" />

            <span className="font-semibold text-green-600">18.2%</span>

            <span className="text-gray-500">vs last month</span>
          </div>

          {/* Decorative chart */}
          <div className="mt-3 h-10">
            <svg
              viewBox="0 0 180 45"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6D4AFF" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#6D4AFF" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path
                d="M0 38 L18 32 L35 35 L52 23 L68 29 L85 18 L101 25 L118 11 L135 17 L152 4 L166 13 L180 2 L180 45 L0 45 Z"
                fill="url(#purpleGradient)"
              />

              <path
                d="M0 38 L18 32 L35 35 L52 23 L68 29 L85 18 L101 25 L118 11 L135 17 L152 4 L166 13 L180 2"
                fill="none"
                stroke="#6D4AFF"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl border border-blue-100 p-5 shadow-sm overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                <FiShoppingCart
                  size={22}
                  className="text-blue-600"
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p className="text-xs text-gray-500">Total Orders</p>

                <h2 className="text-2xl font-bold text-[#111936] mt-1">
                  {dashboard.totalOrders.toLocaleString("en-IN")}
                </h2>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-5 text-xs">
            <FiArrowUp size={12} className="text-green-600" />

            <span className="font-semibold text-green-600">12.5%</span>

            <span className="text-gray-500">vs last month</span>
          </div>

          <div className="mt-3 h-10">
            <svg
              viewBox="0 0 180 45"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path
                d="M0 38 L20 34 L38 35 L55 25 L72 29 L90 27 L108 16 L125 23 L143 11 L161 4 L180 12 L180 45 L0 45 Z"
                fill="url(#blueGradient)"
              />

              <path
                d="M0 38 L20 34 L38 35 L55 25 L72 29 L90 27 L108 16 L125 23 L143 11 L161 4 L180 12"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-xl border border-green-100 p-5 shadow-sm overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                <FiUsers
                  size={22}
                  className="text-green-600"
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p className="text-xs text-gray-500">Total Users</p>

                <h2 className="text-2xl font-bold text-[#111936] mt-1">
                  {dashboard.totalUsers.toLocaleString("en-IN")}
                </h2>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-5 text-xs">
            <FiArrowUp size={12} className="text-green-600" />

            <span className="font-semibold text-green-600">7.1%</span>

            <span className="text-gray-500">vs last month</span>
          </div>

          <div className="mt-3 h-10">
            <svg
              viewBox="0 0 180 45"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16A34A" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#16A34A" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path
                d="M0 38 L18 31 L35 35 L52 22 L70 28 L87 17 L105 23 L122 13 L140 18 L158 5 L180 13 L180 45 L0 45 Z"
                fill="url(#greenGradient)"
              />

              <path
                d="M0 38 L18 31 L35 35 L52 22 L70 28 L87 17 L105 23 L122 13 L140 18 L158 5 L180 13"
                fill="none"
                stroke="#16A34A"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl border border-orange-100 p-5 shadow-sm overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center">
                <RiMoneyRupeeCircleLine size={24} className="text-orange-500" />
              </div>

              <div>
                <p className="text-xs text-gray-500">Total Revenue</p>

                <h2 className="text-2xl font-bold text-[#111936] mt-1">
                  {formatCurrency(dashboard.totalRevenue)}
                </h2>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-5 text-xs">
            <FiArrowUp size={12} className="text-green-600" />

            <span className="font-semibold text-green-600">24.6%</span>

            <span className="text-gray-500">vs last month</span>
          </div>

          <div className="mt-3 h-10">
            <svg
              viewBox="0 0 180 45"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F97316" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path
                d="M0 39 L18 35 L35 26 L52 30 L69 20 L87 27 L105 17 L123 20 L140 7 L158 16 L180 4 L180 45 L0 45 Z"
                fill="url(#orangeGradient)"
              />

              <path
                d="M0 39 L18 35 L35 26 L52 30 L69 20 L87 27 L105 17 L123 20 L140 7 L158 16 L180 4"
                fill="none"
                stroke="#F97316"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ==================== CHART SECTION ==================== */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Sales Overview */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-[#111936]">
                Sales Overview
              </h2>
            </div>

            <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600">
              This Week
              <span>⌄</span>
            </button>
          </div>

          <div className="relative h-48">
            {/* Horizontal grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              <div className="border-t border-gray-100" />
              <div className="border-t border-gray-100" />
              <div className="border-t border-gray-100" />
              <div className="border-t border-gray-100" />
              <div className="border-t border-gray-100" />
            </div>

            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-gray-400">
              <span>₹1.6L</span>
              <span>₹1.2L</span>
              <span>₹80K</span>
              <span>₹40K</span>
              <span>₹0</span>
            </div>

            <div className="absolute left-8 right-0 top-0 bottom-0">
              <svg
                viewBox="0 0 600 190"
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="salesArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6D4AFF" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#6D4AFF" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path
                  d="M0 145 L100 112 L200 142 L300 105 L400 35 L500 125 L600 82 L600 190 L0 190 Z"
                  fill="url(#salesArea)"
                />

                <path
                  d="M0 145 L100 112 L200 142 L300 105 L400 35 L500 125 L600 82"
                  fill="none"
                  stroke="#6D4AFF"
                  strokeWidth="3"
                />

                {[
                  [0, 145],
                  [100, 112],
                  [200, 142],
                  [300, 105],
                  [400, 35],
                  [500, 125],
                  [600, 82],
                ].map(([cx, cy], index) => (
                  <circle key={index} cx={cx} cy={cy} r="4" fill="#6D4AFF" />
                ))}
              </svg>
            </div>
          </div>

          <div className="ml-8 flex justify-between text-[9px] text-gray-400 mt-1">
            <span>17 Aug</span>
            <span>18 Aug</span>
            <span>19 Aug</span>
            <span>20 Aug</span>
            <span>21 Aug</span>
            <span>22 Aug</span>
            <span>23 Aug</span>
          </div>

          <div className="grid grid-cols-3 border-t border-gray-100 mt-4 pt-4 text-center">
            <div>
              <p className="text-[9px] text-gray-500">Total Sales</p>
              <p className="text-sm font-bold text-[#111936] mt-1">
                {formatCurrency(dashboard.totalRevenue)}
              </p>
            </div>

            <div className="border-x border-gray-100">
              <p className="text-[9px] text-gray-500">Orders</p>
              <p className="text-sm font-bold text-[#111936] mt-1">
                {dashboard.totalOrders}
              </p>
            </div>

            <div>
              <p className="text-[9px] text-gray-500">Average Order Value</p>

              <p className="text-sm font-bold text-[#111936] mt-1">
                {dashboard.totalOrders > 0
                  ? formatCurrency(
                      dashboard.totalRevenue / dashboard.totalOrders,
                    )
                  : "₹0.00"}
              </p>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-[#111936] mb-5">
            Order Status
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            {/* Donut */}
            <div className="relative w-36 h-36 shrink-0">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background:
                    "conic-gradient(#6D4AFF 0deg 90deg, #3B82F6 90deg 225deg, #4CCB8A 225deg 315deg, #F87171 315deg 360deg)",
                }}
              />

              <div className="absolute inset-[25%] rounded-full bg-white flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-[#111936]">
                  {dashboard.totalOrders}
                </span>

                <span className="text-[9px] text-gray-500">Total Orders</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-4 text-xs w-full sm:w-auto">
              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6D4AFF]" />
                  <span>Confirmed</span>
                </div>

                <span className="font-semibold">25%</span>
              </div>

              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                  <span>Pending</span>
                </div>

                <span className="font-semibold">37.5%</span>
              </div>

              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4CCB8A]" />
                  <span>Shipped</span>
                </div>

                <span className="font-semibold">25%</span>
              </div>

              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F87171]" />
                  <span>Cancelled</span>
                </div>

                <span className="font-semibold">12.5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== BOTTOM SECTION ==================== */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#111936]">Recent Orders</h2>

            <button className="text-[10px] text-[#6D4AFF] font-semibold hover:underline">
              View All
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm py-6 text-center">
              No orders yet.
            </p>
          ) : (
            <div>
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                    <FiShoppingCart size={16} className="text-[#6D4AFF]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#111936] truncate">
                      {order.user?.name || "Unknown"}
                    </p>

                    <p className="text-[10px] text-gray-400">
                      #{order._id.slice(-8)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-[#111936]">
                      {formatCurrency(order.totalAmount)}
                    </p>

                    <span
                      className={`inline-block mt-1 px-2 py-1 rounded-full text-[9px] font-medium ${getStatusStyle(
                        order.orderStatus,
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <p className="hidden sm:block text-[10px] text-gray-400 w-20 text-right">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest Products */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#111936]">
              Latest Products
            </h2>

            <button className="text-[10px] text-[#6D4AFF] font-semibold hover:underline">
              View All
            </button>
          </div>

          {latestProducts.length === 0 ? (
            <p className="text-gray-500 text-sm py-6 text-center">
              No products added yet.
            </p>
          ) : (
            <div>
              {latestProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <p className="text-xs font-medium text-[#111936] flex-1 truncate">
                    {product.name}
                  </p>

                  <p className="text-xs font-bold text-[#111936]">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
