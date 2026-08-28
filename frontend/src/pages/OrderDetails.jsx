import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";

import { toast } from "react-toastify";

import {
  Check,
  CalendarDays,
  CreditCard,
  Package,
  Truck,
  CircleCheck,
  XCircle,
  Star,
  Pencil,
  MapPin,
  ShieldCheck,
  Headphones,
  RotateCcw,
} from "lucide-react";

import OrderItem from "../components/orders/OrderItem";

import ReviewForm from "../components/review/ReviewForm";

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review states
  const [myReviews, setMyReviews] = useState({});
  const [reviewLoading, setReviewLoading] = useState({});
  const [editingReview, setEditingReview] = useState(null);
  const [reviewingProductId, setReviewingProductId] = useState(null);

  // Indian Rupee formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Fetch Order
  const fetchOrder = async () => {
    try {
      const { data } = await axiosInstance.get(`/orders/${id}`);

      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load order.");
    } finally {
      setLoading(false);
    }
  };

  // Check current user's review for a product
  const fetchMyReview = async (productId) => {
    try {
      setReviewLoading((prev) => ({
        ...prev,
        [productId]: true,
      }));

      const { data } = await axiosInstance.get(`/reviews/my/${productId}`);

      if (data.success) {
        setMyReviews((prev) => ({
          ...prev,
          [productId]: data.reviewed ? data.review : null,
        }));
      }
    } catch (error) {
      console.error(`Failed to check review for product ${productId}:`, error);
    } finally {
      setReviewLoading((prev) => ({
        ...prev,
        [productId]: false,
      }));
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Fetch reviews after order is loaded and delivered
  useEffect(() => {
    if (!order || order.orderStatus !== "Delivered") {
      return;
    }

    order.items.forEach((item) => {
      fetchMyReview(item.product);
    });
  }, [order]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-2xl font-semibold">Loading Order...</h2>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-2xl font-semibold text-red-500">Order Not Found</h2>
      </div>
    );
  }

  const statusSteps = [
    {
      status: "Pending",
      label: "Order Placed",
      icon: Package,
    },
    {
      status: "Confirmed",
      label: "Confirmed",
      icon: Check,
    },
    {
      status: "Shipped",
      label: "Shipped",
      icon: Truck,
    },
    {
      status: "Delivered",
      label: "Delivered",
      icon: CircleCheck,
    },
  ];

  const currentStatusIndex = statusSteps.findIndex(
    (step) => step.status === order.orderStatus,
  );

  const isCancelled = order.orderStatus === "Cancelled";

  const isDelivered = order.orderStatus === "Delivered";

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

  // Start writing a review
  const handleWriteReview = (productId) => {
    setReviewingProductId(productId);
    setEditingReview(null);
  };

  // Edit existing review
  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewingProductId(review.product);
  };

  // Refresh review after submit/update
  const handleReviewRefresh = async (productId) => {
    await fetchMyReview(productId);

    setReviewingProductId(null);
    setEditingReview(null);
  };

  const itemTotal = order.items.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );

  const shippingCharge = 0;
  const handlingFee = 0;

  return (
    <div className="min-h-screen bg-[#F8F9FD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-5 overflow-x-auto whitespace-nowrap">
          <span>Home</span>
          <span>›</span>
          <span>Orders</span>
          <span>›</span>
          <span className="text-gray-700 font-medium">Order Details</span>
        </div>

        {/* Order Header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6 sm:mb-7">
          <div className="p-5 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
              <div className="flex items-start gap-4 min-w-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
                  <Package
                    className="text-[#6D4AFF]"
                    size={30}
                    strokeWidth={1.8}
                  />
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">
                    Order Details
                  </h1>
                  <p className="text-gray-500 mt-1.5 text-sm sm:text-base">
                    Order #{order._id.slice(-8)}
                  </p>
                </div>
              </div>

              <span
                className={`self-start px-4 py-2 rounded-full text-sm font-semibold ${
                  isCancelled
                    ? "bg-red-50 text-red-600"
                    : "bg-purple-50 text-[#6D4AFF]"
                }`}
              >
                {order.orderStatus}
              </span>
            </div>

            <div className="h-px bg-gray-200 my-6 sm:my-7" />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                  <Package size={16} /> Order ID
                </p>
                <p className="font-semibold text-[#111827] mt-2 break-all text-sm sm:text-base">
                  {order._id}
                </p>
              </div>

              <div className="min-w-0 sm:border-l sm:border-gray-200 sm:pl-5 xl:pl-6">
                <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                  <CalendarDays size={16} /> Placed On
                </p>
                <p className="font-semibold text-[#111827] mt-2 text-sm sm:text-base">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="min-w-0 xl:border-l xl:border-gray-200 xl:pl-6">
                <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                  <CreditCard size={16} /> Payment Method
                </p>
                <p className="font-semibold text-[#111827] mt-2 text-sm sm:text-base">
                  {order.paymentMethod || "Cash on Delivery"}
                </p>
              </div>

              <div className="min-w-0 sm:border-l sm:border-gray-200 sm:pl-5 xl:pl-6">
                <p className="text-xs sm:text-sm text-gray-500">
                  Payment Status
                </p>
                <span
                  className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getPaymentColor(
                    order.paymentStatus,
                  )}`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div
          id="order-status"
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-7 mb-6 sm:mb-7"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mb-7">
            Order Status
          </h2>

          {isCancelled ? (
            <div className="flex items-start gap-4 bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <XCircle className="text-red-600" size={27} />
              </div>

              <div>
                <h3 className="font-bold text-red-700 text-base sm:text-lg">
                  Order Cancelled
                </h3>
                <p className="text-red-600 text-sm mt-1">
                  This order has been cancelled.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row lg:items-end gap-7 lg:gap-8">
              <div className="relative flex-1 min-w-0">
                {/* Background Connecting Line */}
                <div className="hidden sm:block absolute top-6 left-[12.5%] right-[12.5%] h-1 rounded-full bg-gray-200" />

                {/* Completed Connecting Line */}
                <div
                  className="hidden sm:block absolute top-6 left-[12.5%] h-1 rounded-full bg-[#6D4AFF] transition-all duration-300"
                  style={{
                    width:
                      currentStatusIndex <= 0
                        ? "0%"
                        : `${(currentStatusIndex / 3) * 75}%`,
                  }}
                />

                {/* Status Steps */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 relative">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    const completed = index <= currentStatusIndex;
                    const current = index === currentStatusIndex;

                    return (
                      <div
                        key={step.status}
                        className="flex flex-col items-center text-center min-w-0"
                      >
                        <div
                          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${
                            completed
                              ? "bg-[#6D4AFF] text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          <Icon size={20} />
                        </div>

                        <p
                          className={`mt-3 font-semibold text-xs sm:text-sm ${
                            completed ? "text-[#6D4AFF]" : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                          {index === 0
                            ? new Date(order.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "--"}
                        </p>

                        {current && (
                          <span className="mt-2 px-3 py-1 rounded-full bg-purple-50 text-[#6D4AFF] text-[11px] sm:text-xs font-medium">
                            Current Status
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* UI-only tracking shortcut; no backend/API changes */}
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("order-status")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" })
                }
                className="w-full lg:w-auto lg:min-w-[170px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#6D4AFF] text-[#6D4AFF] hover:bg-purple-50 transition font-semibold"
              >
                <MapPin size={18} />
                Track Order
              </button>
            </div>
          )}
        </div>

        {/* Ordered Products */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-7 mb-6 sm:mb-7">
          <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
              Ordered Products
            </h2>
            <span className="text-sm text-red-500">
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="space-y-5">
            {order.items.map((item) => {
              const productId = item.product;
              const myReview = myReviews[productId];
              const isCheckingReview = reviewLoading[productId];
              const isReviewing = reviewingProductId === productId;

              return (
                <div key={productId}>
                  <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white hover:shadow-gray-200 hover:shadow-sm transition">
                    <OrderItem
                      item={item} />
                  </div>

                  {/* Review Section */}
                  {isDelivered && (
                    <div className="mt-4">
                      {isCheckingReview ? (
                        <div className="text-sm text-gray-500 py-2">
                          Checking review status...
                        </div>
                      ) : isReviewing ? (
                        <ReviewForm
                          productId={productId}
                          editingReview={editingReview}
                          setEditingReview={setEditingReview}
                          refreshReviews={() => handleReviewRefresh(productId)}
                        />
                      ) : myReview ? (
                        <div className="border border-green-200 bg-green-50 rounded-xl p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-green-700 font-semibold">
                                  ✓ Reviewed
                                </span>

                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, index) => (
                                    <Star
                                      key={index}
                                      size={16}
                                      className={
                                        index < myReview.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }
                                    />
                                  ))}
                                </div>
                              </div>

                              <p className="text-gray-700 mt-2">
                                {myReview.comment}
                              </p>
                            </div>

                            <button
                              onClick={() => handleEditReview(myReview)}
                              className="flex items-center justify-center gap-2 border border-[#6D4AFF] text-[#6D4AFF] hover:bg-[#6D4AFF] hover:text-white px-4 py-2 rounded-xl font-medium transition"
                            >
                              <Pencil size={16} />
                              Edit Review
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleWriteReview(productId)}
                          className="w-full border border-[#6D4AFF] text-[#6D4AFF] hover:bg-[#6D4AFF] hover:text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                        >
                          <Star size={18} />
                          Write a Review
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping + Total */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-7">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <MapPin className="text-[#6D4AFF]" size={21} />
              </div>
              <h2 className="text-xl font-bold text-[#111827]">
                Shipping Address
              </h2>
            </div>

            <div className="space-y-2 text-gray-700 text-sm sm:text-base leading-relaxed">
              <p className="font-medium text-[#111827]">
                {order.shippingAddress.fullName}
              </p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
              <p>{order.shippingAddress.pincode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-7">
            <div className="space-y-4 text-sm sm:text-base">
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Item Total</span>
                <span className="font-medium">{formatCurrency(itemTotal)}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Shipping Charge</span>
                <span className="font-medium">
                  {formatCurrency(shippingCharge)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Handling Fee</span>
                <span className="font-medium">
                  {formatCurrency(handlingFee)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4 flex items-center justify-between gap-4">
                <span className="text-lg sm:text-xl font-bold text-[#111827]">
                  Total Amount
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-[#6D4AFF]">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <ShieldCheck size={18} className="shrink-0" />
                <span>You save {formatCurrency(0)} on this order</span>
              </div>
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0">
                <Headphones className="text-[#6D4AFF]" size={24} />
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#111827]">
                  Need Help?
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  We're here to help you with your order
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                toast.info("Contact Support will be available soon.")
              }
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#6D4AFF] text-[#6D4AFF] hover:bg-[#6D4AFF] hover:text-white px-5 py-3 rounded-xl font-semibold transition cursor-pointer"
            >
              <Headphones size={18} />
              Contact Support
            </button>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
            <div className="flex items-center gap-4 py-4 sm:py-0 sm:px-5 first:pt-0 sm:first:pl-0">
              <div className="w-11 h-11 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                <Truck className="text-[#6D4AFF]" size={22} />
              </div>
              <div>
                <p className="font-semibold text-[#111827]">Free Delivery</p>
                <p className="text-sm text-gray-500 mt-1">
                  On orders above ₹499
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-4 sm:py-0 sm:px-5">
              <div className="w-11 h-11 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                <RotateCcw className="text-[#6D4AFF]" size={22} />
              </div>
              <div>
                <p className="font-semibold text-[#111827]">Easy Returns</p>
                <p className="text-sm text-gray-500 mt-1">Within 7 days</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-4 sm:py-0 sm:px-5">
              <div className="w-11 h-11 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                <ShieldCheck className="text-[#6D4AFF]" size={22} />
              </div>
              <div>
                <p className="font-semibold text-[#111827]">Secure Payments</p>
                <p className="text-sm text-gray-500 mt-1">
                  100% safe &amp; secure
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-4 sm:py-0 sm:px-5 last:pb-0">
              <div className="w-11 h-11 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                <Headphones className="text-[#6D4AFF]" size={22} />
              </div>
              <div>
                <p className="font-semibold text-[#111827]">24/7 Support</p>
                <p className="text-sm text-gray-500 mt-1">We're here to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
