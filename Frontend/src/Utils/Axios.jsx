import axios from 'axios';

const api = axios.create({
  baseURL: 'http://16.171.162.180:8000/', 
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

export default api;
