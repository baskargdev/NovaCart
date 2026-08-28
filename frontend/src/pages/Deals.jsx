import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Tag } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/shop/ProductCard";
import Pagination from "../components/shop/Pagination";

const Deals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("discount");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);

  const PRODUCTS_PER_PAGE = 12;

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);

        const { data } = await axiosInstance.get("/product?limit=100");

        if (data.success) {
          const dealProducts = data.products.filter(
            (product) => Number(product.oldPrice) > Number(product.price),
          );

          setProducts(dealProducts);
        }
      } catch (error) {
        console.error("Failed to load deals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const sortedProducts = useMemo(() => {
    const result = [...products];

    switch (sort) {
      case "discount":
        result.sort((a, b) => {
          const discountA = ((a.oldPrice - a.price) / a.oldPrice) * 100;

          const discountB = ((b.oldPrice - b.price) / b.oldPrice) * 100;

          return discountB - discountA;
        });
        break;

      case "priceLow":
        result.sort((a, b) => a.price - b.price);
        break;

      case "priceHigh":
        result.sort((a, b) => b.price - a.price);
        break;

      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;

      default:
        break;
    }

    return result;
  }, [products, sort]);

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;

    const endIndex = startIndex + PRODUCTS_PER_PAGE;

    return sortedProducts.slice(startIndex, endIndex);
  }, [sortedProducts, page]);

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSortChange = (value) => {
    setSort(value);
    setPage(1);
  };

  const firstResult =
    sortedProducts.length === 0 ? 0 : (page - 1) * PRODUCTS_PER_PAGE + 1;

  const lastResult = Math.min(page * PRODUCTS_PER_PAGE, sortedProducts.length);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#6D4AFF] border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500 font-medium">Loading Deals...</p>
        </div>
      </div>
    );
  }

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
                LIMITED TIME OFFERS
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
                Today's Best Deals
              </h1>

              <p className="text-gray-500 mt-3 max-w-xl">
                Save more on products you love with our limited-time offers.
              </p>

              <div className="flex items-center gap-2 mt-4 text-sm">
                <Link to="/" className="text-gray-500 hover:text-[#6D4AFF]">
                  Home
                </Link>

                <span className="text-gray-400">›</span>

                <span className="text-[#6D4AFF] font-medium">Deals</span>
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
                <Tag className="text-white" size={70} strokeWidth={1.5} />
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
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F1F2E]">
              Hot Deals
            </h2>

            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Grab these offers before they're gone.
            </p>

            <p className="text-sm text-gray-400 mt-2">
              {sortedProducts.length} Deals Available
            </p>
          </div>

          {sortedProducts.length > 0 && (
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-500 whitespace-nowrap">
                Sort by
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen((prev) => !prev)}
                  className="
                    min-w-[190px] flex items-center justify-between gap-4
                    rounded-xl border border-gray-200 bg-white px-4 py-2.5
                    text-sm font-medium text-[#1F1F2E] shadow-sm transition
                    hover:border-[#6D4AFF] hover:shadow-md
                    focus:outline-none focus:ring-2 focus:ring-[#6D4AFF]/20
                  "
                  aria-haspopup="listbox"
                  aria-expanded={sortOpen}
                >
                  <span>
                    {
                      {
                        discount: "Biggest Discount",
                        priceLow: "Price: Low → High",
                        priceHigh: "Price: High → Low",
                        rating: "Highest Rated",
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
                      absolute right-0 z-30 mt-2 w-[230px] overflow-hidden
                      rounded-xl border border-gray-200 bg-white p-1.5
                      shadow-xl ring-1 ring-black/5
                    "
                    role="listbox"
                  >
                    {[
                      { value: "discount", label: "Biggest Discount" },
                      { value: "priceLow", label: "Price: Low → High" },
                      { value: "priceHigh", label: "Price: High → Low" },
                      { value: "rating", label: "Highest Rated" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          handleSortChange(option.value);
                          setSortOpen(false);
                        }}
                        className={`
                          w-full rounded-lg px-3 py-2.5 text-left text-sm
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
          )}
        </div>

        {sortedProducts.length > 0 && (
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">
              Showing {firstResult}-{lastResult} of {sortedProducts.length}{" "}
              deals
            </p>

            {totalPages > 0 && (
              <p className="hidden sm:block text-sm text-gray-500">
                Page {page} of {totalPages}
              </p>
            )}
          </div>
        )}

        {sortedProducts.length === 0 ? (
          <div
            className="
              min-h-[400px]
              flex
              items-center
              justify-center
              border
              border-gray-200
              rounded-2xl
              bg-white
            "
          >
            <div className="text-center px-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#1F1F2E]">
                No Deals Available
              </h2>

              <p className="text-gray-500 mt-2">
                Check back soon for exciting offers.
              </p>
            </div>
          </div>
        ) : (
          <>

            <div className=" grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-1 sm:gap-8 md:gap-8 ">
              {paginatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>


            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            )}
          </>
        )}

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
              Don't miss the deals!
            </h2>

            <p className="text-gray-500 text-sm sm:text-base mt-1">
              Limited-time offers are waiting for you. Shop before they
              disappear.
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

export default Deals;
