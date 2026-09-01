import { useState } from "react";

import { Heart, ShoppingCart, Star } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import axiosInstance from "../../api/axiosInstance";

import { useAuth } from "../../context/AuthContext";

import { useWishlist } from "../../context/WishlistContext";

import { useCart } from "../../context/CartContext";

const ProductCard = ({ product, isNew = false }) => {
  const { token } = useAuth();

  const { toggleWishlist, isWishlisted } = useWishlist();

  const { fetchCart } = useCart();

  const navigate = useNavigate();

  const [addingToCart, setAddingToCart] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  const discount =
    product.oldPrice > 0
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100,
        )
      : 0;

  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = async () => {
    if (!token) {
      toast.warning("Please login to add products to your cart.");
      navigate("/login");
      return;
    }

    if (addingToCart) return;

    try {
      setAddingToCart(true);

      const { data } = await axiosInstance.post("/cart", {
        productId: product._id,
        quantity: 1,
      });

      if (data.success) {
        await fetchCart();
        toast.success("Product added to cart!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = () => {
    if (!token) {
      toast.warning("Please login to use wishlist.");
      navigate("/login");
      return;
    }

    toggleWishlist(product._id);
  };

  return (
    <div
      className="
        group
        bg-white
        rounded-2xl
        border border-gray-100
        shadow-sm
        hover:shadow-lg
        transition-all
        duration-300
        overflow-hidden
        flex
        flex-col
        h-full
      "
    >
      {/* Product Image */}
      <div className="relative bg-[#F8F8FA] overflow-hidden">
        {/* NEW / DISCOUNT */}
        {isNew ? (
          <span
            className="
              absolute
              top-3
              left-3
              z-10
              bg-[#6D4AFF]
              text-white
              text-xs
              font-semibold
              px-3
              py-1.5
              rounded-full
              shadow-sm
            "
          >
            NEW
          </span>
        ) : (
          discount > 0 && (
            <span
              className="
                absolute
                top-3
                left-3
                z-10
                bg-red-500
                text-white
                text-xs
                font-semibold
                px-3
                py-1.5
                rounded-full
                shadow-sm
              "
            >
              {discount}% OFF
            </span>
          )
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="
            absolute
            top-3
            right-3
            z-10
            w-9
            h-9
            flex
            items-center
            justify-center
            bg-white
            rounded-full
            shadow-md
            hover:scale-110
            transition
            cursor-pointer
          "
        >
          <Heart
            size={19}
            strokeWidth={2}
            className={
              wishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-500 hover:text-red-500"
            }
          />
        </button>

        {/* Product Image */}
        <Link to={`/product/${product._id}`}>
          <div className="h-52 sm:h-56 w-full overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="
                h-full
                w-full
                object-fill
                transition-transform
                duration-300
                group-hover:scale-105
              "
            />
          </div>
        </Link>
      </div>

      {/* Product Content */}
      <div className="flex flex-col flex-1 p-4">
        <Link to={`/product/${product._id}`} className="flex flex-col flex-1">
          {/* Brand */}
          <div>
            <span
              className="
                inline-flex
                items-center
                bg-[#F0ECFF]
                text-[#6D4AFF]
                text-[10px]
                sm:text-xs
                font-semibold
                px-2.5
                py-1
                rounded-full
                uppercase
                tracking-wide
              "
            >
              {product.brand || "Brand"}
            </span>
          </div>

          {/* Product Name */}
          <h3
            className="
              font-semibold
              text-sm
              sm:text-base
              text-[#1F1F2E]
              mt-2
              line-clamp-2
              min-h-[40px]
              hover:text-[#6D4AFF]
              transition
            "
          >
            {product.name}
          </h3>

          {/* Description */}
          <p
            className="
              text-xs
              text-gray-500
              mt-1
              line-clamp-1
            "
          >
            {product.shortDescription || "Premium Quality Product"}
          </p>

          {/* Rating + Reviews */}
          <div
            className="
              flex
              items-center
              gap-1.5
              mt-1.5
              whitespace-nowrap
              overflow-hidden
            "
          >
            <Star
              size={14}
              className="fill-yellow-400 text-yellow-400 shrink-0"
            />

            <span className="text-sm font-semibold text-[#1F1F2E] shrink-0">
              {product.rating}
            </span>

            <span className="text-[11px] sm:text-xs text-gray-500 truncate">
              ({product.reviews} Reviews)
            </span>
          </div>

          {/* Price */}
          <div className="sm:mt-2">
            {/* Current Price */}
            <div>
              <span className="text-sm sm:text-xl font-bold text-[#6D4AFF]">
                {formatCurrency(product.price)}
              </span>
            </div>

            {/* Old Price + Discount */}
            {product.oldPrice > 0 && (
              <div className="flex items-center gap-2 mt-1 whitespace-nowrap">
                <span className="text-xs sm:text-sm text-gray-400 line-through">
                  {formatCurrency(product.oldPrice)}
                </span>

                {discount > 0 && (
                  <span
                    className="
            bg-red-50
            text-red-500
            text-[10px]
            sm:text-xs
            font-semibold
            px-2
            py-1
            rounded-full
            whitespace-nowrap
          "
                  >
                    {discount}% OFF
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Stock */}
          <div className="mt-1 mb-1">
            {product.stock > 0 ? (
              <div className="flex items-center gap-1.5 text-green-600 text-xs sm:text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                In Stock
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-red-500 text-xs sm:text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                Out of Stock
              </div>
            )}
          </div>
        </Link>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={addingToCart || product.stock <= 0}
          className="
            mt-auto
            pt-2
            flex
            items-center
            justify-center
            gap-2
            w-full
            bg-[#6D4AFF]
            hover:bg-[#5936F7]
            disabled:opacity-60
            disabled:cursor-not-allowed
            text-white
            rounded-sm
            py-2.5
            sm:py-3
            text-sm
            sm:text-base
            font-semibold
            transition
            cursor-pointer
          "
        >
          <ShoppingCart size={17} />

          {addingToCart
            ? "Adding..."
            : product.stock <= 0
              ? "Out of Stock"
              : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
