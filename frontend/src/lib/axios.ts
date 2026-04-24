import axios from 'axios';
import { tokenStorage } from './tokenStorage';

const baseURL = import.meta.env.VITE_API_URL;

export const network = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

network.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

network.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      tokenStorage.remove();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
