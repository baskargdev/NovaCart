import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import {
  AlertTriangle,
  CreditCard,
  LockKeyhole,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";

import { useCart } from "../../context/CartContext";

const OrderSummary = ({ cartItems, shippingAddress, paymentMethod }) => {
  const navigate = useNavigate();

  const { fetchCart } = useCart();

  const [loading, setLoading] = useState(false);

  // Indian Rupee formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  // Remove invalid cart items
  const validCartItems = cartItems.filter((item) => item && item.product);

  // Total Items
  const totalItems = validCartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // Subtotal
  const subtotal = validCartItems.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0,
  );

  // Shipping
  const shipping = 0;

  // Grand Total
  const grandTotal = subtotal + shipping;

  // Razorpay Payment
  const handleRazorpayPayment = async () => {
    const { fullName, phone, address, city, state, pincode, country } =
      shippingAddress;

    // Shipping Validation
    if (
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !country
    ) {
      return toast.warning("Please fill all shipping details.");
    }

    try {
      setLoading(true);

      // Create Razorpay Order
      const { data } = await axiosInstance.post("/payment/create-order");

      if (!data.success) {
        toast.error("Failed to create payment order.");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "NovaCart",
        description: "Order Payment",
        order_id: data.order.id,

        prefill: {
          name: shippingAddress.fullName,
          email: "",
          contact: shippingAddress.phone,
        },

        theme: {
          color: "#6D4AFF",
        },

        handler: async function (response) {
          try {
            // Verify Payment
            const verifyResponse = await axiosInstance.post(
              "/payment/verify-payment",
              response,
            );

            if (!verifyResponse.data.success) {
              return toast.error("Payment verification failed.");
            }

            // Save Order
            const orderResponse = await axiosInstance.post("/orders/place", {
              shippingAddress,
              paymentMethod: "Razorpay",
              paymentStatus: "Paid",
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
            });

            if (orderResponse.data.success) {
              toast.success("Payment successful! Order placed.");

              await fetchCart();

              navigate("/orders");
            }
          } catch (error) {
            toast.error(
              error.response?.data?.message || "Payment verification failed.",
            );
          } finally {
            setLoading(false);
          }
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed.");

      setLoading(false);
    }
  };

  // Cash on Delivery
  const placeOrder = async () => {
    const { fullName, phone, address, city, state, pincode, country } =
      shippingAddress;

    // Shipping Validation
    if (
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !country
    ) {
      return toast.warning("Please fill all shipping details.");
    }

    try {
      setLoading(true);

      const { data } = await axiosInstance.post("/orders/place", {
        shippingAddress,
      });

      if (data.success) {
        toast.success("Order placed successfully!");

        await fetchCart();

        navigate("/orders");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        bg-white
        border
        border-gray-100
        shadow-sm
        rounded-2xl
        p-5
        sm:p-6
        lg:p-7
        lg:sticky
        lg:top-24
      "
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className="
            w-11
            h-11
            rounded-xl
            bg-[#F0ECFF]
            flex
            items-center
            justify-center
            shrink-0
          "
        >
          <Package size={22} className="text-[#6D4AFF]" />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F2E]">
            Order Summary
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Review your order before placing it
          </p>
        </div>
      </div>

      {/* ================= DEMO NOTICE ================= */}
      <div
        className="
          rounded-xl
          border
          border-yellow-200
          bg-yellow-50
          p-3.5
          sm:p-4
          mb-6
        "
      >
        <div className="flex items-start gap-3">
          <AlertTriangle
            size={20}
            className="text-yellow-600 shrink-0 mt-0.5"
          />

          <div>
            <h3 className="font-semibold text-yellow-800 text-sm">
              Demo Project
            </h3>

            <p className="mt-1 text-xs sm:text-sm text-yellow-700 leading-relaxed">
              This is a portfolio project created for demonstration purposes.
            </p>

            <p className="text-xs sm:text-sm text-yellow-700 leading-relaxed mt-1">
              Payments use <strong>Razorpay Test Mode</strong>. No real money
              will be charged.
            </p>
          </div>
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1F1F2E]">Your Items</h3>

          <span className="text-sm text-gray-500">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
          {validCartItems.map((item) => (
            <div
              key={item._id}
              className="
                flex
                items-center
                justify-between
                gap-3
                p-2
                rounded-lg
                bg-[#F8F8FC]
                border
                border-gray-100
              "
            >
              {/* Product */}
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="
                    w-12
                    h-12
                    sm:w-14
                    sm:h-14
                    rounded-lg
                    object-fill
                    bg-white
                    border
                    border-gray-100
                    shrink-0
                  "
                />

                <div className="min-w-0">
                  <h4 className="font-medium text-sm text-[#1F1F2E] truncate">
                    {item.product.name}
                  </h4>

                  <p className="text-xs text-gray-500 mt-1">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>

              {/* Item Total */}
              <span className="font-semibold text-sm text-[#1F1F2E] whitespace-nowrap">
                {formatCurrency(Number(item.product.price) * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 my-5" />

      {/* ================= PRICE DETAILS ================= */}
      <div className="space-y-4">
        {/* Total Items */}
        <div className="flex items-center justify-between text-sm sm:text-base">
          <span className="text-gray-500">Total Items</span>

          <span className="font-semibold text-[#1F1F2E]">{totalItems}</span>
        </div>

        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm sm:text-base">
          <span className="text-gray-500">Subtotal</span>

          <span className="font-semibold text-[#1F1F2E]">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between text-sm sm:text-base">
          <span className="text-gray-500">Shipping</span>

          <span className="text-green-600 font-semibold">Free</span>
        </div>

        {/* Payment */}
        <div className="flex items-center justify-between gap-3 text-sm sm:text-base">
          <span className="text-gray-500">Payment</span>

          <span className="font-semibold text-[#1F1F2E] text-right">
            {paymentMethod}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 my-3" />

      {/* ================= TOTAL ================= */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Total</p>

          <p className="text-2xl sm:text-3xl font-bold text-[#1F1F2E] mt-1">
            {formatCurrency(grandTotal)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-400">Inclusive of all taxes</p>
        </div>
      </div>

      {/* ================= PLACE ORDER ================= */}
      <button
        onClick={() => {
          if (paymentMethod === "Cash on Delivery") {
            placeOrder();
          } else {
            handleRazorpayPayment();
          }
        }}
        disabled={loading}
        className="
          w-full
          mt-4
          bg-[#6D4AFF]
          hover:bg-[#5936F7]
          text-white
          py-3.5
          sm:py-4
          rounded-sm
          flex
          items-center
          justify-center
          gap-2
          font-semibold
          text-sm
          sm:text-base
          transition
          disabled:opacity-60
          disabled:cursor-not-allowed
          cursor-pointer
        "
      >
        {loading
          ? "Processing..."
          : paymentMethod === "Razorpay"
            ? "Proceed to Payment"
            : "Place Order"}
      </button>

      {/* ================= SECURITY ================= */}
      <div className="flex flex-col items-center justify-center mt-3">
        

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <LockKeyhole size={14} className="text-green-600" />
          <span>Your payment information is protected.</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
