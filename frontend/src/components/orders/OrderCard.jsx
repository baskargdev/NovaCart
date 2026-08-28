import { useState } from "react";

import { Link } from "react-router-dom";

import {
  Package,
  CalendarDays,
  CreditCard,
  Truck,
  MapPin,
  ChevronRight,
  X,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";

import { toast } from "react-toastify";

const OrderCard = ({ order, fetchOrders }) => {
  const [showTracking, setShowTracking] = useState(false);

  // ================= CURRENCY =================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  // ================= STATUS COLOR =================

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Shipped":
        return "bg-blue-100 text-blue-700";

      case "Confirmed":
        return "bg-purple-100 text-purple-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ================= PAYMENT COLOR =================

  const getPaymentColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Refunded":
        return "bg-blue-100 text-blue-700";

      case "Failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ================= ESTIMATED DELIVERY =================

  const getEstimatedDelivery = () => {
    if (
      order.orderStatus === "Delivered" ||
      order.orderStatus === "Cancelled"
    ) {
      return null;
    }

    const orderDate = new Date(order.createdAt);

    const startDate = new Date(orderDate);
    startDate.setDate(startDate.getDate() + 7);

    const endDate = new Date(orderDate);
    endDate.setDate(endDate.getDate() + 9);

    const formatDate = (date) => {
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  // ================= CANCEL ORDER =================

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmCancel) return;

    try {
      const { data } = await axiosInstance.put(`/orders/${order._id}/cancel`);

      if (data.success) {
        toast.success(data.message);
        await fetchOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order.");
    }
  };

  const canCancel =
    order.orderStatus === "Pending" || order.orderStatus === "Confirmed";

  const estimatedDelivery = getEstimatedDelivery();

  // ================= PRODUCT DATA =================

  const firstItem = order.items?.[0];

  const product = firstItem?.product;

  const productImage = product?.image || firstItem?.image || null;

  const productName = product?.name || firstItem?.name || "Product";

  // ================= TRACKING =================

  const trackingSteps = [
    {
      label: "Order Placed",
      status: "Pending",
    },
    {
      label: "Confirmed",
      status: "Confirmed",
    },
    {
      label: "Shipped",
      status: "Shipped",
    },
    {
      label: "Delivered",
      status: "Delivered",
    },
  ];

  const statusOrder = ["Pending", "Confirmed", "Shipped", "Delivered"];

  const currentStep = statusOrder.indexOf(order.orderStatus);

  return (
    <>
      {/* ================================================= */}
      {/* ORDER CARD */}
      {/* ================================================= */}

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-gray-200
          shadow-sm
          hover:shadow-md
          transition-all
          duration-300
          overflow-hidden
        "
      >
        {/* ================= HEADER ================= */}

        <div className="px-5 sm:px-7 pt-5 sm:pt-6">
          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-4
            "
          >
            {/* Order Number + Date */}

            <div className="flex items-center gap-4">
              <div
                className="
                  w-12
                  h-12
                  sm:w-14
                  sm:h-14
                  rounded-xl
                  bg-[#F0ECFF]
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <Package
                  size={27}
                  className="text-[#6D4AFF]"
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p className="text-xs sm:text-sm text-gray-500">Order Number</p>

                <h2
                  className="
                    text-lg
                    sm:text-xl
                    font-bold
                    text-[#1F1F2E]
                  "
                >
                  #{order._id.slice(-8).toUpperCase()}
                </h2>

                <div className="flex items-center gap-2 text-gray-500 mt-1.5 text-sm">
                  <CalendarDays size={15} />

                  <span>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Status */}

            <div className="flex flex-wrap gap-2">
              <span
                className={`
                  px-3
                  py-1.5
                  rounded-full
                  text-xs
                  sm:text-sm
                  font-semibold
                  ${getStatusColor(order.orderStatus)}
                `}
              >
                {order.orderStatus}
              </span>

              <span
                className={`
                  px-3
                  py-1.5
                  rounded-full
                  text-xs
                  sm:text-sm
                  font-semibold
                  ${getPaymentColor(order.paymentStatus)}
                `}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}

        <div className="mx-5 sm:mx-7 mt-5 border-t border-gray-100" />

        {/* ================= MAIN ORDER INFO ================= */}

        <div className="px-5 sm:px-7 py-5">
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-4
              gap-5
              xl:gap-0
            "
          >
            {/* ================= PRODUCT ================= */}

            <div
              className="
                xl:pr-6
                xl:border-r
                xl:border-gray-100
              "
            >
              <p className="text-xs text-gray-500 mb-3">Product</p>

              <div className="flex items-center gap-4">
                {/* Image */}

                <div
                  className="
                    w-24
                    h-24
                    sm:w-32
                    sm:h-32
                    bg-[#F8F8FC]
                    rounded-xl
                    overflow-hidden
                    shrink-0
                    flex
                    items-center
                    justify-center
                  "
                >
                  {productImage ? (
                    <img
                      src={productImage}
                      alt={productName}
                      className="
                        w-full
                        h-full
                        object-fill
                        rounded-xl
                        p-2
                      "
                    />
                  ) : (
                    <Package size={30} className="text-gray-300" />
                  )}
                </div>

                {/* Product Name */}

                <div className="min-w-0">
                  <h3
                    className="
                      font-semibold
                      text-[#1F1F2E]
                      text-sm
                      sm:text-base
                      line-clamp-2
                    "
                  >
                    {productName}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    Qty: {firstItem?.quantity || 1}
                  </p>

                  {order.items?.length > 1 && (
                    <p className="text-xs text-[#6D4AFF] font-medium mt-1">
                      + {order.items.length - 1} more product
                      {order.items.length - 1 > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ================= TOTAL ================= */}

            <div
              className="
                xl:px-7
                xl:border-r
                xl:border-gray-100
                flex
                flex-col
                justify-center
              "
            >
              <p className="text-sm text-gray-500 mb-2">Total Amount</p>

              <p
                className="
                  text-2xl
                  sm:text-3xl
                  font-bold
                  text-[#6D4AFF]
                "
              >
                {formatCurrency(order.totalAmount)}
              </p>
            </div>

            {/* ================= PAYMENT ================= */}

            <div
              className="
                xl:px-7
                xl:border-r
                xl:border-gray-100
                flex
                flex-col
                justify-center
              "
            >
              <p className="text-sm text-gray-500 mb-2">Payment Method</p>

              <div className="flex items-center gap-2">
                <CreditCard size={19} className="text-gray-500" />

                <p className="font-semibold text-[#1F1F2E] text-sm sm:text-base">
                  {order.paymentMethod || "Cash on Delivery"}
                </p>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Status:{" "}
                <span className="font-medium text-gray-700">
                  {order.paymentStatus}
                </span>
              </p>
            </div>

            {/* ================= DELIVERY ================= */}

            <div className="xl:pl-7 flex items-center">
              {estimatedDelivery ? (
                <div
                  className="
                    w-full
                    rounded-xl
                    border
                    border-purple-100
                    bg-[#F8F6FF]
                    px-4
                    py-4
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      w-11
                      h-11
                      rounded-xl
                      bg-white
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >
                    <Truck size={22} className="text-[#6D4AFF]" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Estimated Delivery</p>

                    <p
                      className="
                        font-bold
                        text-[#6D4AFF]
                        text-sm
                        sm:text-base
                        mt-1
                      "
                    >
                      {estimatedDelivery}
                    </p>
                  </div>
                </div>
              ) : order.orderStatus === "Delivered" ? (
                <div
                  className="
                    w-full
                    rounded-xl
                    border
                    border-green-100
                    bg-green-50
                    px-4
                    py-4
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      w-11
                      h-11
                      rounded-xl
                      bg-white
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >
                    <Package size={22} className="text-green-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Order Status</p>

                    <p className="font-bold text-green-700 mt-1">Delivered</p>
                  </div>
                </div>
              ) : (
                <div
                  className="
                    w-full
                    rounded-xl
                    border
                    border-red-100
                    bg-red-50
                    px-4
                    py-4
                  "
                >
                  <p className="text-sm font-semibold text-red-600">
                    Order Cancelled
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= ACTIONS ================= */}

        <div
          className="
    border-t
    border-gray-100
    px-5
    sm:px-7
    py-4
    flex
    flex-col
    sm:flex-row
    sm:justify-end
    gap-3
  "
        >
          {/* View Details */}

          <Link
            to={`/orders/${order._id}`}
            className="
              inline-flex
              items-center
              justify-center
              gap-4
              px-5
              py-3
              rounded-sm
              bg-[#6D4AFF]
              text-white
              hover:bg-[#5936F7]
              transition
              font-semibold
              text-sm
            "
          >
            View Details
            <ChevronRight size={17} />
          </Link>

          {/* Track Order */}

          {order.orderStatus !== "Cancelled" && (
            <button
              onClick={() => setShowTracking(true)}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-5
                py-3
                rounded-sm
                border
                border-[#6D4AFF]
                text-[#6D4AFF]
                hover:bg-[#F0ECFF]
                transition
                font-semibold
                text-sm
                cursor-pointer
              "
            >
              <Truck size={17} />
              Track Order
            </button>
          )}

          {/* Cancel */}

          {canCancel && (
            <button
              onClick={handleCancelOrder}
              className="
                flex-1
                sm:flex-none
                px-5
                py-3
                rounded-sm
                border
                border-red-200
                text-red-500
                hover:bg-red-50
                transition
                font-semibold
                text-sm
                cursor-pointer
              "
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* TRACKING MODAL */}
      {/* ================================================= */}

      {showTracking && (
        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/40
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          "
          onClick={() => setShowTracking(false)}
        >
          <div
            className="
              bg-white
              w-full
              max-w-lg
              max-h-[90vh]
              overflow-y-auto
              rounded-2xl
              shadow-2xl
              p-5
              sm:p-6
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Track Order</p>

                <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F2E] mt-1">
                  #{order._id.slice(-8).toUpperCase()}
                </h2>
              </div>

              <button
                onClick={() => setShowTracking(false)}
                className="
                  w-9
                  h-9
                  rounded-full
                  bg-gray-100
                  flex
                  items-center
                  justify-center
                  hover:bg-gray-200
                  transition
                  cursor-pointer
                "
              >
                <X size={19} />
              </button>
            </div>

            {/* Estimated Delivery */}

            {estimatedDelivery && (
              <div className="mt-5 bg-[#F8F6FF] rounded-xl p-4">
                <p className="text-sm text-gray-500">Estimated Delivery</p>

                <p className="text-lg font-bold text-[#6D4AFF] mt-1">
                  {estimatedDelivery}
                </p>
              </div>
            )}

            {/* Shipping Address */}

            {order.shippingAddress && (
              <div className="mt-5 flex gap-3">
                <MapPin size={19} className="text-[#6D4AFF] shrink-0 mt-0.5" />

                <div>
                  <p className="text-sm font-semibold">Delivering to</p>

                  <p className="text-sm text-gray-500 mt-1">
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                </div>
              </div>
            )}

            {/* Tracking Timeline */}

            <div className="mt-7">
              {trackingSteps.map((step, index) => {
                const stepIndex = statusOrder.indexOf(step.status);

                const completed = currentStep >= stepIndex;

                const active = order.orderStatus === step.status;

                return (
                  <div key={step.status} className="flex gap-4">
                    {/* Timeline */}

                    <div className="flex flex-col items-center">
                      <div
                        className={`
                          w-9
                          h-9
                          rounded-full
                          flex
                          items-center
                          justify-center
                          text-sm
                          font-bold
                          ${
                            completed
                              ? "bg-[#6D4AFF] text-white"
                              : "bg-gray-100 text-gray-400"
                          }
                        `}
                      >
                        {completed ? "✓" : index + 1}
                      </div>

                      {index !== trackingSteps.length - 1 && (
                        <div
                          className={`
                            w-0.5
                            h-12
                            ${
                              currentStep > stepIndex
                                ? "bg-[#6D4AFF]"
                                : "bg-gray-200"
                            }
                          `}
                        />
                      )}
                    </div>

                    {/* Step Content */}

                    <div className="pt-1 pb-6">
                      <p
                        className={`
                          font-semibold
                          ${
                            active
                              ? "text-[#6D4AFF]"
                              : completed
                                ? "text-[#1F1F2E]"
                                : "text-gray-400"
                          }
                        `}
                      >
                        {step.label}
                      </p>

                      {active && (
                        <p className="text-sm text-gray-500 mt-1">
                          Current order status
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View Order Details */}

            <Link
              to={`/orders/${order._id}`}
              onClick={() => setShowTracking(false)}
              className="
                mt-2
                w-full
                inline-flex
                items-center
                justify-center
                gap-2
                bg-[#6D4AFF]
                hover:bg-[#5936F7]
                text-white
                py-3
                rounded-sm
                font-semibold
                transition
              "
            >
              View Order Details
              <ChevronRight size={17} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderCard;
