import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";

const ProductGallery = ({ product }) => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const wishlisted = isWishlisted(product._id);

  const handleWishlist = () => {
    if (!token) {
      toast.warning("Please login to use wishlist.");
      navigate("/login");
      return;
    }

    toggleWishlist(product._id);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-4 self-start">
      <div className="relative bg-[#F8F8FC] rounded-xl overflow-hidden w-full h-[400px] sm:h-[600px]">
        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="
            absolute
            top-4
            right-4
            z-10
            w-11
            h-11
            rounded-full
            bg-white
            shadow-md
            flex
            items-center
            justify-center
            hover:scale-105
            hover:bg-gray-50
            transition
            cursor-pointer
          "
        >
          <Heart
            size={22}
            strokeWidth={2}
            className={
              wishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-600 hover:text-red-500"
            }
          />
        </button>

        {/* Product Image */}
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
      </div>
    </div>
  );
};

export default ProductGallery;
