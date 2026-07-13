import axios from "axios";

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: "https://e-commerce-api-3wara.vercel.app/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // ✅ السماح بإرسال الكوكيز
});

// Add an interceptor to the Axios instance
api.interceptors.request.use(
  (config) => {
    // Get the user's token from local storage
    let token = localStorage.getItem("userToken")

    if (token) {
     const cleanToken = token.replace(/['"]+/g, '').trim();// Remove quotes from the token
      config.headers.Authorization = `Bearer ${cleanToken}`; // Set the Authorization header with the token
    }

    return config;
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api
