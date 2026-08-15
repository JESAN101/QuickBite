import API from "./api";

// ==========================
// Customer APIs
// ==========================

// Place Order
export const placeOrder = async (orderData) => {
  const response = await API.post("/order/place", orderData);
  return response.data;
};

// Get My Orders
export const getMyOrders = async () => {
  const response = await API.get("/order/my-orders");
  return response.data;
};

// Cancel Own Order
export const cancelOrder = async (id) => {
  const response = await API.put(`/order/cancel/${id}`);
  return response.data;
};

// Get Single Order
export const getOrder = async (id) => {
  const response = await API.get(`/order/${id}`);
  return response.data;
};

// ==========================
// Admin APIs
// ==========================

// Get All Orders
export const getAllOrders = async ({
  page,
  limit,
  search,
} = {}) => {
  const response = await API.get("/order/all", {
    params: { page, limit, search },
  });
  return response.data;
};

// Update Order Status
export const updateOrderStatus = async (id, orderStatus) => {
  const response = await API.put(`/order/update/${id}`, {
    orderStatus,
  });

  return response.data;
};

// Delete Order
export const deleteOrder = async (id) => {
  const response = await API.delete(`/order/delete/${id}`);
  return response.data;
};