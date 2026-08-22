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
  const response = await API.post("/restaurant/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateRestaurant = async (id, formData) => {
  const response = await API.put(`/restaurant/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteRestaurant = async (id) => {
  const response = await API.delete(`/restaurant/delete/${id}`);

  return response.data;
};

// ==========================
// Restaurant Owner APIs
// ==========================

// Get My Restaurant
export const getMyRestaurant = async () => {
  const response = await API.get("/restaurant/owner/mine");
  return response.data;
};

// Update My Restaurant
export const updateMyRestaurant = async (formData) => {
  const response = await API.put("/restaurant/owner/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Get My Restaurant Stats
export const getMyStats = async () => {
  const response = await API.get("/restaurant/owner/stats");
  return response.data;
};

// Get My Orders
export const getMyOrders = async () => {
  const response = await API.get("/restaurant/owner/orders");
  return response.data;
};

// Update My Order Status
export const updateMyOrderStatus = async (id, orderStatus) => {
  const response = await API.put(`/restaurant/owner/orders/${id}`, {
    orderStatus,
  });

  return response.data;
};

// Get My Foods
export const getMyFoods = async () => {
  const response = await API.get("/restaurant/owner/foods");
  return response.data;
};

// Create Food For My Restaurant
export const createMyFood = async (formData) => {
  const response = await API.post("/restaurant/owner/foods", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Update My Food
export const updateMyFood = async (id, formData) => {
  const response = await API.put(`/restaurant/owner/foods/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Delete My Food
export const deleteMyFood = async (id) => {
  const response = await API.delete(`/restaurant/owner/foods/${id}`);

  return response.data;
};
