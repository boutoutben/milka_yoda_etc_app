import axios from "axios";


const API_BASE_URL = "http://localhost:5000/api";

const getFetchApi = async (endpoint, options = {}) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
            timeout: 30000,        // Timeout of 30 seconds
            ...options,            // Allow custom headers or other configurations
            withCredentials: true  // Important for sending cookies with CORS requests
        });
        return response.data;     // Return only the data from the response
    } catch (err) {

        console.error("❌ Erreur API :", err?.response?.data || err.message);
    
        // Build a clean error object
        const error = new Error(err.response?.data?.message || err.message || "API error");
        error.status = err.response?.status;
        throw error; // 💥 Throw the error so it can be caught with .catch()
      }
};

export default getFetchApi;