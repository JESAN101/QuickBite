import API from "./api";

// ==========================
// Add To Cart
// ==========================
export const addToCart = async (food, quantity) => {
  const response = await API.post("/cart/add", {
    food,
    quantity,
  });

  return response.data;
};

// ==========================
// Get Cart
// ==========================
export const getCart = async () => {
  const response = await API.get("/cart");
  return response.data;
};

// ==========================
// Update Quantity
// ==========================
export const updateCart = async (id, quantity) => {
  const response = await API.put(`/cart/update/${id}`, {
    quantity,
  });

  return response.data;
};

// ==========================
// Remove Item
// ==========================
export const removeFromCart = async (id) => {
  const response = await API.delete(`/cart/delete/${id}`);
  return response.data;
};

// ==========================
// Clear Cart
// ==========================
export const clearCart = async () => {
  const response = await API.delete("/cart/clear");
  return response.data;
};