import API from "./api";

// Get all restaurants
export const getRestaurants = async () => {
  const response = await API.get("/restaurant/all");
  return response.data;
};

// Get single restaurant
export const getRestaurant = async (id) => {
  const response = await API.get(`/restaurant/${id}`);
  return response.data;
};