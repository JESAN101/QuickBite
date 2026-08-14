import API from "./api";

// ==========================
// Admin Coupon APIs
// ==========================

// Create Coupon
export const createCoupon = async (couponData) => {
  const response = await API.post("/coupon", couponData);
  return response.data;
};

// Get All Coupons
export const getAllCoupons = async () => {
  const response = await API.get("/coupon/all");
  return response.data;
};

// Get Single Coupon
export const getCouponById = async (id) => {
  const response = await API.get(`/coupon/${id}`);
  return response.data;
};

// Update Coupon
export const updateCoupon = async (id, couponData) => {
  const response = await API.put(`/coupon/${id}`, couponData);
  return response.data;
};

// Delete Coupon
export const deleteCoupon = async (id) => {
  const response = await API.delete(`/coupon/${id}`);
  return response.data;
};

// ==========================
// Customer Coupon APIs
// ==========================

// Validate a Coupon Code
export const validateCoupon = async (code, subtotal) => {
  const response = await API.post("/coupon/validate", {
    code,
    subtotal,
  });

  return response.data;
};

// Get Active Coupons (shown on checkout)
export const getActiveCoupons = async () => {
  const response = await API.get("/coupon/active");
  return response.data;
};
