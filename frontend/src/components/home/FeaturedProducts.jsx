import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import axiosInstance from "../../api/axiosInstance";

import ProductCard from "../shop/ProductCard";

const PRODUCTS_PER_PAGE = 12;

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const [totalProducts, setTotalProducts] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get(
          `/product?featured=true&page=${currentPage}&limit=${PRODUCTS_PER_PAGE}`,
        );

        if (response.data.success) {
          setFeaturedProducts(response.data.products || []);

          setTotalProducts(response.data.totalProducts || 0);

          setTotalPages(response.data.totalPages || 0);
        }
      } catch (error) {
        console.error("Failed to fetch featured products:", error);

        setFeaturedProducts([]);
        setTotalProducts(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [currentPage]);

  // Loading
  if (loading) {
    return (
      <section className="max-w-[1800px] mx-auto px-4 lg:px-10 xl:px-12 py-12">
        <h2 className="text-2xl lg:text-4xl font-bold">Featured Products</h2>

        <p className="mt-4">Loading...</p>
      </section>
    );
  }

  return (
    <section className="max-w-[1800px] mx-auto px-4 lg:px-10 xl:px-12 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl lg:text-4xl font-bold text-[#1F1F2E]">
            Featured Products
          </h2>

          <p className="mt-2 text-gray-500">Handpicked products just for you</p>
        </div>

        <Link
          to="/shop"
          className="hidden md:block font-semibold text-[#6D4AFF] hover:underline"
        >
          View All →
        </Link>
      </div>

      {/* No Featured Products */}
      {featuredProducts.length === 0 ? (
        <div className="py-16 text-center border border-gray-200 rounded-2xl">
          <p className="text-gray-500">No featured products available.</p>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className=" grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-1 sm:gap-8 md:gap-10 ">
            
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Product Count */}
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-700">
                  {Math.min(currentPage * PRODUCTS_PER_PAGE, totalProducts)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {totalProducts}
                </span>{" "}
                products
              </p>

              {/* Pagination Buttons */}
              <div className="flex items-center gap-2">
                {/* Previous */}
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="
                    px-4
                    py-2
                    rounded-lg
                    border
                    border-gray-200
                    text-sm
                    font-medium
                    text-gray-600
                    hover:border-[#6D4AFF]
                    hover:text-[#6D4AFF]
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    transition
                    cursor-pointer
                  "
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`
                        w-9
                        h-9
                        rounded-lg
                        text-sm
                        font-medium
                        transition
                        cursor-pointer
                        ${
                          currentPage === page
                            ? "bg-[#6D4AFF] text-white"
                            : "text-gray-600 hover:bg-purple-50 hover:text-[#6D4AFF]"
                        }
                      `}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next */}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="
                    px-4
                    py-2
                    rounded-lg
                    border
                    border-gray-200
                    text-sm
                    font-medium
                    text-gray-600
                    hover:border-[#6D4AFF]
                    hover:text-[#6D4AFF]
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    transition
                    cursor-pointer
                  "
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default FeaturedProducts;
