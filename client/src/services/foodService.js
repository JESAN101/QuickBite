import API from "./api";

// =========================
// Public APIs
// =========================

export const getSuggestions = async (search) => {
  const response = await API.get("/food/suggestions", {
    params: { search },
  });
  return response.data;
};

export const getFoods = async () => {
  const response = await API.get("/food/all");
  return response.data;
};

export const getAllFoods = async ({
  page,
  limit,
  search,
} = {}) => {
  const response = await API.get("/food/all", {
    params: { page, limit, search },
  });
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