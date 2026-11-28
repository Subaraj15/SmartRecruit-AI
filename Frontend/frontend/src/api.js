
import axios from "axios";

const api = axios.create({
 baseURL: "https://smartrecruit-ai-e8gk.onrender.com",
});

api.interceptors.request.use((config) => {
  // Do not attach an old token to login or registration
  const isPublicAuthRequest =
    // config.url?.includes("/api/auth/login") ||
    // config.url?.includes("/api/auth/register");
 config.url?.includes("/api/auth/");

  if (isPublicAuthRequest) {
    delete config.headers.Authorization;
    return config;
  }

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

export default api;
