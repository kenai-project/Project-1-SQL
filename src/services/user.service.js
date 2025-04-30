import axios from "axios";

const API_URL = "http://localhost:5000/api/";

// ✅ Remove getPublicContent
const getUserBoard = () => {
  return axios.get(API_URL + "user");
};

const getModeratorBoard = () => {
  return axios.get(API_URL + "mod");
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin");
};

const UserService = {
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};

export default UserService;
