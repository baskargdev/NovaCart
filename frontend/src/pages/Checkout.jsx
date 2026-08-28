import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import ShippingForm from "../components/checkout/ShippingForm";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderSummary from "../components/checkout/OrderSummary";

const Checkout = () => {
  const { cartItems, cartLoading } = useCart();
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  if (cartLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <h2 className="text-xl font-semibold">Loading Checkout...</h2>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <h2 className="text-2xl font-bold">Your cart is empty.</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-xl bg-[#F0ECFF] flex items-center justify-center shrink-0">
          <ShoppingCart size={28} className="text-[#6D4AFF]" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1F2E]">
            Checkout
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Review your details and complete your order
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ShippingForm
            shippingAddress={shippingAddress}
            setShippingAddress={setShippingAddress}
          />

          <PaymentMethod
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>
        <div>
          <OrderSummary
            cartItems={cartItems}
            shippingAddress={shippingAddress}
            paymentMethod={paymentMethod}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
