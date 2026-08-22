import API from "./api";

// Get reviews for a food item
export const getReviews = async (foodId) => {
  const response = await API.get(`/review/${foodId}`);
  return response.data;
};

// Add a review (rating + comment)
export const addReview = async (foodId, rating, comment = "") => {
  const response = await API.post("/review/add", {
    food: foodId,
    rating,
    comment,
  });
  return response.data;
};

// Delete a review
export const deleteReview = async (reviewId) => {
  const response = await API.delete(`/review/delete/${reviewId}`);
  return response.data;
};
