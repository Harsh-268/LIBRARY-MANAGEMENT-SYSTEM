import api from "../api/axios.js";

export const updateUserInfo = async ({ fullName, email }) => {
  const response = await api.patch("/users/update-account", { fullName, email });
  return response.data.data; 
};

export const changeUserPassword = async ({ oldPassword, newPassword }) => {
  const response = await api.post("/users/change-password", { oldPassword, newPassword });
  return response.data.data;
};