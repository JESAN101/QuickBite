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

// Create Food
export const createFood = async (formData) => {
  const response = await API.post(
    "/food/create",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Update Food
export const updateFood = async (id, formData) => {
  const response = await API.put(
    `/food/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Delete Food
export const deleteFood = async (id) => {
  const response = await API.delete(
    `/food/${id}`
  );

  return response.data;
};