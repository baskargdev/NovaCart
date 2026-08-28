import { Link } from "react-router-dom";
import { FolderOpen } from "lucide-react";

import categories from "../data/categories";

const Categories = () => {
  return (
    <section className="bg-white min-h-screen">
      <div className="bg-[#F7F5FF]">
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
                EXPLORE & DISCOVER
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
                Explore Categories
              </h1>

              <p className="text-gray-500 mt-3 max-w-xl">
                Browse our collections and discover products that match your
                style, needs, and lifestyle.
              </p>

              <div className="flex items-center gap-2 mt-4 text-sm">
                <Link to="/" className="text-gray-500 hover:text-[#6D4AFF]">
                  Home
                </Link>

                <span className="text-gray-400">›</span>

                <span className="text-[#6D4AFF] font-medium">Categories</span>
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
                <FolderOpen
                  className="text-white"
                  size={70}
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

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
        <div className="flex items-end justify-between mb-7 md:mb-9">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F1F2E]">
              Shop by Category
            </h2>

            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Find everything you're looking for in one place.
            </p>
          </div>

          <span className="hidden sm:block text-sm text-gray-400">
            {categories.length} Categories
          </span>
        </div>

        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-3
            gap-4
            sm:gap-6
            lg:gap-8
          "
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.slug}`}
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                shadow-md
                hover:shadow-xl
                transition-all
                duration-300
                bg-gray-100
              "
            >
              <img
                src={category.image}
                alt={category.name}
                className="
                  w-full
                  h-40
                  sm:h-52
                  md:h-60
                  lg:h-72
                  object-cover
                  transition-transform
                  duration-500
                  group-hover:scale-105
                "
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6">
                <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold">
                  {category.name}
                </h2>

                <span
                  className="
                    inline-block
                    mt-1
                    text-white/80
                    text-xs
                    sm:text-sm
                    group-hover:text-white
                    transition
                  "
                >
                  Explore Collection →
                </span>
              </div>
            </Link>
          ))}
        </div>

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
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#5A39F3]">
              Find your perfect collection!
            </h2>

            <p className="text-gray-500 text-sm sm:text-base mt-1">
              Explore our categories and discover products made for you.
            </p>
          </div>

          <Link
            to="/shop"
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
            Shop All Products →
          </Link>
        </section>
      </div>
    </section>
  );
};

export default Categories;