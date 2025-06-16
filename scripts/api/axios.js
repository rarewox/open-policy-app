import axios from 'axios';
// import { API_URL, API_KEY } from '@env';
import { getToken, removeToken } from '../utils/storage';
import { router } from 'expo-router';

const api = axios.create({
  baseURL:
    'https://open-policy-backend-drf8ffeeeehhhhd2.canadacentral-01.azurewebsites.net/api',
  // 'https://ready-hopefully-martin.ngrok-free.app/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['ngrok-skip-browser-warning'] = true;
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
