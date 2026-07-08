import API from "./api";

// Register
export const register = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

// Login
export const login = async (userData) => {
  const response = await API.post("/auth/login", userData);
  return response.data;
};

// Profile
export const getProfile = async () => {
  const response = await API.get("/auth/profile");
  return response.data;
};