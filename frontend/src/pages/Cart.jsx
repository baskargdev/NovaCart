import { useCart } from "../context/CartContext";
import CartItems from "../components/cart/CartItems";
import CartSummary from "../components/cart/CartSummary";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  ArrowLeft,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
} from "lucide-react";

const Cart = () => {
  const { cartItems, cartLoading } = useCart();

  if (cartLoading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center px-4">
        <h2 className="text-xl font-semibold text-[#1F1F2E]">
          Loading cart...
        </h2>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="min-h-[55vh] flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mb-6">
            <ShoppingCart
              size={40}
              className="text-[#6D4AFF]"
              strokeWidth={1.8}
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1F2E]">
            Your Cart is Empty
          </h1>

          <p className="text-gray-500 mt-3 max-w-md text-sm sm:text-base">
            Add some products to your cart and come back here when you're ready
            to checkout.
          </p>

          <Link
            to="/shop"
            className="
              mt-6
              inline-flex
              items-center
              justify-center
              gap-2
              bg-[#6D4AFF]
              hover:bg-[#5936F7]
              text-white
              px-6
              py-3
              rounded-xl
              font-semibold
              transition
            "
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFE] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="mb-8 sm:mb-10">
          <div className="flex items-start gap-3 sm:gap-4">
            <div
              className="
                shrink-0
                w-12
                h-12
                sm:w-14
                sm:h-14
                rounded-2xl
                bg-[#F0ECFF]
                flex
                items-center
                justify-center
              "
            >
              <ShoppingCart
                size={26}
                className="text-[#6D4AFF] sm:w-7 sm:h-7"
                strokeWidth={2}
              />
            </div>

            <div>
              <h1
                className="
                  text-2xl
                  sm:text-3xl
                  lg:text-4xl
                  font-bold
                  text-[#1F1F2E]
                "
              >
                Shopping Cart
              </h1>

              <p className="text-gray-500 mt-1 text-sm sm:text-base">
                Review your items and proceed to checkout
              </p>
            </div>
          </div>
        </div>

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-3
            gap-6
            lg:gap-8
            items-start
          "
        >
          <div className="lg:col-span-2 min-w-0">
            <CartItems cartItems={cartItems} />

            <div className="mt-6">
              <Link
                to="/shop"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  border-2
                  border-[#6D4AFF]
                  text-[#6D4AFF]
                  hover:bg-[#6D4AFF]
                  hover:text-white
                  px-5
                  py-2.5
                  rounded-sm
                  font-semibold
                  text-sm
                  sm:text-base
                  transition
                  w-full
                  sm:w-auto
                "
              >
                <ArrowLeft size={18} />
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="w-full">
            <CartSummary cartItems={cartItems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
