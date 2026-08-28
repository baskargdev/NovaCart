import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const ORDERS_PER_PAGE = 12;

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.get(
        `/admin/orders?page=${page}&limit=${ORDERS_PER_PAGE}`,
      );

      if (data.success) {
        setOrders(data.orders || []);
        setTotalOrders(data.totalOrders || 0);
        setTotalPages(data.totalPages || 0);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Update Order Status
  const updateOrderStatus = async (id, status) => {
    try {
      const { data } = await axiosInstance.put(`/admin/orders/${id}/status`, {
        orderStatus: status,
      });

      toast.success(data.message);

      // Refresh current page
      fetchOrders(currentPage);
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to update order status",
      );
    }
  };

  // Indian Rupee formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calculate showing range
  const startOrder =
    totalOrders === 0 ? 0 : (currentPage - 1) * ORDERS_PER_PAGE + 1;

  const endOrder = Math.min(currentPage * ORDERS_PER_PAGE, totalOrders);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#6D4AFF]/20 border-t-[#6D4AFF] rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-500 font-medium">Loading Orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#111936]">Orders</h1>

        <p className="text-gray-500 mt-1">Manage and track customer orders</p>
      </div>

      {/* Orders Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {totalOrders === 0 ? (
          <div className="text-center text-gray-500 py-16">No Orders Found</div>
        ) : (
          <>
            {/* Desktop / Tablet Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[900px]">
                {/* Table Header */}
                <thead>
                  <tr className="bg-[#F8F9FD] border-b border-gray-200">
                    <th className="px-5 py-4 text-left text-xs font-semibold text-[#465276] uppercase tracking-wide">
                      Order ID
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold text-[#465276] uppercase tracking-wide">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold text-[#465276] uppercase tracking-wide">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold text-[#465276] uppercase tracking-wide">
                      Payment
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold text-[#465276] uppercase tracking-wide">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold text-[#465276] uppercase tracking-wide">
                      Date
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-[#FAFAFF] transition"
                    >
                      {/* Order ID */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-[#5B3DF5]">
                          {order._id.slice(-8)}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-100 text-[#6D4AFF] flex items-center justify-center font-semibold text-sm shrink-0">
                            {(order.user?.name?.charAt(0) || "U").toUpperCase()}
                          </div>

                          <span className="text-sm font-medium text-[#1F2937]">
                            {order.user?.name || "Unknown"}
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-[#111936]">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            order.paymentStatus === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <div className="relative inline-block">
                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              updateOrderStatus(order._id, e.target.value)
                            }
                            className={`
                              appearance-none
                              min-w-[120px]
                              pl-3
                              pr-9
                              py-2
                              rounded-lg
                              border
                              text-xs
                              font-medium
                              outline-none
                              cursor-pointer
                              transition
                              focus:ring-2
                              focus:ring-purple-100

                              ${
                                order.orderStatus === "Confirmed"
                                  ? "border-green-300 bg-green-50 text-green-700"
                                  : order.orderStatus === "Cancelled"
                                    ? "border-pink-300 bg-pink-50 text-pink-600"
                                    : order.orderStatus === "Shipped"
                                      ? "border-blue-300 bg-blue-50 text-blue-700"
                                      : order.orderStatus === "Delivered"
                                        ? "border-green-300 bg-green-50 text-green-700"
                                        : "border-orange-300 bg-orange-50 text-orange-600"
                              }
                            `}
                          >
                            <option value="Pending">Pending</option>

                            <option value="Confirmed">Confirmed</option>

                            <option value="Shipped">Shipped</option>

                            <option value="Delivered">Delivered</option>

                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <ChevronDown
                            size={15}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                          />
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3">
                        {order.createdAt ? (
                          <div className="flex items-center gap-2 text-sm text-[#52607A] whitespace-nowrap">
                            <CalendarDays size={14} />

                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Information + Pagination */}
            <div className="border-t border-gray-200 px-5 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Count */}
              <p className="text-sm text-[#52607A]">
                Showing{" "}
                <span className="font-semibold text-[#1F2937]">
                  {startOrder} to {endOrder}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#1F2937]">
                  {totalOrders}
                </span>{" "}
                orders
              </p>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  {/* Previous */}
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="
                      w-9
                      h-9
                      flex
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-gray-200
                      text-gray-600
                      hover:bg-[#F7F5FF]
                      hover:text-[#6D4AFF]
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                      transition
                    "
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1,
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`
                          w-9
                          h-9
                          rounded-lg
                          text-sm
                          font-medium
                          transition
                          ${
                            currentPage === page
                              ? "bg-[#6D4AFF] text-white"
                              : "text-gray-600 hover:bg-[#F7F5FF] hover:text-[#6D4AFF]"
                          }
                        `}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Next */}
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="
                      w-9
                      h-9
                      flex
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-gray-200
                      text-gray-600
                      hover:bg-[#F7F5FF]
                      hover:text-[#6D4AFF]
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                      transition
                    "
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;
