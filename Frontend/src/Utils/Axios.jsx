import axios from 'axios';

// Determine the base URL based on the environment
const baseURL = process.env.NODE_ENV === 'production'
  ? 'http://localhost:8000/api'  // Production base URL
  : 'http://localhost:8000';     // Development base URL

// Create a new instance of Axios
const api = axios.create({
  baseURL: baseURL, // Use the dynamic baseURL
  timeout: 5000,    // Set the request timeout if needed
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${authToken}`,
  },
});

export default api;
