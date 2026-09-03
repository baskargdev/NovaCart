import { Pencil, Trash2, ThumbsUp, ThumbsDown } from "lucide-react";

import { toast } from "react-toastify";

import axiosInstance from "../../api/axiosInstance";

import { useAuth } from "../../context/AuthContext";

import StarRating from "./StarRating";

const ReviewCard = ({ review, fetchReviews, onEdit }) => {
  const { user } = useAuth();

  const isOwner = user && String(review.user._id) === String(user._id);

  // Get user initial
  const userName = review.user?.name || "Customer";

  const userInitial = userName.charAt(0).toUpperCase();

  // Format date
  const reviewDate = new Date(review.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Delete review
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?",
    );

    if (!confirmDelete) return;

    try {
      const { data } = await axiosInstance.delete(`/reviews/${review._id}`);

      if (data.success) {
        toast.success(data.message);

        if (fetchReviews) {
          fetchReviews();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete review.");
    }
  };

  return (
    <div
      className="
        bg-white
        border
        border-gray-200
        rounded-2xl
        p-5
        shadow-sm
        hover:shadow-md
        transition-all
        duration-300
        h-full
        flex
        flex-col
      "
    >
      <div className="flex items-start justify-between gap-3">
        {/* User */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div
            className="
              w-11
              h-11
              rounded-full
              bg-[#F0ECFF]
              text-[#6D4AFF]
              flex
              items-center
              justify-center
              font-bold
              text-lg
              shrink-0
            "
          >
            {userInitial}
          </div>

          {/* Name + Date */}
          <div className="min-w-0">
            <h3 className="font-semibold text-[#1F1F2E] truncate">
              {userName}
            </h3>

            <p className="text-xs text-gray-500 mt-0.5">{reviewDate}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="shrink-0">
          <StarRating rating={review.rating} size={18} />
        </div>
      </div>
      <div className="mt-5 flex-1">
        <p className="text-gray-600 leading-7 text-sm sm:text-base">
          {review.comment}
        </p>
      </div>
      <div className="border-t border-gray-100 mt-5 pt-4">
        <div className="flex items-center justify-between">
          {/* Helpful */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Helpful?</span>

            <button
              type="button"
              className="
                w-8
                h-8
                rounded-full
                flex
                items-center
                justify-center
                hover:bg-gray-100
                hover:text-[#6D4AFF]
                transition
                cursor-pointer
              "
              aria-label="Helpful"
            >
              <ThumbsUp size={16} />
            </button>

            <button
              type="button"
              className="
                w-8
                h-8
                rounded-full
                flex
                items-center
                justify-center
                hover:bg-gray-100
                hover:text-red-500
                transition
                cursor-pointer
              "
              aria-label="Not helpful"
            >
              <ThumbsDown size={16} />
            </button>
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onEdit(review)}
                className="
                  flex
                  items-center
                  gap-1.5
                  text-sm
                  text-[#6D4AFF]
                  hover:text-[#5936F7]
                  transition
                  cursor-pointer
                "
              >
                <Pencil size={15} />
                Edit
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="
                  flex
                  items-center
                  gap-1.5
                  text-sm
                  text-red-500
                  hover:text-red-600
                  transition
                  cursor-pointer
                "
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
