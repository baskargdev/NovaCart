import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import axiosInstance from "../../api/axiosInstance";

import { toast } from "react-toastify";

import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // Pagination
  const PRODUCTS_PER_PAGE = 12;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch Products
  const fetchProducts = async (
    searchValue = "",
    page = 1,
    showPageLoading = false,
  ) => {
    try {
      if (showPageLoading) {
        setLoading(true);
      } else if (searchValue.trim() !== "") {
        setSearchLoading(true);
      }

      const { data } = await axiosInstance.get("/product", {
        params: {
          search: searchValue,
          page,
          limit: PRODUCTS_PER_PAGE,
        },
      });

      setProducts(data.products || []);

      // IMPORTANT:
      // These values come from the backend.
      setTotalProducts(data.totalProducts || 0);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(data.page || page);
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  // Initial Load + Search
  useEffect(() => {
    const timer = setTimeout(
      () => {
        // Every new search starts from page 1
        fetchProducts(search, 1, search.trim() === "");
      },
      search.trim() === "" ? 0 : 400,
    );

    return () => clearTimeout(timer);
  }, [search]);

  // Indian Rupee formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  // =============================
  // PAGINATION
  // =============================

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    fetchProducts(search, page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete Product
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      const { data } = await axiosInstance.delete(`/product/${id}`);

      toast.success(data.message);

      /*
       * After deleting:
       * - Refresh current page.
       * - If the current page becomes empty,
       *   move to the previous page.
       */

      const { data: refreshedData } = await axiosInstance.get("/product", {
        params: {
          search,
          page: currentPage,
          limit: PRODUCTS_PER_PAGE,
        },
      });

      const refreshedProducts = refreshedData.products || [];
      const refreshedTotalProducts = refreshedData.totalProducts || 0;
      const refreshedTotalPages = refreshedData.totalPages || 0;

      // Current page still has products
      if (
        refreshedProducts.length > 0 ||
        currentPage === 1 ||
        refreshedTotalPages === 0
      ) {
        setProducts(refreshedProducts);
        setTotalProducts(refreshedTotalProducts);
        setTotalPages(refreshedTotalPages);

        if (refreshedTotalPages === 0) {
          setCurrentPage(1);
        } else {
          setCurrentPage(Math.min(currentPage, refreshedTotalPages));
        }

        return;
      }

      // Current page became empty.
      // Go to previous page.
      const previousPage = Math.max(currentPage - 1, 1);

      const { data: previousPageData } = await axiosInstance.get("/product", {
        params: {
          search,
          page: previousPage,
          limit: PRODUCTS_PER_PAGE,
        },
      });

      setProducts(previousPageData.products || []);
      setTotalProducts(previousPageData.totalProducts || 0);
      setTotalPages(previousPageData.totalPages || 0);
      setCurrentPage(previousPage);
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  // =============================
  // CURRENT DISPLAY RANGE
  // =============================

  const startProduct =
    totalProducts === 0 ? 0 : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;

  const endProduct =
    totalProducts === 0
      ? 0
      : Math.min(currentPage * PRODUCTS_PER_PAGE, totalProducts);

  // Initial loading
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#6D4AFF]/20 border-t-[#6D4AFF] rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-500 font-medium">Loading Products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#111936]">Products</h1>

          <p className="text-gray-500 mt-1">Manage all products</p>
        </div>

        {/* Add Product */}
        <Link
          to="/admin/add-product"
          className="
            w-full sm:w-auto
            flex items-center justify-center gap-2
            bg-[#6D4AFF]
            hover:bg-[#5B3CF6]
            text-white
            px-5 py-3
            rounded-xl
            font-medium
            transition
            shadow-sm
          "
        >
          <FiPlus size={18} />
          Add Product
        </Link>
      </div>

      {/* Products Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Search */}
        <div className="p-4 sm:p-5">
          <div className="relative w-full sm:max-w-[330px]">
            <FiSearch
              size={17}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, SKU, brand..."
              className="
                w-full
                h-11
                border border-gray-200
                rounded-lg
                pl-10
                pr-10
                text-sm
                text-gray-700
                outline-none
                placeholder:text-gray-400
                focus:border-[#6D4AFF]
                focus:ring-2
                focus:ring-purple-100
                transition
              "
            />

            {/* Search Loading Spinner */}
            {searchLoading && (
              <div
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  w-4
                  h-4
                  border-2
                  border-[#6D4AFF]/30
                  border-t-[#6D4AFF]
                  rounded-full
                  animate-spin
                "
              />
            )}
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            {/* Table Header */}
            <thead>
              <tr className="bg-[#F8F8FC] border-y border-gray-100">
                <th className="px-5 py-4 text-left text-xs font-semibold text-[#465276]">
                  Product
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#465276]">
                  Category
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#465276]">
                  Price
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#465276]">
                  Stock
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#465276]">
                  Featured
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#465276]">
                  Created
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold text-[#465276]">
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-16 text-gray-500">
                    {search
                      ? "No products found for your search"
                      : "No products found"}
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="
                      border-b border-gray-100
                      last:border-b-0
                      hover:bg-[#FAFAFF]
                      transition
                    "
                  >
                    {/* Product */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-4">
                        <div
                          className="
                            w-12 h-12
                            rounded-lg
                            bg-[#F8F8FC]
                            border border-gray-200
                            flex items-center justify-center
                            overflow-hidden
                            shrink-0
                          "
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-[#1F2937] truncate max-w-[220px]">
                            {product.name}
                          </p>

                          <p className="text-xs text-[#64748B] mt-1">
                            SKU:{" "}
                            {product.sku ? (
                              product.sku
                            ) : (
                              <span className="text-gray-400">
                                Not assigned
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3">
                      <span
                        className={`
                          inline-flex
                          px-3 py-1
                          rounded-full
                          text-xs
                          font-medium
                          capitalize
                          ${
                            product.category?.toLowerCase() === "electronics"
                              ? "bg-purple-200 text-purple-700"
                              : product.category?.toLowerCase() === "fashion"
                                ? "bg-lime-200 text-lime-700"
                                : product.category?.toLowerCase() === "sports"
                                  ? "bg-blue-200 text-blue-700"
                                  : product.category?.toLowerCase() === "home"
                                    ? "bg-yellow-200 text-yellow-600"
                                    : product.category?.toLowerCase() ===
                                        "beauty"
                                      ? "bg-pink-200 text-pink-700"
                                      : product.category?.toLowerCase() ===
                                          "books-stationery"
                                        ? "bg-orange-200 text-orange-700"
                                        : product.category?.toLowerCase() ===
                                            "bags-accessories"
                                          ? "bg-gray-200 text-gray-700"
                                          : product.category?.toLowerCase() ===
                                              "footwear"
                                            ? "bg-cyan-200 text-cyan-700"
                                            : "bg-fuchsia-200 text-fuchsia-700"
                          }
                        `}
                      >
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-3">
                      <span className="text-sm font-bold text-[#111936]">
                        {formatCurrency(product.price)}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-3">
                      <span
                        className={`
                          text-sm font-medium
                          ${
                            product.stock > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        `}
                      >
                        {product.stock} in stock
                      </span>
                    </td>

                    {/* Featured */}
                    <td className="px-5 py-3">
                      <span
                        className={`
                          inline-flex
                          px-3 py-1
                          rounded-full
                          text-xs
                          font-medium
                          ${
                            product.featured
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }
                        `}
                      >
                        {product.featured ? "Yes" : "No"}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-5 py-3">
                      {product.createdAt ? (
                        <div className="flex items-center gap-2 text-sm text-[#52607A] whitespace-nowrap">
                          <FiCalendar size={14} />

                          {new Date(product.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit */}
                        <Link
                          to={`/admin/edit-product/${product._id}`}
                          className="
                            w-9 h-9
                            rounded-lg
                            border border-gray-200
                            flex items-center justify-center
                            text-[#6D4AFF]
                            hover:bg-purple-50
                            hover:border-purple-200
                            transition
                          "
                          aria-label="Edit product"
                        >
                          <FiEdit2 size={16} />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="
                            w-9 h-9
                            rounded-lg
                            border border-red-100
                            flex items-center justify-center
                            text-red-500
                            hover:bg-red-50
                            hover:border-red-200
                            transition
                            cursor-pointer
                          "
                          aria-label="Delete product"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Information + Pagination */}
        {totalProducts > 0 && (
          <div className="px-5 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Product Count */}
            <p className="text-sm text-[#52607A]">
              Showing{" "}
              <span className="font-semibold text-[#1F2937]">
                {startProduct} to {endProduct}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#1F2937]">
                {totalProducts}
              </span>{" "}
              products
            </p>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                {/* Previous */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="
                    w-9 h-9
                    flex items-center justify-center
                    rounded-lg
                    border border-gray-200
                    text-gray-600
                    hover:bg-[#F7F5FF]
                    hover:text-[#6D4AFF]
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    transition
                  "
                  aria-label="Previous page"
                >
                  <FiChevronLeft size={17} />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`
                      w-9 h-9
                      rounded-lg
                      text-sm
                      font-medium
                      transition
                      ${
                        currentPage === page
                          ? "bg-[#6D4AFF] text-white shadow-sm"
                          : "border border-gray-200 text-gray-600 hover:bg-[#F7F5FF] hover:text-[#6D4AFF]"
                      }
                    `}
                  >
                    {page}
                  </button>
                ))}

                {/* Next */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="
                    w-9 h-9
                    flex items-center justify-center
                    rounded-lg
                    border border-gray-200
                    text-gray-600
                    hover:bg-[#F7F5FF]
                    hover:text-[#6D4AFF]
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    transition
                  "
                  aria-label="Next page"
                >
                  <FiChevronRight size={17} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
