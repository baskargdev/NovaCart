import { CreditCard, WalletCards, ShieldCheck } from "lucide-react";

const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 sm:p-6 lg:p-7">
      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-4 mb-7">
        <div className="w-12 h-12 rounded-xl bg-[#F0ECFF] flex items-center justify-center shrink-0">
          <WalletCards size={25} className="text-[#6D4AFF]" />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F2E]">
            Payment Method
          </h2>

          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Choose a payment option
          </p>
        </div>
      </div>

      {/* ================= PAYMENT OPTIONS ================= */}
      <div className="space-y-5">
        {/* Razorpay */}
        <label
          className={`
            flex
            items-center
            gap-4
            border
            rounded-xl
            p-4
            sm:p-5
            cursor-pointer
            transition-all
            ${
              paymentMethod === "Razorpay"
                ? "border-[#6D4AFF] bg-[#F8F5FF] shadow-sm"
                : "border-gray-200 hover:border-[#6D4AFF]/50"
            }
          `}
        >
          {/* Radio */}
          <input
            type="radio"
            name="paymentMethod"
            value="Razorpay"
            checked={paymentMethod === "Razorpay"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-5 h-5 accent-[#6D4AFF] shrink-0"
          />

          {/* Icon */}
          <div
            className={`
              w-10
              h-10
              rounded-xl
              flex
              items-center
              justify-center
              shrink-0
              ${paymentMethod === "Razorpay" ? "bg-white" : "bg-gray-50"}
            `}
          >
            <CreditCard
              size={21}
              className={
                paymentMethod === "Razorpay"
                  ? "text-[#6D4AFF]"
                  : "text-gray-500"
              }
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-[#1F1F2E]">Razorpay</p>

              <span className="text-[11px] sm:text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                Recommended
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Secure payment using Razorpay Test Mode.
            </p>
          </div>

          {/* Razorpay text */}
          <span className="hidden sm:block text-sm font-semibold text-[#1F1F2E]">
            Razorpay
          </span>
        </label>

        {/* Cash on Delivery */}
        <label
          className={`
            flex
            items-center
            gap-4
            border
            rounded-xl
            p-4
            sm:p-5
            cursor-pointer
            transition-all
            ${
              paymentMethod === "Cash on Delivery"
                ? "border-[#6D4AFF] bg-[#F8F5FF] shadow-sm"
                : "border-gray-200 hover:border-[#6D4AFF]/50"
            }
          `}
        >
          {/* Radio */}
          <input
            type="radio"
            name="paymentMethod"
            value="Cash on Delivery"
            checked={paymentMethod === "Cash on Delivery"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-5 h-5 accent-[#6D4AFF] shrink-0"
          />

          {/* Icon */}
          <div
            className={`
              w-10
              h-10
              rounded-xl
              flex
              items-center
              justify-center
              shrink-0
              ${
                paymentMethod === "Cash on Delivery" ? "bg-white" : "bg-gray-50"
              }
            `}
          >
            <WalletCards
              size={21}
              className={
                paymentMethod === "Cash on Delivery"
                  ? "text-[#6D4AFF]"
                  : "text-gray-500"
              }
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#1F1F2E]">Cash on Delivery</p>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Pay when your order is delivered to your doorstep.
            </p>
          </div>
        </label>
      </div>

      {/* Security Note */}
      <div className="flex items-center gap-2 mt-5 text-xs sm:text-sm text-gray-500">
        <ShieldCheck size={17} className="text-green-500 shrink-0" />
        <span>Your payment information is secure.</span>
      </div>
    </div>
  );
};

export default PaymentMethod;
