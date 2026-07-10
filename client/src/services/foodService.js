import API from "./api";

// =========================
// Public APIs
// =========================

export const getFoods = async () => {
  const response = await API.get("/food/all");
  return response.data;
};

export const getAllFoods = async () => {
  const response = await API.get("/food/all");
  return response.data;
};

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

// =========================
// Admin APIs
// =========================

export const createFood = async (foodData) => {
  const response = await API.post(
    "/food/create",
    foodData
  );

  return response.data;
};

export const updateFood = async (id, foodData) => {
  const response = await API.put(
    `/food/${id}`,
    foodData
  );

  return response.data;
};

export const deleteFood = async (id) => {
  const response = await API.delete(
    `/food/${id}`
  );

  return response.data;
};