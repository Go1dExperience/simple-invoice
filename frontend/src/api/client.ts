import axios from "axios";

export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000" });
export const TOKEN_KEY = "si_token";

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401 && !location.pathname.startsWith("/login")) {
      localStorage.removeItem(TOKEN_KEY);
      location.assign("/login");
    }
    return Promise.reject(error);
  },
);
