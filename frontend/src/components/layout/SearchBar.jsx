import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import axiosInstance from "../../api/axiosInstance";

const SearchBar = () => {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const searchProducts = async () => {
      const value = search.trim();

      if (!value) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const { data } = await axiosInstance.get(
          `/product?search=${encodeURIComponent(value)}&limit=6`,
        );

        if (data.success) {
          setSuggestions(data.products);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchProducts, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) {
      navigate("/shop");
      return;
    }

    setShowSuggestions(false);

    navigate(`/shop?search=${encodeURIComponent(value)}`);
  };

  const handleProductClick = (productId) => {
    setShowSuggestions(false);
    setSearch("");

    navigate(`/product/${productId}`);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className="flex overflow-hidden rounded-xl border border-gray-200 bg-white"
      >
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            if (search.trim()) {
              setShowSuggestions(true);
            }
          }}
          placeholder="Search for products, brands and more..."
          className="w-full min-w-0 px-5 py-3 outline-none"
        />

        <button
          type="submit"
          aria-label="Search products"
          className="bg-[#6D4AFF] px-6 text-white hover:bg-[#5936F7] transition cursor-pointer"
        >
          <FiSearch className="text-xl" />
        </button>
      </form>

      {/* Live Search Suggestions */}
      {showSuggestions && search.trim() && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-[100]">
          {loading ? (
            <div className="px-5 py-4 text-sm text-gray-500">Searching...</div>
          ) : suggestions.length === 0 ? (
            <div className="px-5 py-4 text-sm text-gray-500">
              No products found.
            </div>
          ) : (
            <>
              <div className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 border-b">
                Products
              </div>

              <div className="max-h-[360px] overflow-y-auto">
                {suggestions.map((product) => (
                  <button
                    key={product._id}
                    type="button"
                    onClick={() => handleProductClick(product._id)}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition text-left"
                  >
                    {/* Product Image */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-lg object-contain bg-gray-50 p-1 shrink-0"
                    />

                    {/* Product Information */}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-[#1F1F2E] truncate">
                        {product.name}
                      </p>

                      {product.brand && (
                        <p className="text-xs text-gray-400 mt-1">
                          {product.brand}
                        </p>
                      )}

                      <p className="text-sm font-semibold text-[#6D4AFF] mt-1">
                        ₹{product.price}
                      </p>
                    </div>

                    <FiSearch className="text-gray-300 shrink-0" />
                  </button>
                ))}
              </div>

              {/* View All Results */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full border-t px-5 py-3 text-sm font-semibold text-[#6D4AFF] hover:bg-purple-50 transition"
              >
                View all results for "{search.trim()}"
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
