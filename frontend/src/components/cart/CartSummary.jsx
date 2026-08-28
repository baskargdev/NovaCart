import { Link } from "react-router-dom";

import { ArrowRight, ShieldCheck, Truck } from "lucide-react";

const CartSummary = ({ cartItems }) => {
  // Indian Rupee formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  // Ignore invalid cart items
  const validCartItems = cartItems.filter((item) => item && item.product);

  // Total number of products
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F2E]">
          Order Summary
        </h2>

        <div
          className="
            w-10
            h-10
            rounded-xl
            bg-[#F0ECFF]
            flex
            items-center
            justify-center
          "
        >
          <Truck size={20} className="text-[#6D4AFF]" />
        </div>
      </div>

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
      </div>

      {/* ================= FREE SHIPPING MESSAGE ================= */}
      <div
        className="
          mt-5
          p-3
          rounded-xl
          bg-green-50
          border
          border-green-100
          flex
          items-start
          gap-2.5
        "
      >
        <Truck size={18} className="text-green-600 shrink-0 mt-0.5" />

        <p className="text-xs sm:text-sm text-green-700 leading-relaxed">
          Great! You qualify for{" "}
          <span className="font-semibold">FREE delivery</span>.
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 my-5" />

      {/* ================= GRAND TOTAL ================= */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Total</p>

          <p className="text-xl sm:text-2xl font-bold text-[#1F1F2E] mt-1">
            {formatCurrency(grandTotal)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-400">( Inclusive of all taxes )</p>
        </div>
      </div>

      {/* ================= CHECKOUT ================= */}
      <Link
        to="/checkout"
        className="
          mt-6
          w-full
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
          group
        "
      >
        Proceed to Checkout
        <ArrowRight
          size={19}
          className="
            transition-transform
            duration-200
            group-hover:translate-x-1
          "
        />
      </Link>

      {/* ================= SECURE CHECKOUT ================= */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <ShieldCheck size={17} className="text-green-600" />

        <span className="text-xs sm:text-sm text-gray-500">
         Secure & encrypted checkout
        </span>
      </div>
    </div>
  );
};

export default CartSummary;
