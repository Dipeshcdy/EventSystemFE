import axios from 'axios';
import toast from 'react-hot-toast';

let token = null;
let logoutFn = null; // Placeholder for the logout function
let hasShownTokenError = false ;

export const setLogoutFunction = (logout) => {
  logoutFn = logout;
};

export const setAuthToken = (accessToken) => {
  token = accessToken;
  let hasShownTokenError = false ;
};
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle request errors
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const defaultMessage = 'Something went wrong. Please try again.';
    const status = error?.response?.status;

    if (status === 401 && logoutFn) {
      logoutFn();
    }

    const message =
      error?.response?.data?.message ||
      error?.message ||
      defaultMessage;

    toast.error(
      status === 401 ? 'Unauthorized access. Logging out...' : message
    );
    return Promise.reject(error);
  }
);
export default axiosInstance;
