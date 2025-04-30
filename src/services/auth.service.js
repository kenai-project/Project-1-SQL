import axios from "axios";

// Define API URL for authentication
const API_URL = "http://localhost:5000/api/auth/";

// Register a new user
const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}register`, { username, email, password });
    return response.data; // ✅ Return registered user data
  } catch (error) {
    console.error("❌ Registration failed:", error.response?.data || error.message);
    throw error; // Re-throw the error for handling
  }
};

// Login and store user details
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}login`, { email, password });

    if (response.data.accessToken) {
      // ✅ Store user details including roles if provided
      const userData = {
        id: response.data.user.id,
        username: response.data.user.username,
        email: response.data.user.email,
        roles: response.data.user.roles || ["User"], // Default role if not provided
        accessToken: response.data.accessToken,
      };

      localStorage.setItem("user", JSON.stringify(userData)); // Save to localStorage
    }

    return response.data;
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data || error.message);
    throw error;
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem("user");
};

// Get the current user from localStorage
const getCurrentUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;

    const user = JSON.parse(storedUser);
    if (!user.accessToken) return null;

    // Decode JWT token to check expiration
    const tokenParts = JSON.parse(atob(user.accessToken.split(".")[1]));
    if (tokenParts.exp * 1000 < Date.now()) {
      console.warn("⚠️ Token expired, logging out...");
      logout();
      return null;
    }
    return user;
  } catch (error) {
    console.error("❌ Error retrieving user:", error);
    logout();
    return null;
  }
};

// Fetch user profile (Protected Route)
const getProfile = async () => {
  const user = getCurrentUser();
  if (!user || !user.accessToken) return null;

  try {
    const response = await axios.get(`${API_URL}profile`, {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch profile:", error.response?.data || error.message);
    return null;
  }
};

// Export AuthService methods
const AuthService = { register, login, logout, getCurrentUser, getProfile };

export default AuthService;
