import API from "./api";

// ==========================
// Role Request APIs
// ==========================

// Apply for a role (rider / restaurant)
export const applyForRole = async (requestedRole, formData) => {
  const response = await API.post("/role-request/apply", {
    requestedRole,
    ...formData,
  });

  return response.data;
};

// Get my applications (customer)
export const getMyRoleRequests = async () => {
  const response = await API.get("/role-request/my");
  return response.data;
};

// Get all applications (admin)
export const getAllRoleRequests = async () => {
  const response = await API.get("/role-request/all");
  return response.data;
};

// Approve / reject an application (admin)
export const updateRoleRequestStatus = async (
  id,
  status,
  adminNote
) => {
  const response = await API.put(`/role-request/${id}`, {
    status,
    adminNote,
  });

  return response.data;
};
