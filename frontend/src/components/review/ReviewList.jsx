import { useRef } from "react";
import { ChevronRight } from "lucide-react";

import ReviewCard from "./ReviewCard";
import ReviewSummary from "./ReviewSummary";

const ReviewList = ({ reviews, loading, fetchReviews, onEdit }) => {
  const reviewContainerRef = useRef(null);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 text-center text-gray-500">
        Loading reviews...
      </div>
    );
  }

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? Number(
          (
            reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
            totalReviews
          ).toFixed(1),
        )
      : 0;

  // Scroll reviews horizontally
  const scrollReviews = () => {
    if (reviewContainerRef.current) {
      reviewContainerRef.current.scrollBy({
        left: 360,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full">
      <div className="mb-5">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1F1F2E]">
          Customer Reviews
        </h2>
      </div>

      {totalReviews === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center text-gray-500">
          No reviews yet.
        </div>
      ) : (
        <div className="relative">
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="w-full lg:w-[32%] lg:min-w-[320px]">
              <ReviewSummary
                averageRating={averageRating}
                totalReviews={totalReviews}
                reviews={reviews}
              />
            </div>

            <div className="relative flex-1 min-w-0">
              <div
                ref={reviewContainerRef}
                className="
                  flex
                  gap-4
                  overflow-x-auto
                  scroll-smooth
                  pb-2
                  pr-12
                  snap-x
                  snap-mandatory
                  [scrollbar-width:none]
                  [&::-webkit-scrollbar]:hidden
                "
              >
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="
                      flex-none
                      w-[300px]
                      sm:w-[340px]
                      lg:w-[360px]
                      snap-start
                    "
                  >
                    <ReviewCard
                      review={review}
                      fetchReviews={fetchReviews}
                      onEdit={onEdit}
                    />
                  </div>
                ))}
              </div>

              {reviews.length > 1 && (
                <button
                  type="button"
                  onClick={scrollReviews}
                  aria-label="Next reviews"
                  className="
                    absolute
                    right-0
                    top-1/2
                    -translate-y-1/2
                    z-10
                    w-11
                    h-11
                    rounded-full
                    bg-white
                    border
                    border-gray-200
                    shadow-md
                    flex
                    items-center
                    justify-center
                    text-[#1F1F2E]
                    hover:bg-[#F8F8FC]
                    hover:scale-105
                    transition
                    cursor-pointer
                  "
                >
                  <ChevronRight size={22} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReviewList;
