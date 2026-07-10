import API from "./api";

// ===============================
// Get Dashboard Statistics
// ===============================
export const getDashboardStats = async () => {
  const response = await API.get("/admin/dashboard");
  return response.data;
};