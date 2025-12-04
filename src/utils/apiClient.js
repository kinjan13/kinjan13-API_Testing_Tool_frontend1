import axios from "axios";

/**
 * API client configured to handle requests to the deployed backend.
 * Adds necessary headers to work around CORS restrictions.
 */
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://api-testing-tool-backend-tzdy.onrender.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Log requests for debugging
apiClient.interceptors.request.use((config) => {
  // eslint-disable-next-line no-console
  console.log("API Request:", config.method.toUpperCase(), config.baseURL + config.url);
  return config;
});

// Log responses for debugging
apiClient.interceptors.response.use(
  (response) => {
    // eslint-disable-next-line no-console
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    // eslint-disable-next-line no-console
    console.error("API Error:", error.response?.status || error.message, error.config?.url);
    return Promise.reject(error);
  }
);

export default apiClient;
