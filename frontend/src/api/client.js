import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Defensive error extraction — backend may return plain text, JSON, or nothing
client.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message ||
      (typeof error.response?.data === 'string' && error.response.data) ||
      error.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default client;
