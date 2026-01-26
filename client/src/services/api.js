import axios from 'axios';

// Create an Axios instance with dynamic base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api', // Fallback to proxy in dev
});

export default api;
