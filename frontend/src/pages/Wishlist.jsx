import { Link } from "react-router-dom";

import { Heart } from "lucide-react";

import { useWishlist } from "../context/WishlistContext";

import WishlistItem from "../components/wishlist/WishlistItem";

const Wishlist = () => {
  const { wishlist } = useWishlist();

  // Remove invalid/null wishlist entries
  const validWishlist = (wishlist || []).filter((item) => item && item.product);

  // Empty Wishlist
  if (validWishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="min-h-[55vh] flex flex-col items-center justify-center text-center">
          {/* Heart Icon */}
          <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mb-6">
            <Heart size={40} className="text-[#6D4AFF]" strokeWidth={2} />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-[#1F1F2E]">
            Your Wishlist is Empty
          </h1>

          {/* Description */}
          <p className="text-gray-500 mt-3 max-w-md">
            Add your favourite products to your wishlist and find them easily
            whenever you want.
          </p>

          {/* Continue Shopping */}
          <Link
            to="/shop"
            className="
              mt-6
              bg-[#6D4AFF]
              hover:bg-[#5936F7]
              text-white
              px-6
              py-3
              rounded-xl
              font-semibold
              transition
              cursor-pointer
            "
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9FF]">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        {/* ================= WISHLIST HEADER ================= */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-4">
            {/* Heart Icon */}
            <div
              className="
                w-4
                h-4
                sm:w-14
                sm:h-14
                rounded-full
                bg-gradient-to-br
                from-[#FF4B8B]
                to-[#6D4AFF]
                flex
                items-center
                justify-center
                shadow-md
                flex-shrink-0
              "
            >
              <Heart
                size={30}
                className="fill-white text-white sm:w-8 sm:h-8"
                strokeWidth={2}
              />
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#11152B]">
                My Wishlist
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-sm sm:text-base text-gray-500">
                  {validWishlist.length}{" "}
                  {validWishlist.length === 1 ? "item" : "items"} saved for
                  later
                </p>

                <span className="text-gray-400">•</span>

                <p className="text-sm sm:text-base text-gray-500">
                  Move items to cart and shop now!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= WISHLIST ITEMS ================= */}
        <div className="space-y-4 sm:space-y-5">
          {validWishlist.map((item) => (
            <WishlistItem key={item._id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
