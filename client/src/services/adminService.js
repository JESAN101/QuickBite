import API from "./api";

// =========================
// Dashboard Stats
// =========================
export const getDashboardStats = async () => {
  const response = await API.get("/admin/dashboard");
  return response.data;
};

// =========================
// Get All Users
// =========================
export const getAllUsers = async () => {
  const response = await API.get("/auth/users");
  return response.data;
};

// =========================
// Delete User
// =========================
export const deleteUser = async (id) => {
  const response = await API.delete(`/auth/users/${id}`);
  return response.data;
};

// =========================
// Update User Role
// =========================
export const updateUserRole = async (id, role) => {
  const response = await API.put(
    `/auth/users/${id}/role`,
    { role }
  );

  return response.data;
};