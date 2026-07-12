import axios from "axios";
//api instance

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL || "http://localhost:5001/api/v1",
  withCredentials: true,
});

//interceptors to handle expired access and refresh tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/login") &&
      !originalRequest.url.includes("/register") &&
      !originalRequest.url.includes("/refresh-token")
    ) {
      originalRequest.retry = true;

      try {
        (await api.post("/users/refresh-token", {}), { withCredentials: true });

        return api(originalRequst);
      } catch (refreshError) {
        console.error(
          "Refresh token expired . Redirecting to the login page...",
        );
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
