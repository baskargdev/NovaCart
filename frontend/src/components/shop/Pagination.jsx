import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const getPages = () => {
    const pages = [];

    // 5 pages or less
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    // Beginning
    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    // End
    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // Middle
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-10 mb-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          w-9 h-9 sm:w-10 sm:h-10
          flex items-center justify-center
          rounded-lg
          border border-gray-200
          bg-white
          text-gray-600
          hover:border-[#6D4AFF]
          hover:text-[#6D4AFF]
          disabled:opacity-40
          disabled:cursor-not-allowed
          transition
          shrink-0
        "
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((page, index) =>
        page === "..." ? (
          <span
            key={`dots-${index}`}
            className="
              w-7 h-9
              sm:w-10 sm:h-10
              flex items-center justify-center
              text-gray-500
              shrink-0
            "
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              w-9 h-9 sm:w-10 sm:h-10
              flex items-center justify-center
              rounded-lg
              font-medium
              text-sm sm:text-base
              transition
              shrink-0
              ${
                currentPage === page
                  ? "bg-[#6D4AFF] text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-[#6D4AFF] hover:text-[#6D4AFF]"
              }
            `}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          w-9 h-9 sm:w-10 sm:h-10
          flex items-center justify-center
          rounded-lg
          border border-gray-200
          bg-white
          text-gray-600
          hover:border-[#6D4AFF]
          hover:text-[#6D4AFF]
          disabled:opacity-40
          disabled:cursor-not-allowed
          transition
          shrink-0
        "
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
