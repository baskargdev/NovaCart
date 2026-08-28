import StarRating from "./StarRating";

const ReviewSummary = ({
  averageRating = 0,
  totalReviews = 0,
  reviews = [],
}) => {
  const ratingCounts = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  reviews.forEach((review) => {
    const rating = Number(review.rating);

    if (rating >= 1 && rating <= 5) {
      ratingCounts[Math.round(rating)]++;
    }
  });

  const getPercentage = (count) => {
    if (totalReviews === 0) return 0;

    return Math.round((count / totalReviews) * 100);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6 h-full">
      <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F2E] mb-5">
        Customer Reviews
      </h2>

      <div className="flex items-center gap-5">
        <div className="shrink-0">
          <div className="text-5xl sm:text-6xl font-bold text-[#1F1F2E] leading-none">
            {averageRating}
          </div>

          <div className="mt-3">
            <StarRating rating={Math.round(averageRating)} size={20} />
          </div>

          <p className="text-sm sm:text-base font-semibold text-gray-700 mt-3">
            {totalReviews.toLocaleString("en-IN")}{" "}
            {totalReviews === 1 ? "Review" : "Reviews"}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 min-w-0 space-y-2.5">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingCounts[rating];
            const percentage = getPercentage(count);

            return (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-3 text-gray-700 font-medium text-right">
                  {rating}
                </span>

                <span className="text-yellow-400 text-sm">★</span>

                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <span className="w-10 text-right text-xs sm:text-sm text-gray-500">
                  {count.toLocaleString("en-IN")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;
