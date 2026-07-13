import API from "./api";

// Public
export const getRestaurants = async () => {
  const response = await API.get("/restaurant/all");
  return response.data;
};

export const getRestaurantById = async (id) => {
  const response = await API.get(`/restaurant/${id}`);
  return response.data;
};

// Admin
export const createRestaurant = async (formData) => {
  const response = await API.post(
    "/restaurant/create",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const updateRestaurant = async (
  id,
  formData
) => {
  const response = await API.put(
    `/restaurant/update/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteRestaurant = async (id) => {
  const response = await API.delete(
    `/restaurant/delete/${id}`
  );

  return response.data;
};