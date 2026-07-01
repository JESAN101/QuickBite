import API from "./api";

export const getAllCategories = async () => {
  const response = await API.get("/category/all");
  return response.data;
};