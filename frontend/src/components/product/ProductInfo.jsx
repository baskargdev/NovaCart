import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { ShoppingCart, Zap, Star, Minus, Plus } from "lucide-react";

import axiosInstance from "../../api/axiosInstance";

import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import { useCart } from "../../context/CartContext";

const ProductInfo = ({ product }) => {
  const navigate = useNavigate();

  const { token } = useAuth();

  const { fetchCart } = useCart();

  const [quantity, setQuantity] = useState(1);

  const [addingToCart, setAddingToCart] = useState(false);

  // Indian Rupee formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  // Discount calculation
  const discount =
    product.oldPrice > 0
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100,
        )
      : 0;

  // Increase quantity
  const increaseQty = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  // Decrease quantity
  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Add to Cart
  const handleAddToCart = async () => {
    if (!token) {
      toast.warning("Please login to continue.");
      navigate("/login");
      return false;
    }

    if (product.stock <= 0) {
      toast.error("Product is out of stock.");
      return false;
    }

    if (addingToCart) return false;

    try {
      setAddingToCart(true);

      const { data } = await axiosInstance.post("/cart", {
        productId: product._id,
        quantity,
      });

      if (data.success) {
        // Update CartContext immediately
        await fetchCart();

        toast.success("Product added to cart.");

        return true;
      }

      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product.");

      return false;
    } finally {
      setAddingToCart(false);
    }
  };

  // Buy Now
  const handleBuyNow = async () => {
    const added = await handleAddToCart();

    if (added) {
      navigate("/checkout");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-7">
      {/* ================= BRAND ================= */}
      <div className="inline-flex">
        <span
          className="
            inline-flex
            items-center
            bg-[#F0ECFF]
            text-[#6D4AFF]
            px-3
            py-1.5
            rounded-full
            text-sm
            font-bold
            uppercase
            tracking-wider
          "
        >
          {product.brand || "Brand"}
        </span>
      </div>

      {/* ================= PRODUCT NAME ================= */}
      <div className="mt-4">
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-[#1F1F2E]">
          {product.name}
        </h1>
      </div>

      {/* ================= RATING ================= */}
      <div className="flex items-center gap-2 mt-4">
        <Star size={19} className="fill-yellow-400 text-yellow-400" />

        <span className="font-semibold text-[#1F1F2E]">
          {product.rating || 0}
        </span>

        <span className="text-gray-500">({product.reviews || 0} Reviews)</span>
      </div>

      {/* ================= PRICE ================= */}
      <div className="flex flex-wrap items-center gap-4 mt-5">
        <span className="text-3xl sm:text-4xl font-bold text-[#6D4AFF]">
          {formatCurrency(product.price)}
        </span>

        {product.oldPrice > 0 && (
          <>
            <span className="text-lg sm:text-xl text-gray-400 line-through">
              {formatCurrency(product.oldPrice)}
            </span>

            {discount > 0 && (
              <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-sm font-semibold">
                {discount}% OFF
              </span>
            )}
          </>
        )}
      </div>

      {/* ================= STOCK ================= */}
      <div className="mt-5">
        {product.stock > 0 ? (
          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />

            <span>In Stock</span>

            <span className="text-gray-300">|</span>

            <span className="text-gray-600 font-normal">
              {product.stock} items available
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-600 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />

            <span>Out of Stock</span>
          </div>
        )}
      </div>

      {/* ================= DESCRIPTION ================= */}
      <div className="mt-6">
        <h2 className="font-semibold text-lg mb-2">Description</h2>

        <p className="text-gray-600 leading-7">{product.description}</p>
      </div>

      {/* ================= QUANTITY ================= */}
      <div className="mt-6">
        <h2 className="font-semibold mb-3">Quantity</h2>

        <div className="flex items-center">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            {/* Minus */}
            <button
              onClick={decreaseQty}
              disabled={quantity <= 1 || product.stock <= 0}
              className="
                w-12
                h-10
                flex
                items-center
                justify-center
                hover:bg-gray-100
                transition
                cursor-pointer
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
            >
              <Minus size={18} />
            </button>

            {/* Quantity */}
            <div
              className="
                w-12
                h-10
                border-x
                border-gray-200
                flex
                items-center
                justify-center
                font-semibold
              "
            >
              {quantity}
            </div>

            {/* Plus */}
            <button
              onClick={increaseQty}
              disabled={quantity >= product.stock || product.stock <= 0}
              className="
                w-12
                h-10
                flex
                items-center
                justify-center
                hover:bg-gray-100
                transition
                cursor-pointer
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <div className="flex flex-col sm:flex-row gap-4 mt-7">
        {/* Add To Cart */}
        <button
          onClick={handleAddToCart}
          disabled={addingToCart || product.stock <= 0}
          className="
            flex-1
            bg-[#6D4AFF]
            hover:bg-[#5A39F3]
            disabled:opacity-60
            disabled:cursor-not-allowed
            text-white
            py-4
            rounded-sm
            flex
            items-center
            justify-center
            gap-2
            font-semibold
            text-base
            transition
            cursor-pointer
          "
        >
          <ShoppingCart size={20} />

          {addingToCart
            ? "Adding..."
            : product.stock <= 0
              ? "Out of Stock"
              : "Add to Cart"}
        </button>

        {/* Buy Now */}
        <button
          onClick={handleBuyNow}
          disabled={addingToCart || product.stock <= 0}
          className="
            flex-1
            bg-[#F7254F]
            hover:bg-[#E31643]
            disabled:opacity-60
            disabled:cursor-not-allowed
            text-white
            py-4
            rounded-sm
            flex
            items-center
            justify-center
            gap-2
            font-semibold
            text-base
            transition
            cursor-pointer
          "
        >
          <Zap size={20} />

          {product.stock <= 0 ? "Out of Stock" : "Buy Now"}
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
