import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutGrid,
  Shirt,
  Smartphone,
  Home,
  Sparkles,
  Dumbbell,
  Gamepad2,
  ShoppingBag,
  Footprints,
  BookOpen,
  Tag,
  Search,
  Star,
  PackageCheck,
  PackageX,
  ListFilter,
  RotateCcw,
} from "lucide-react";

const categories = [
  {
    value: "fashion",
    label: "Fashion",
    icon: Shirt,
  },
  {
    value: "electronics",
    label: "Electronics",
    icon: Smartphone,
  },
  {
    value: "home",
    label: "Home",
    icon: Home,
  },
  {
    value: "beauty",
    label: "Beauty",
    icon: Sparkles,
  },
  {
    value: "sports",
    label: "Sports",
    icon: Dumbbell,
  },
  {
    value: "toys",
    label: "Toys",
    icon: Gamepad2,
  },
  {
    value: "bags-accessories",
    label: "Bags & Accessories",
    icon: ShoppingBag,
  },
  {
    value: "footwear",
    label: "Footwear",
    icon: Footprints,
  },
  {
    value: "books-stationery",
    label: "Books & Stationery",
    icon: BookOpen,
  },
];

const ratings = [
  { value: "4", label: "4 & Above" },
  { value: "3", label: "3 & Above" },
  { value: "2", label: "2 & Above" },
  { value: "1", label: "1 & Above" },
];

const brandSuggestions = [
  "Nike",
  "Adidas",
  "Puma",
  "Levi's",
  "H&M",
  "Apple",
  "Samsung",
  "Sony",
  "OnePlus",
  "boAt",
];

