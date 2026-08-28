import { useEffect, useState } from "react";

import axiosInstance from "../../api/axiosInstance";

import { toast } from "react-toastify";

import StarRating from "./StarRating";

const ReviewForm = ({
  productId,
  editingReview,
  setEditingReview,
  refreshReviews,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingReview) {
      setRating(editingReview.rating);
      setComment(editingReview.comment);
    } else {
      setRating(5);
      setComment("");
    }
  }, [editingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      return toast.warning("Please write a review.");
    }

    setLoading(true);

    try {
      let response;

      if (editingReview) {
        response = await axiosInstance.put(`/reviews/${editingReview._id}`, {
          rating,
          comment,
        });
      } else {
        response = await axiosInstance.post("/reviews", {
          productId,
          rating,
          comment,
        });
      }

      const { data } = response;

      if (data.success) {
        toast.success(data.message);

        setRating(5);
        setComment("");

        if (setEditingReview) {
          setEditingReview(null);
        }

        if (refreshReviews) {
          refreshReviews();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setRating(5);
    setComment("");

    if (setEditingReview) {
      setEditingReview(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border p-6">
      <h2 className="text-2xl font-bold mb-6">
        {editingReview ? "Edit Review" : "Write a Review"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Rating</label>

          <StarRating rating={rating} setRating={setRating} editable />
        </div>
        <div>
          <label className="block mb-2 font-medium">Review</label>

          <textarea
            rows={5}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your experience..."
            className="w-full border rounded-xl p-4 resize-none focus:outline-none focus:border-[#6D4AFF]"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#6D4AFF] hover:bg-[#5936F7] text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-60"
          >
            {loading
              ? "Saving..."
              : editingReview
                ? "Update Review"
                : "Submit Review"}
          </button>

          {editingReview && (
            <button
              type="button"
              onClick={handleCancel}
              className="border border-gray-300 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
