import axios from "axios";

const API_BASE_URL = "https://project-1-backend-1lt0.onrender.com";

export const getSomeData = () => {
  return axios.get(`${API_BASE_URL}/api/your-endpoint`);
};
