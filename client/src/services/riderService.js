import API from "./api";

// ==========================
// Rider APIs
// ==========================

// Orders ready for pickup (no rider assigned yet)
export const getAvailableOrders = async () => {
  const response = await API.get("/rider/available");
  return response.data;
};

// My assigned deliveries
export const getMyDeliveries = async () => {
  const response = await API.get("/rider/my-deliveries");
  return response.data;
};

// Rider dashboard stats
export const getRiderStats = async () => {
  const response = await API.get("/rider/stats");
  return response.data;
};

// Accept a delivery
export const acceptDelivery = async (id) => {
  const response = await API.put(`/rider/accept/${id}`);
  return response.data;
};

// Complete a delivery
export const completeDelivery = async (id) => {
  const response = await API.put(`/rider/deliver/${id}`);
  return response.data;
};
