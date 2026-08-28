import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

const ShopPromoBanner = () => {
  return (
    <section
      className="
        mt-12
        rounded-2xl
        bg-[#F7F5FF]
        border
        border-purple-100
        px-5
        py-6
        sm:px-8
        sm:py-8
        flex
        flex-col
        sm:flex-row
        sm:items-center
        sm:justify-between
        gap-5
      "
    >
      <div className="flex items-center gap-4">
        <div
          className="
            hidden
            sm:flex
            w-14
            h-14
            rounded-full
            bg-white
            items-center
            justify-center
          "
        >
          <ShoppingBag className="text-[#6D4AFF]" size={28} />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#5A39F3]">
            Discover something for everyone!
          </h2>

          <p className="text-gray-500 text-sm sm:text-base mt-1">
            Explore our complete collection and find your next favorite product.
          </p>
        </div>
      </div>

      <Link
        to="/categories"
        className="
          inline-flex
          items-center
          justify-center
          bg-[#6D4AFF]
          hover:bg-[#5936F7]
          text-white
          px-6
          py-3
          rounded-xl
          font-semibold
          transition
          whitespace-nowrap
        "
      >
        Explore Categories →
      </Link>
    </section>
  );
};

export default ShopPromoBanner;
