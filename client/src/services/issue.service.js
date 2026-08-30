import api from "../api/axios.js";

export const getMyActiveIssues = async () => {
  const response = await api.get("/issues/my-active-issues");
  return response.data.data; // array of issue records
};

export const getMyHistory = async ({ page = 1, limit = 10 } = {}) => {
  const response = await api.get("/issues/my-history", {
    params: { page, limit },
  });
  return response.data.data; // { history, metadata }
};