const ShopSidebar = ({ filters, setFilters, clearFilters }) => {
  const [searchParams] = useSearchParams();

  const currentCategory = searchParams.get("category");
  const [brandSearch, setBrandSearch] = useState(filters.brand || "");
  const [brandFocused, setBrandFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (brandSearch !== (filters.brand || "")) {
        handleFilterChange("brand", brandSearch.trim());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [brandSearch]);

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  return (
    <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 xl:p-6 sticky top-28 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#F1ECFF] flex items-center justify-center">
              <ListFilter size={19} className="text-[#6D4AFF]" />
            </div>

            <h2 className="text-xl font-bold text-[#1F1F2E]">Filters</h2>
          </div>

          <button
            onClick={clearFilters}
            className="
              text-sm
              font-medium
              text-[#6D4AFF]
              hover:text-[#5936F7]
              transition
              cursor-pointer
            "
          >
            Clear All
          </button>
        </div>

        <div className="pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid size={18} className="text-[#6D4AFF]" />

            <h3 className="font-semibold text-[#1F1F2E]">Categories</h3>
          </div>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                window.location.href = "/shop";
              }}
              className={`
                w-full
                flex
                items-center
                gap-3
                px-3
                py-2.5
                rounded-lg
                text-sm
                transition
                cursor-pointer
                ${
                  !currentCategory
                    ? "bg-[#F1ECFF] text-[#6D4AFF] font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#6D4AFF]"
                }
              `}
            >
              <LayoutGrid size={17} />

              <span>All Products</span>
            </button>

            {/* Categories */}
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = currentCategory === category.value;

              return (
                <button
                  type="button"
                  key={category.value}
                  onClick={() => {
                    window.location.href = `/shop?category=${category.value}`;
                  }}
                  className={`
                    w-full
                    flex
                    items-center
                    gap-3
                    px-3
                    py-2.5
                    rounded-lg
                    text-sm
                    transition
                    cursor-pointer
                    ${
                      isSelected
                        ? "bg-[#F1ECFF] text-[#6D4AFF] font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#6D4AFF]"
                    }
                  `}
                >
                  <Icon size={17} />

                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="py-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Tag size={18} className="text-[#6D4AFF]" />

            <h3 className="font-semibold text-[#1F1F2E]">Price Range</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Min Price */}
            <div>
              <label className="text-xs text-gray-500">Min Price</label>

              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-lg
                    pl-7
                    pr-3
                    py-2.5
                    text-sm
                    text-[#1F1F2E]
                    outline-none
                    transition
                    focus:border-[#6D4AFF]
                    focus:ring-2
                    focus:ring-[#6D4AFF]/10
                  "
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500">Max Price</label>

              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  placeholder="10000"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-lg
                    pl-7
                    pr-3
                    py-2.5
                    text-sm
                    text-[#1F1F2E]
                    outline-none
                    transition
                    focus:border-[#6D4AFF]
                    focus:ring-2
                    focus:ring-[#6D4AFF]/10
                  "
                />
              </div>
            </div>
          </div>
        </div>

        <div className="py-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Tag size={18} className="text-[#6D4AFF]" />

            <h3 className="font-semibold text-[#1F1F2E]">Brand</h3>
          </div>

          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />

            <input
              type="text"
              placeholder="Search brand..."
              value={brandSearch}
              onFocus={() => setBrandFocused(true)}
              onChange={(e) => {
                setBrandSearch(e.target.value);
                setBrandFocused(true);
              }}
              onBlur={() => {
                setTimeout(() => setBrandFocused(false), 150);
              }}
              className="
    w-full
    border
    border-gray-200
    rounded-lg
    pl-10
    pr-3
    py-2.5
    text-sm
    text-[#1F1F2E]
    outline-none
    transition
    focus:border-[#6D4AFF]
    focus:ring-2
    focus:ring-[#6D4AFF]/10
  "
            />

            {brandFocused && (
              <div
                className="
                  absolute
                  left-0
                  right-0
                  top-full
                  z-40
                  mt-2
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
              >
                {brandSuggestions
                  .filter((brand) =>
                    brand
                      .toLowerCase()
                      .includes((brandSearch || "").toLowerCase()),
                  )
                  .slice(0, 6)
                  .map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setBrandSearch(brand);
                        handleFilterChange("brand", brand);
                        setBrandFocused(false);
                      }}
                      className="
                        w-full
                        rounded-lg
                        px-3
                        py-2.5
                        text-left
                        text-sm
                        text-gray-700
                        hover:bg-[#F1ECFF]
                        hover:text-[#6D4AFF]
                        transition
                        cursor-pointer
                      "
                    >
                      {brand}
                    </button>
                  ))}

                {brandSuggestions.filter((brand) =>
                  brand
                    .toLowerCase()
                    .includes((brandSearch || "").toLowerCase()),
                ).length === 0 && (
                  <p className="px-3 py-2.5 text-sm text-gray-400">
                    No brands found
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="py-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Star size={18} className="text-[#6D4AFF]" />

            <h3 className="font-semibold text-[#1F1F2E]">Customer Rating</h3>
          </div>

          <div className="space-y-1.5">
            {ratings.map((rating) => {
              const isSelected = filters.minRating === rating.value;

              return (
                <label
                  key={rating.value}
                  className={`
                    flex
                    items-center
                    gap-3
                    px-3
                    py-2.5
                    rounded-lg
                    cursor-pointer
                    transition
                    ${isSelected ? "bg-[#F1ECFF]" : "hover:bg-gray-50"}
                  `}
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={isSelected}
                    onChange={() =>
                      handleFilterChange("minRating", rating.value)
                    }
                    className="w-4 h-4 accent-[#6D4AFF]"
                  />

                  <div className="flex items-center gap-1.5">
                    <Star
                      size={15}
                      fill="currentColor"
                      className="text-yellow-500"
                    />

                    <span
                      className={`
                        text-sm
                        ${
                          isSelected
                            ? "text-[#6D4AFF] font-medium"
                            : "text-gray-600"
                        }
                      `}
                    >
                      {rating.label}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="py-6">
          <div className="flex items-center gap-2 mb-4">
            <PackageCheck size={18} className="text-[#6D4AFF]" />

            <h3 className="font-semibold text-[#1F1F2E]">Availability</h3>
          </div>

          <div className="space-y-1.5">
            <label
              className={`
                flex
                items-center
                gap-3
                px-3
                py-2.5
                rounded-lg
                cursor-pointer
                transition
                ${
                  filters.inStock === "true"
                    ? "bg-[#F1ECFF]"
                    : "hover:bg-gray-50"
                }
              `}
            >
              <input
                type="radio"
                name="availability"
                checked={filters.inStock === "true"}
                onChange={() => handleFilterChange("inStock", "true")}
                className="w-4 h-4 accent-[#6D4AFF]"
              />

              <PackageCheck
                size={17}
                className={
                  filters.inStock === "true"
                    ? "text-[#6D4AFF]"
                    : "text-gray-500"
                }
              />

              <span className="text-sm text-gray-600">In Stock</span>
            </label>

            <label
              className={`
                flex
                items-center
                gap-3
                px-3
                py-2.5
                rounded-lg
                cursor-pointer
                transition
                ${
                  filters.inStock === "false"
                    ? "bg-[#F1ECFF]"
                    : "hover:bg-gray-50"
                }
              `}
            >
              <input
                type="radio"
                name="availability"
                checked={filters.inStock === "false"}
                onChange={() => handleFilterChange("inStock", "false")}
                className="w-4 h-4 accent-[#6D4AFF]"
              />

              <PackageX
                size={17}
                className={
                  filters.inStock === "false"
                    ? "text-[#6D4AFF]"
                    : "text-gray-500"
                }
              />

              <span className="text-sm text-gray-600">Out of Stock</span>
            </label>

            <label
              className={`
                flex
                items-center
                gap-3
                px-3
                py-2.5
                rounded-lg
                cursor-pointer
                transition
                ${filters.inStock === "" ? "bg-[#F1ECFF]" : "hover:bg-gray-50"}
              `}
            >
              <input
                type="radio"
                name="availability"
                checked={filters.inStock === ""}
                onChange={() => handleFilterChange("inStock", "")}
                className="w-4 h-4 accent-[#6D4AFF]"
              />

              <LayoutGrid
                size={17}
                className={
                  filters.inStock === "" ? "text-[#6D4AFF]" : "text-gray-500"
                }
              />

              <span className="text-sm text-gray-600">All</span>
            </label>
          </div>
        </div>

        <button
          onClick={clearFilters}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            border
            border-[#6D4AFF]
            text-[#6D4AFF]
            hover:bg-[#6D4AFF]
            hover:text-white
            py-3
            rounded-xl
            font-medium
            transition
            cursor-pointer
          "
        >
          <RotateCcw size={17} />
          Clear Filters
        </button>
      </div>
    </aside>
  );
};

export default ShopSidebar;
