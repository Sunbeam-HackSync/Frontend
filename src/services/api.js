// src/services/api.js

import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For refresh token cookies if needed
});

// Request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors (like 401)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh token using the refresh endpoint
        // Assuming refresh_token is sent via httpOnly cookie by the server
        const res = await axios.post(`${BASE_URL}auth/refresh`, {}, { withCredentials: true });

        if (res.status === 200) {
          const newToken = res.data?.data?.token; // ← envelope: { message, status, data: { token } }
          if (newToken) {
            Cookies.set('token', newToken, { expires: 7, sameSite: 'strict' });
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest); // Retry the original request with new token
          }
        }
      } catch (refreshError) {
        // Refresh token failed, clear cookies/storage and redirect to login
        Cookies.remove('token');
        localStorage.removeItem('user');
        localStorage.removeItem('hackforge_auth');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle banned user exception
    if (error.response?.status === 403 && error.response?.data?.message?.toLowerCase().includes("banned")) {
      Cookies.remove('token');
      localStorage.removeItem('user');
      localStorage.removeItem('hackforge_auth');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Global Error Handling for Server Errors (500) or Network Errors
    if (!error.response) {
      toast.error("Network error. Please check your connection.");
    } else if (error.response.status >= 500) {
      toast.error("Internal Server Error. Our team has been notified.");
    }

    return Promise.reject(error);
  }
);

export default api;
