import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1",
    withCredentials: true, // Required to send cookies (Refresh Tokens)
});

// Interceptor to add Access Token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor to handle expired Access Tokens
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Call backend to get a new access token using the refresh token (cookie)
                const { data } = await axios.post(
                    "http://localhost:5001/api/v1/users/refresh-token", 
                    {}, 
                    { withCredentials: true }
                );
                
                localStorage.setItem("accessToken", data.data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
                
                return api(originalRequest);
            } catch (err) {
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;