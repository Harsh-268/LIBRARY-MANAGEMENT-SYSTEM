import api from "../api/axios.js";

export const updateUserInfo = async ({ fullName }) => {
  // email is not user-editable — intentionally never sent here
  const response = await api.patch("/users/update-account", { fullName });
  return response.data.data; 
};

export const changeUserPassword = async ({ oldPassword, newPassword }) => {
  const response = await api.post("/users/change-password", { oldPassword, newPassword });
  return response.data.data;
};

// --- Admin-only: user management ---

/**
 * Fetch a paginated list of all users (admin only).
 * Returns the raw data from the API: { users, metadata }
 */
export const getAllUsers = async ({ page, limit } = {}) => {
  const response = await api.get("/users/all-users", { params: { page, limit } });
  return response.data.data; // { users, metadata }
};

/**
 * Search students by name/email (admin only).
 * Returns the raw array of matching students from the API.
 */
export const searchStudents = async (q) => {
  const response = await api.get("/users/search-students", { params: { q } });
  return response.data.data; // students[]
};

/**
 * Promote/demote a user between STUDENT and ADMIN (admin only).
 * Returns the updated user document.
 */
export const updateUserRole = async ({ userId, role }) => {
  const response = await api.patch("/users/update-role", { userId, role });
  return response.data.data; // updated user
};