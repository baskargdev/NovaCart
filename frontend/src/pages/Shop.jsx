import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";

import axiosInstance from "../api/axiosInstance";

import ShopHeader from "../components/shop/ShopHeader";
import ShopSidebar from "../components/shop/ShopSidebar";
import ProductCard from "../components/shop/ProductCard";
import Pagination from "../components/shop/Pagination";
import ShopHero from "../components/shop/ShopHero";
import ShopPromoBanner from "../components/shop/ShopPromoBanner";

const categories = [
  "fashion",
  "electronics",
  "home",
  "beauty",
  "sports",
  "toys",
  "bags-accessories",
  "footwear",
  "books-stationery",
];

const Shop = () => {
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");
  const search = searchParams.get("search");

  // Products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Sorting
  const [sort, setSort] = useState("newest");

  // Applied Filters
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    brand: "",
    minRating: "",
    inStock: "",
  });

  // Mobile filter draft
  const [mobileFilters, setMobileFilters] = useState(filters);

  // Mobile panels
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  // Products per page
  const PRODUCTS_PER_PAGE = 12;

  // Fetch Products
  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (category) {
          params.set("category", category);
        }

        if (search) {
          params.set("search", search);
        }

        if (filters.minPrice) {
          params.set("minPrice", filters.minPrice);
        }

        if (filters.maxPrice) {
          params.set("maxPrice", filters.maxPrice);
        }

        if (filters.brand) {
          params.set("brand", filters.brand);
        }

        if (filters.minRating) {
          params.set("minRating", filters.minRating);
        }

        if (filters.inStock) {
          params.set("inStock", filters.inStock);
        }

        params.set("sort", sort);
        params.set("page", String(page));
        params.set("limit", String(PRODUCTS_PER_PAGE));

        const { data } = await axiosInstance.get(
          `/product?${params.toString()}`,
        );

        // Ignore old request if a newer request has started
        if (cancelled) return;

        if (data.success) {
          setProducts(data.products || []);
          setTotalProducts(data.totalProducts || 0);
          setTotalPages(data.totalPages || 0);
        } else {
          setProducts([]);
          setTotalProducts(0);
          setTotalPages(0);
        }
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to fetch products:", error);

        setProducts([]);
        setTotalProducts(0);
        setTotalPages(0);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    // Cancel/ignore previous request when dependencies change
    return () => {
      cancelled = true;
    };
  }, [category, search, filters, sort, page]);

  // Reset page when category changes
  useEffect(() => {
    setPage(1);
  }, [category, search]);

  // Update desktop filters
  const updateFilters = (newFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    const emptyFilters = {
      minPrice: "",
      maxPrice: "",
      brand: "",
      minRating: "",
      inStock: "",
    };

    setPage(1);
    setFilters(emptyFilters);
    setMobileFilters(emptyFilters);
  };

  // Open mobile filters
  const openFilters = () => {
    setMobileFilters(filters);
    setShowFilters(true);
  };

  // Close mobile filters
  const closeFilters = () => {
    setMobileFilters(filters);
    setShowFilters(false);
  };

  // Apply mobile filters
  const applyMobileFilters = () => {
    setFilters(mobileFilters);
    setPage(1);
    setShowFilters(false);
  };

  // Clear mobile filters
  const clearMobileFilters = () => {
    const emptyFilters = {
      minPrice: "",
      maxPrice: "",
      brand: "",
      minRating: "",
      inStock: "",
    };

    setMobileFilters(emptyFilters);
    setFilters(emptyFilters);
    setPage(1);
    setShowFilters(false);
  };

  // Open mobile sort
  const openSort = () => {
    setShowSort(true);
  };

  // Close mobile sort
  const closeSort = () => {
    setShowSort(false);
  };

  // Change sorting
  const handleSortChange = (value) => {
    setPage(1);
    setSort(value);
    setShowSort(false);
  };

  // Pagination
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

  // Result range
  const firstResult =
    totalProducts === 0 ? 0 : (page - 1) * PRODUCTS_PER_PAGE + 1;

  const lastResult = Math.min(page * PRODUCTS_PER_PAGE, totalProducts);

  return (
    <>
      {/* ============================= */}
      {/* SHOP HERO */}
      {/* ============================= */}

      <ShopHero />

      {/* ============================= */}
      {/* SHOP CONTENT */}
      {/* ============================= */}

      <section
        className="
        max-w-[1800px]
        mx-auto
        px-4
        sm:px-6
        lg:px-10
        xl:px-12
        py-8
        lg:py-10
      "
      >
        {/* Header */}
        <ShopHeader
          title={category ? `${category} Products` : "All Products"}
          productCount={totalProducts}
          sort={sort}
          setSort={handleSortChange}
          onOpenFilters={openFilters}
          onOpenSort={openSort}
        />

        {/* Desktop Sidebar + Products */}
        <div className="flex gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <ShopSidebar
            filters={filters}
            setFilters={updateFilters}
            clearFilters={clearFilters}
          />

          {/* Products */}
          <div className="flex-1 min-w-0">
            {/* Results */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                {loading
                  ? "Loading products..."
                  : totalProducts === 0
                    ? "No products found"
                    : `Showing ${firstResult}-${lastResult} of ${totalProducts} products`}
              </p>

              {totalPages > 0 && (
                <p className="hidden sm:block text-sm text-gray-500">
                  Page {page} of {totalPages}
                </p>
              )}
            </div>

            {/* Loading Skeleton */}
            {loading ? (
              <div
                className="
                grid
                grid-cols-2
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                gap-3
                sm:gap-4
                md:gap-6
              "
              >
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="
                    bg-white
                    border
                    border-gray-100
                    rounded-2xl
                    overflow-hidden
                    animate-pulse
                  "
                  >
                    <div className="h-52 bg-gray-200" />

                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-gray-200 rounded w-1/3" />

                      <div className="h-5 bg-gray-200 rounded w-4/5" />

                      <div className="h-3 bg-gray-200 rounded w-full" />

                      <div className="h-6 bg-gray-200 rounded w-1/2" />

                      <div className="h-11 bg-gray-200 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <div
                className="
                min-h-[400px]
                flex
                flex-col
                items-center
                justify-center
                border
                border-gray-200
                rounded-2xl
                bg-white
                text-center
                px-6
              "
              >
                <h2 className="text-xl font-semibold text-[#1F1F2E]">
                  No products found
                </h2>

                <p className="text-gray-500 mt-2">
                  Try changing your filters or category.
                </p>

                <button
                  onClick={clearFilters}
                  className="
                  mt-5
                  px-5
                  py-2.5
                  rounded-xl
                  bg-[#6D4AFF]
                  text-white
                  hover:bg-[#5936F7]
                  transition
                "
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <div
                  className="
                  grid
                  grid-cols-2
                  sm:grid-cols-3
                  xl:grid-cols-4
                  gap-1
                  sm:gap-8
                  md:gap-10
                "
                >
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* ============================= */}
        {/* SHOP PROMOTIONAL BANNER */}
        {/* ============================= */}

        <ShopPromoBanner />
      </section>

      {/* ============================= */}
      {/* MOBILE FILTER BOTTOM SHEET */}
      {/* ============================= */}

      {showFilters && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Overlay */}
          <button
            onClick={closeFilters}
            className="absolute inset-0 bg-black/40 cursor-default"
            aria-label="Close filters"
          />

          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-xl font-bold text-[#1F1F2E]">Filters</h2>

              <div className="flex items-center gap-4">
                <button
                  onClick={clearMobileFilters}
                  className="text-sm font-medium text-[#6D4AFF]"
                >
                  Clear All
                </button>

                <button
                  onClick={closeFilters}
                  className="
                  w-9
                  h-9
                  rounded-full
                  bg-gray-100
                  flex
                  items-center
                  justify-center
                "
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Filter Content */}
            <div className="overflow-y-auto px-5 py-5 space-y-7">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-[#1F1F2E] mb-4">
                  Categories
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      window.location.href = "/shop";
                    }}
                    className={`border rounded-xl px-3 py-2.5 text-sm capitalize ${
                      !category
                        ? "border-[#6D4AFF] bg-purple-50 text-[#6D4AFF] font-medium"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    All Products
                  </button>

                  {categories.map((itemCategory) => (
                    <button
                      key={itemCategory}
                      onClick={() => {
                        window.location.href = `/shop?category=${itemCategory}`;
                      }}
                      className={`border rounded-xl px-3 py-2.5 text-sm capitalize ${
                        category === itemCategory
                          ? "border-[#6D4AFF] bg-purple-50 text-[#6D4AFF] font-medium"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {itemCategory}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="font-semibold text-[#1F1F2E] mb-4">
                  Price Range
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min ₹"
                    value={mobileFilters.minPrice}
                    onChange={(e) =>
                      setMobileFilters({
                        ...mobileFilters,
                        minPrice: e.target.value,
                      })
                    }
                    className="
                    w-full
                    border
                    border-gray-200
                    rounded-xl
                    px-3
                    py-3
                    text-sm
                    outline-none
                    focus:ring-2
                    focus:ring-[#6D4AFF]
                  "
                  />

                  <input
                    type="number"
                    min="0"
                    placeholder="Max ₹"
                    value={mobileFilters.maxPrice}
                    onChange={(e) =>
                      setMobileFilters({
                        ...mobileFilters,
                        maxPrice: e.target.value,
                      })
                    }
                    className="
                    w-full
                    border
                    border-gray-200
                    rounded-xl
                    px-3
                    py-3
                    text-sm
                    outline-none
                    focus:ring-2
                    focus:ring-[#6D4AFF]
                  "
                  />
                </div>
              </div>

              {/* Brand */}
              <div>
                <h3 className="font-semibold text-[#1F1F2E] mb-4">Brand</h3>

                <input
                  type="text"
                  placeholder="Search brand..."
                  value={mobileFilters.brand}
                  onChange={(e) =>
                    setMobileFilters({
                      ...mobileFilters,
                      brand: e.target.value,
                    })
                  }
                  className="
                  w-full
                  border
                  border-gray-200
                  rounded-xl
                  px-3
                  py-3
                  text-sm
                  outline-none
                  focus:ring-2
                  focus:ring-[#6D4AFF]
                "
                />
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-semibold text-[#1F1F2E] mb-4">
                  Customer Rating
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: "4",
                      label: "4 & Above",
                    },
                    {
                      value: "3",
                      label: "3 & Above",
                    },
                    {
                      value: "2",
                      label: "2 & Above",
                    },
                    {
                      value: "1",
                      label: "1 & Above",
                    },
                  ].map((rating) => (
                    <label
                      key={rating.value}
                      className={`flex items-center gap-2 border rounded-xl px-3 py-3 cursor-pointer ${
                        mobileFilters.minRating === rating.value
                          ? "border-[#6D4AFF] bg-purple-50"
                          : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="mobile-rating"
                        checked={mobileFilters.minRating === rating.value}
                        onChange={() =>
                          setMobileFilters({
                            ...mobileFilters,
                            minRating: rating.value,
                          })
                        }
                        className="accent-[#6D4AFF]"
                      />

                      <span className="text-sm">⭐ {rating.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h3 className="font-semibold text-[#1F1F2E] mb-4">
                  Availability
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      value: "",
                      label: "All",
                    },
                    {
                      value: "true",
                      label: "In Stock",
                    },
                    {
                      value: "false",
                      label: "Out of Stock",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setMobileFilters({
                          ...mobileFilters,
                          inStock: option.value,
                        })
                      }
                      className={`border rounded-xl px-2 py-3 text-xs sm:text-sm ${
                        mobileFilters.inStock === option.value
                          ? "border-[#6D4AFF] bg-purple-50 text-[#6D4AFF] font-medium"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Apply */}
            <div className="border-t px-5 py-4 bg-white">
              <button
                onClick={applyMobileFilters}
                className="
                w-full
                bg-[#6D4AFF]
                hover:bg-[#5936F7]
                text-white
                py-3.5
                rounded-xl
                font-semibold
                transition
              "
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================= */}
      {/* MOBILE SORT BOTTOM SHEET */}
      {/* ============================= */}

      {showSort && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Overlay */}
          <button
            onClick={closeSort}
            className="absolute inset-0 bg-black/40 cursor-default"
            aria-label="Close sort"
          />

          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-xl font-bold text-[#1F1F2E]">Sort By</h2>

              <button
                onClick={closeSort}
                className="
                w-9
                h-9
                rounded-full
                bg-gray-100
                flex
                items-center
                justify-center
              "
                aria-label="Close sort"
              >
                <X size={20} />
              </button>
            </div>

            {/* Sort Options */}
            <div className="px-5 py-4 pb-8 space-y-2">
              {[
                {
                  value: "newest",
                  label: "Newest Arrivals",
                },
                {
                  value: "priceLow",
                  label: "Price: Low → High",
                },
                {
                  value: "priceHigh",
                  label: "Price: High → Low",
                },
                {
                  value: "rating",
                  label: "Highest Rated",
                },
                {
                  value: "reviews",
                  label: "Most Reviewed",
                },
                {
                  value: "discount",
                  label: "Highest Discount",
                },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition ${
                    sort === option.value
                      ? "border-[#6D4AFF] bg-purple-50 text-[#6D4AFF]"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm font-medium">{option.label}</span>

                  <span
                    className={`w-4 h-4 rounded-full border-2 ${
                      sort === option.value
                        ? "border-[#6D4AFF] bg-[#6D4AFF]"
                        : "border-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Shop;
