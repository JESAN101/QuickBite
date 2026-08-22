import { useEffect, useState } from "react";
import { FaStar, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { getReviews, addReview, deleteReview } from "../services/reviewService";
import { useAuth } from "../context/AuthContext";

const StarRating = ({ value, size = 16, interactive = false, onChange }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type={interactive ? "button" : undefined}
        onClick={() => interactive && onChange?.(star)}
        className={interactive ? "cursor-pointer transition hover:scale-110" : "cursor-default"}
        disabled={!interactive}
        aria-label={`${star} star${star > 1 ? "s" : ""}`}
      >
        <FaStar
          size={size}
          className={
            star <= value
              ? "text-[#F0A438]"
              : "text-[#EADFC8]"
          }
        />
      </button>
    ))}
  </div>
);

const ReviewSection = ({ foodId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const data = await getReviews(foodId);
      setReviews(data.reviews || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [foodId]);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const hasReviewed = user && reviews.some((r) => r.user?._id === user._id || r.user === user._id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first to leave a review.");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    setSubmitting(true);
    try {
      await addReview(foodId, rating, comment);
      toast.success("Review added!");
      setRating(0);
      setComment("");
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      toast.success("Review deleted.");
      fetchReviews();
    } catch {
      toast.error("Failed to delete review.");
    }
  };

  return (
    <div className="mt-16 rounded-2xl border border-[#EADFC8] bg-[#FFFBF3] p-8 shadow-[0_10px_30px_-12px_rgba(29,21,18,0.15)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold text-[#1D1512]">
          Customer{" "}
          <span className="font-['Fraunces',serif] italic font-normal text-[#D64933]">
            Reviews
          </span>
        </h2>

        {avgRating && (
          <div className="flex items-center gap-2">
            <FaStar className="text-[#F0A438]" />
            <span className="text-xl font-bold text-[#1D1512]">{avgRating}</span>
            <span className="text-sm text-[#3A2A20]/50">
              ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
            </span>
          </div>
        )}
      </div>

      {/* Review list */}
      {loading ? (
        <p className="mt-8 text-sm text-[#3A2A20]/50">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="mt-8 text-sm text-[#3A2A20]/50">
          No reviews yet. Be the first to review this dish!
        </p>
      ) : (
        <div className="mt-8 space-y-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-xl border border-[#EADFC8] bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-[#1D1512]">
                    {review.user?.name || "Anonymous"}
                  </p>
                  <StarRating value={review.rating} size={14} />
                </div>
                <span className="text-xs text-[#3A2A20]/40">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.comment && (
                <p className="mt-3 text-sm leading-relaxed text-[#3A2A20]/65">
                  {review.comment}
                </p>
              )}
              {user && (review.user?._id === user._id || review.user === user._id) && (
                <button
                  onClick={() => handleDelete(review._id)}
                  className="mt-3 flex items-center gap-1 text-xs text-[#D64933]/60 transition hover:text-[#D64933]"
                >
                  <FaTrash className="text-[10px]" />
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add review form */}
      {!hasReviewed && (
        <form onSubmit={handleSubmit} className="mt-10 border-t border-[#EADFC8] pt-8">
          <h3 className="text-lg font-bold text-[#1D1512]">Leave a review</h3>

          <div className="mt-4">
            <p className="mb-2 text-sm font-semibold text-[#1D1512]">Your rating</p>
            <StarRating
              value={rating}
              size={24}
              interactive
              onChange={setRating}
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-semibold text-[#1D1512]">
              Comment <span className="font-normal text-[#3A2A20]/50">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others what you think about this dish..."
              className="w-full rounded-lg border border-[#EADFC8] bg-white p-3 text-sm text-[#1D1512] outline-none transition focus:border-[#F0A438] focus:ring-2 focus:ring-[#F0A438]/25"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 rounded-lg bg-[#1D1512] px-6 py-3 text-sm font-semibold text-[#F7ECD9] transition hover:bg-[#F0A438] hover:text-[#1D1512] disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReviewSection;
