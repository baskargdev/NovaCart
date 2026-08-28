import { SlidersHorizontal, ArrowUpDown, ChevronDown } from "lucide-react";
import { useState } from "react";

const ShopHeader = ({
  title,
  productCount,
  sort,
  setSort,
  onOpenFilters,
  onOpenSort,
}) => {
  const [sortOpen, setSortOpen] = useState(false);

  const sortOptions = [
    { value: "newest", label: "Newest Arrivals" },
    { value: "priceLow", label: "Price: Low → High" },
    { value: "priceHigh", label: "Price: High → Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "reviews", label: "Most Reviewed" },
    { value: "discount", label: "Highest Discount" },
  ];

  const selectedSort =
    sortOptions.find((option) => option.value === sort)?.label ||
    "Newest Arrivals";

  return (
    <div className="mb-6 lg:mb-8">
      <div className="hidden lg:flex items-center justify-between">
        {/* Left */}
        <div>
          <h1 className="text-3xl font-bold text-[#1F1F2E] capitalize">
            {title}
          </h1>

          <p className="text-gray-500 mt-1">{productCount} Products Found</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Sort by:</span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((prev) => !prev)}
              className="
                w-[178px]
                h-10
                flex
                items-center
                justify-between
                gap-3
                rounded-xl
                border
                border-[#6D4AFF]
                bg-white
                px-4
                text-sm
                font-medium
                text-[#111827]
                transition
                hover:bg-[#FAF8FF]
                focus:outline-none
                cursor-pointer
              "
            >
              <span className="truncate">{selectedSort}</span>

              <ChevronDown
                size={17}
                className={`
                  shrink-0
                  text-[#111827]
                  transition-transform
                  duration-200
                  ${sortOpen ? "rotate-180" : ""}
                `}
              />
            </button>

            {sortOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-[46px]
                  z-50
                  w-[215px]
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  p-1.5
                  shadow-[0_8px_25px_rgba(0,0,0,0.12)]
                "
              >
                {sortOptions.map((option) => {
                  const isSelected = sort === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSort(option.value);
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
                        cursor-pointer
                        ${
                          isSelected
                            ? "bg-[#F1ECFF] text-[#6D4AFF] font-medium"
                            : "text-[#111827] hover:bg-gray-50"
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1F2E] capitalize">
            {title}
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            {productCount} Products Found
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onOpenFilters}
            className="
              flex
              items-center
              justify-center
              gap-2
              border
              border-gray-200
              bg-white
              rounded-xl
              px-4
              py-3
              text-sm
              font-medium
              text-[#1F1F2E]
              hover:border-[#6D4AFF]
              hover:text-[#6D4AFF]
              transition
              cursor-pointer
            "
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>

          <button
            onClick={onOpenSort}
            className="
              flex
              items-center
              justify-center
              gap-2
              border
              border-gray-200
              bg-white
              rounded-xl
              px-4
              py-3
              text-sm
              font-medium
              text-[#1F1F2E]
              hover:border-[#6D4AFF]
              hover:text-[#6D4AFF]
              transition
              cursor-pointer
            "
          >
            <ArrowUpDown size={18} />
            Sort
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
