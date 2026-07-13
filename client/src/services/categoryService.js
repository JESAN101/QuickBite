import API from "./api";

// ==========================
// Public APIs
// ==========================

// Get All Categories
export const getAllCategories = async () => {
  const response = await API.get("/category/all");
  return response.data;
};

// Get Single Category
export const getCategoryById = async (id) => {
  const response = await API.get(`/category/${id}`);
  return response.data;
};

// ==========================
// Admin APIs
// ==========================

// Create Category
export const createCategory = async (categoryData) => {
  const response = await API.post(
    "/category/create",
    categoryData
  );

  return response.data;
};

// Update Category
export const updateCategory = async (
  id,
  categoryData
) => {
  const response = await API.put(
    `/category/${id}`,
    categoryData
  );

  return response.data;
};

// Delete Category
export const deleteCategory = async (id) => {
  const response = await API.delete(
    `/category/${id}`
  );

  return response.data;
};