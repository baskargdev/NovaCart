import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

const ShopHero = () => {
  return (
    <section className="bg-[#F7F5FF]">
      <div
        className="
          max-w-[1800px]
          mx-auto
          px-4
          sm:px-6
          lg:px-10
          xl:px-12
          py-10
          md:py-14
        "
      >
        <div className="flex items-center justify-between gap-8">
          <div>
            <p className="text-[#6D4AFF] font-semibold text-sm mb-2">
              DISCOVER MORE
            </p>

            <h1
              className="
                text-3xl
                sm:text-4xl
                lg:text-5xl
                font-bold
                text-[#1F1F2E]
              "
            >
              Shop All Products
            </h1>

            <p className="text-gray-500 mt-3 max-w-xl">
              Discover amazing products across every category, all in one place.
            </p>

            <div className="flex items-center gap-2 mt-4 text-sm">
              <Link to="/" className="text-gray-500 hover:text-[#6D4AFF]">
                Home
              </Link>

              <span className="text-gray-400">›</span>

              <span className="text-[#6D4AFF] font-medium">Shop</span>
            </div>
          </div>

          <div className="hidden sm:flex">
            <div
              className="
                w-28
                h-28
                md:w-36
                md:h-36
                lg:w-44
                lg:h-44
                rounded-full
                bg-[#6D4AFF]
                flex
                items-center
                justify-center
                shadow-lg
                shadow-purple-200
              "
            >
              <ShoppingBag className="text-white" size={70} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopHero;
