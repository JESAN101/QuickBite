import API from "./api";

// Get all foods
export const getFoods = async () => {
  const response = await API.get("/food/all");
  return response.data;
};

// Get single food
export const getAllFoods = async () => {
  const response = await API.get("/food/all");
  return response.data;
};

// Get foods by restaurant
export const getFoodsByRestaurant = async (restaurantId) => {
  const response = await API.get(
    `/food/restaurant/${restaurantId}`
  );

  return response.data;
};

export const getFoodById = async (id) => {
  const response = await API.get(`/food/${id}`);
  return response.data;
};