import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/shop/ProductCard";
import Pagination from "../components/shop/Pagination";

import categories from "../data/categories";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [sortOpen, setSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const limit = 12;

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        params.set("newArrivals", "true");
        params.set("page", currentPage);
        params.set("limit", limit);
        params.set("sort", sort);

        if (category) {
          params.set("category", category);
        }

        const { data } = await axiosInstance.get(
          `/product?${params.toString()}`,
        );

        if (data.success) {
          setProducts(data.products);
          setTotalPages(data.totalPages);
          setTotalProducts(data.totalProducts);
        }
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, [category, currentPage, sort]);

  const handleCategoryChange = (slug) => {
    setCategory(slug);
    setCurrentPage(1);
  };

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <p className="text-[#6D4AFF] font-semibold text-sm mb-2">
                JUST ARRIVED
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
                New Arrivals
              </h1>

              <p className="text-gray-500 mt-3 max-w-xl">
                Explore the latest products just added to NovaCart.
              </p>

              <div className="flex items-center gap-2 mt-4 text-sm">
                <Link to="/" className="text-gray-500 hover:text-[#6D4AFF]">
                  Home
                </Link>

                <span className="text-gray-400">›</span>

                <span className="text-[#6D4AFF] font-medium">New Arrivals</span>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div
                className="
                  w-36
                  h-36
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
                <span className="text-white text-3xl lg:text-4xl font-bold">
                  NEW
                </span>
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
          py-8
          md:py-10
        "
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-[#1F1F2E]">
                {products.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#1F1F2E]">
                {totalProducts}
              </span>{" "}
              new arrivals
            </p>

            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-500 whitespace-nowrap">
                Sort by:
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen((prev) => !prev)}
                  className="
                    min-w-[190px]
                    flex
                    items-center
                    justify-between
                    gap-4
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-[#1F1F2E]
                    shadow-sm
                    transition
                    hover:border-[#6D4AFF]
                    hover:shadow-md
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#6D4AFF]/20
                  "
                  aria-haspopup="listbox"
                  aria-expanded={sortOpen}
                >
                  <span>
                    {
                      {
                        "-createdAt": "Latest",
                        price: "Price: Low to High",
                        "-price": "Price: High to Low",
                        "-rating": "Highest Rated",
                      }[sort]
                    }
                  </span>

                  <ChevronDown
                    size={17}
                    className={`text-gray-500 transition-transform duration-200 ${
                      sortOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {sortOpen && (
                  <div
                    className="
                      absolute
                      right-0
                      z-30
                      mt-2
                      w-[230px]
                      overflow-hidden
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      p-1.5
                      shadow-xl
                      ring-1
                      ring-black/5
                    "
                    role="listbox"
                  >
                    {[
                      { value: "-createdAt", label: "Latest" },
                      { value: "price", label: "Price: Low to High" },
                      { value: "-price", label: "Price: High to Low" },
                      { value: "-rating", label: "Highest Rated" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSort(option.value);
                          setCurrentPage(1);
                          setSortOpen(false);
                        }}
                        className={`
                          w-full
                          rounded-lg
                          px-3
                          py-2.5
                          text-left
                          text-sm
                          transition
                          ${
                            sort === option.value
                              ? "bg-[#F3F0FF] font-semibold text-[#6D4AFF]"
                              : "text-gray-700 hover:bg-gray-50"
                          }
                        `}
                        role="option"
                        aria-selected={sort === option.value}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className="
              flex
              gap-3
              overflow-x-auto
              pb-2
              scrollbar-hide
            "
          >
            <button
              onClick={() => handleCategoryChange("")}
              className={`
                shrink-0
                px-5
                py-2.5
                rounded-xl
                border
                text-sm
                font-medium
                transition
                ${
                  category === ""
                    ? "bg-[#6D4AFF] text-white border-[#6D4AFF]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#6D4AFF] hover:text-[#6D4AFF]"
                }
              `}
            >
              All
            </button>

            {categories.map((item) => (
              <button
                key={item.id}
                onClick={() => handleCategoryChange(item.slug)}
                className={`
                  shrink-0
                  px-5
                  py-2.5
                  rounded-xl
                  border
                  text-sm
                  font-medium
                  transition
                  ${
                    category === item.slug
                      ? "bg-[#6D4AFF] text-white border-[#6D4AFF]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#6D4AFF] hover:text-[#6D4AFF]"
                  }
                `}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div
                  className="
                    w-10
                    h-10
                    border-4
                    border-[#6D4AFF]
                    border-t-transparent
                    rounded-full
                    animate-spin
                    mx-auto
                  "
                />

                <p className="mt-4 text-gray-500">Loading New Arrivals...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div
              className="
                min-h-[400px]
                flex
                items-center
                justify-center
                border
                border-gray-200
                rounded-2xl
              "
            >
              <div className="text-center px-6">
                <h2 className="text-xl font-semibold text-[#1F1F2E]">
                  No New Arrivals
                </h2>

                <p className="text-gray-500 mt-2">
                  No new products are available in this category right now.
                </p>
              </div>
            </div>
          ) : (
            <div className=" grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8 md:gap-10 ">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} isNew />
              ))}
            </div>
          )}
        </div>

        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        <div
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
              New products every week!
            </h2>

            <p className="text-gray-500 text-sm sm:text-base mt-1">
              Stay tuned and discover the latest arrivals before anyone else.
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
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
