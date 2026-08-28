import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart, Trash2, Star } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const WishlistItem = ({ item }) => {
  const navigate = useNavigate();

  const { toggleWishlist } = useWishlist();

  const { fetchCart } = useCart();

  const [loading, setLoading] = useState(false);

  if (!item || !item.product) {
    return null;
  }

  const product = item.product;

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

  const handleRemove = async () => {
    if (loading) return;

    try {
      setLoading(true);
      await toggleWishlist(product._id);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToCart = async () => {
    if (loading) return;

    if (product.stock <= 0) {
      toast.error("Product is out of stock.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axiosInstance.post("/cart", {
        productId: product._id,
        quantity: 1,
      });

      if (!data.success) {
        toast.error(data.message || "Failed to add product to cart.");
        return;
      }

      await fetchCart();

      await toggleWishlist(product._id);

      toast.success("Product moved to cart.");

      navigate("/cart");
    } catch (error) {
      console.error("Move to cart error:", error);

      toast.error(error.response?.data?.message || "Failed to move product.");
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
        rounded-2xl
        shadow-sm
        hover:shadow-md
        transition-all
        duration-300
        p-3
        sm:p-4
        md:p-5

        flex
        flex-col
        min-[500px]:flex-row

        gap-3
        sm:gap-4
        md:gap-6

        items-stretch
      "
    >
      <Link
        to={`/product/${product._id}`}
        className="
          relative
          w-full
          min-[500px]:w-32
          sm:w-55
          md:w-55

          h-48
          min-[500px]:h-40
          sm:h-55
          md:h-55

          shrink-0
          overflow-hidden
          rounded-xl
          bg-[#F8F8FC]
        "
      >
        {discount > 0 && (
          <span
            className="
              absolute
              top-2
              left-2
              sm:top-3
              sm:left-3
              z-10

              bg-red-500
              text-white
              text-[10px]
              sm:text-xs
              font-semibold

              px-2
              sm:px-3
              py-1
              sm:py-1.5

              rounded-full
              shadow-sm
            "
          >
            {discount}% OFF
          </span>
        )}

        <img
          src={product.image}
          alt={product.name}
          className="
            w-full
            h-full
            object-fill

            transition-transform
            duration-300
            hover:scale-105
          "
        />
      </Link>

      <Link
        to={`/product/${product._id}`}
        className="
          flex-1
          min-w-0
          flex
          flex-col
          justify-center
          group
          py-1
        "
      >
        <div>
          <span
            className="
              inline-flex
              items-center
              bg-[#F0ECFF]
              text-[#6D4AFF]

              px-2
              sm:px-2.5
              py-1

              rounded-full

              text-[10px]
              sm:text-xs

              font-bold
              uppercase
              tracking-wide
            "
          >
            {product.brand || "Brand"}
          </span>
        </div>

        <h2
          className="
            text-base
            sm:text-lg
            md:text-xl

            font-semibold
            text-[#1F1F2E]

            mt-2

            line-clamp-2

            group-hover:text-[#6D4AFF]
            transition
          "
        >
          {product.name}
        </h2>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-0.5">
            <Star size={15} className="fill-yellow-400 text-yellow-400" />
          </div>

          <span className="text-sm font-semibold text-[#1F1F2E]">
            {product.rating || 0}
          </span>

          <span className="text-xs sm:text-sm text-gray-500">
            ({product.reviews || 0})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3">
          <span
            className="
              text-xl
              sm:text-2xl
              font-bold
              text-[#6D4AFF]
            "
          >
            {formatCurrency(product.price)}
          </span>

          {product.oldPrice > 0 && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              {formatCurrency(product.oldPrice)}
            </span>
          )}
        </div>

        <div className="mt-2">
          {product.stock > 0 ? (
            <div className="flex items-center gap-1.5 text-green-600 text-xs sm:text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              In Stock
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-red-500 text-xs sm:text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Out of Stock
            </div>
          )}
        </div>
      </Link>

      <div
        className="
          w-full
          min-[500px]:w-40
          sm:w-44
          md:w-48

          shrink-0

          flex
          flex-col
          justify-center

          gap-2
          sm:gap-3

          min-[500px]:border-l
          min-[500px]:border-gray-100

          min-[500px]:pl-3
          sm:pl-4
          md:pl-5
        "
      >
        {/* Move To Cart */}
        <button
          onClick={handleMoveToCart}
          disabled={loading || product.stock <= 0}
          className="
            w-full

            bg-[#6D4AFF]
            hover:bg-[#5936F7]

            disabled:opacity-50
            disabled:cursor-not-allowed

            text-white

            px-3
            sm:px-5

            py-2.5
            sm:py-3

            rounded-sm

            font-semibold

            text-xs
            sm:text-sm

            transition

            flex
            items-center
            justify-center
            gap-2

            cursor-pointer
          "
        >
          <ShoppingCart size={18} />

          {loading ? "Processing..." : "Move to Cart"}
        </button>

        <button
          onClick={handleRemove}
          disabled={loading}
          className="
            w-full

            border
            border-red-500

            text-red-500

            hover:bg-red-500
            hover:text-white

            disabled:opacity-50
            disabled:cursor-not-allowed

            px-3
            sm:px-5

            py-2.5
            sm:py-3

            rounded-sm

            font-semibold

            text-xs
            sm:text-sm

            transition

            flex
            items-center
            justify-center
            gap-2

            cursor-pointer
          "
        >
          <Trash2 size={18} />
          Remove
        </button>
      </div>
    </div>
  );
};

export default WishlistItem;
