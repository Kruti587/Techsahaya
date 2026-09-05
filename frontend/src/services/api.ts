import axios from "axios";

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") {
      return "https://techsahaya-backend.onrender.com";
    }
  }
  return "http://127.0.0.1:8000";
};

export const api = axios.create({
  baseURL: getBaseUrl(),
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("tech-sahaya-token") || localStorage.getItem("tech-sahaya-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      sessionStorage.removeItem("tech-sahaya-token");
      localStorage.removeItem("tech-sahaya-token");
    }
    return Promise.reject(error);
  }
);
