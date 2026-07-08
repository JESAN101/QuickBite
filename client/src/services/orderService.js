import API from "./api";

// ==========================
// Place Order
// ==========================
export const placeOrder = async (orderData) => {
  const response = await API.post("/order/place", orderData);
  return response.data;
};

// ==========================
// Get My Orders
// ==========================
export const getMyOrders = async () => {
  const response = await API.get("/order/my-orders");
  return response.data;
};

// ==========================
// Get Single Order
// ==========================
export const getOrder = async (id) => {
  const response = await API.get(`/order/${id}`);
  return response.data;
};