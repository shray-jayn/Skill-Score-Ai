import axios from "axios";
import { environment } from "../environments/environment.dev";

const apiClient = axios.create({
  baseURL: environment.apiBaseUrl, 
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
