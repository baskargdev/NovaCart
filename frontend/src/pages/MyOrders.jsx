import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import OrderCard from "../components/orders/OrderCard";
import { ClipboardList } from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get("/orders");

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-xl font-semibold">Loading Orders...</h2>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 text-center">
        <h1 className="text-3xl font-bold text-[#6D4AFF]">No Orders Yet</h1>

        <p className="text-gray-500 mt-3">
          Looks like you haven't placed any orders.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex items-center gap-4 mb-8 sm:mb-10">
        {/* Icon */}
        <div
          className="
            w-16
            h-16
            sm:w-[72px]
            sm:h-[72px]
            rounded-2xl
            bg-[#F0ECFF]
            flex
            items-center
            justify-center
            shrink-0
          "
        >
          <ClipboardList
            size={34}
            className="text-[#6D4AFF]"
            strokeWidth={1.8}
          />
        </div>

        <div>
          <h1
            className="
              text-3xl
              sm:text-4xl
              font-bold
              text-[#111827]
            "
          >
            My Orders
          </h1>

          <p
            className="
              text-sm
              sm:text-base
              text-gray-500
              mt-1
            "
          >
            Track, view and manage all your orders in one place
          </p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} fetchOrders={fetchOrders} />
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
