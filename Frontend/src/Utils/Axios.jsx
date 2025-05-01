import axios from 'axios';

const api = axios.create({
  baseURL: 'http://13.61.151.194:8000', // Your EC2 server IP
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;