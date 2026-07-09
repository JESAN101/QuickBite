import API from "./api";

// ==========================
// Add Favorite
// ==========================
export const addFavorite = async (food) => {
  const response = await API.post("/favorite/add", {
    food,
  });

  return response.data;
};

// ==========================
// Get Favorites
// ==========================
export const getFavorites = async () => {
  const response = await API.get("/favorite/all");
  return response.data;
};

// ==========================
// Remove Favorite
// ==========================
export const removeFavorite = async (id) => {
  const response = await API.delete(`/favorite/remove/${id}`);
  return response.data;
};