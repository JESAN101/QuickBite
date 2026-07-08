import API from "./api";

// ==========================
// Register
// ==========================
export const register = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

// ==========================
// Login
// ==========================
export const login = async (userData) => {
  const response = await API.post("/auth/login", userData);

  localStorage.setItem("token", response.data.token);
  localStorage.setItem(
    "user",
    JSON.stringify(response.data.user)
  );

  return response.data;
};

// ==========================
// Get Profile
// ==========================
export const getProfile = async () => {
  const response = await API.get("/auth/profile");
  return response.data;
};