import axios from 'axios';

// Create Axios Instance
const api = axios.create({
    baseURL: 'http://localhost:8000', // Backend URL
    withCredentials: true, // IMPORTANT: Sends HTTPOnly Cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response Interceptor for Error Handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // If 401 Unauthorized, maybe redirect to login (client-side only behavior)
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                // Optional: window.location.href = '/login'; 
            }
        }
        return Promise.reject(error);
    }
);

export default api;
