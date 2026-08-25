import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("tech-sahaya-token") || localStorage.getItem("tech-sahaya-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
