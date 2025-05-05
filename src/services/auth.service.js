import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/";

// Register a new user
const register = async (username, email, password) => {
  try {
    const response = await axios.post(API_URL + "register", { username, email, password });
    return response.data;
  } catch (error) {
    console.error("❌ Registration failed:", error.response?.data || error.message);
    throw error;
  }
};

// Login and store user details
const login = async (email, password) => {
  try {
    const response = await axios.post(API_URL + "login", { email, password });

    if (response.data.accessToken) {
      const userData = {
        id: response.data.user.id,
        username: response.data.user.username,
        email: response.data.user.email,
        roles: response.data.user.roles || ["User"],
        accessToken: response.data.accessToken,
      };

      localStorage.setItem("user", JSON.stringify(userData));
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

// Refresh token function (optional, if backend supports refresh tokens)
const refreshToken = async () => {
  try {
    const response = await axios.post(API_URL + "refresh-token", {}, {
      withCredentials: true, // if refresh token is stored in httpOnly cookie
    });
    if (response.data.accessToken) {
      const user = getCurrentUser();
      if (user) {
        user.accessToken = response.data.accessToken;
        localStorage.setItem("user", JSON.stringify(user));
      }
      return response.data.accessToken;
    }
    return null;
  } catch (error) {
    console.error("❌ Failed to refresh token:", error.response?.data || error.message);
    logout();
    return null;
  }
};

// Fetch user profile (Protected Route)
const getProfile = async () => {
  let user = getCurrentUser();
  if (!user || !user.accessToken) return null;

  try {
    const response = await axios.get(API_URL + "profile", {
      headers: { Authorization: "Bearer " + user.accessToken },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Try refreshing token once
      const newToken = await refreshToken();
      if (newToken) {
        user = getCurrentUser();
        const retryResponse = await axios.get(API_URL + "profile", {
          headers: { Authorization: "Bearer " + user.accessToken },
        });
        return retryResponse.data;
      }
    }
    console.error("❌ Failed to fetch profile:", error.response?.data || error.message);
    return null;
  }
};

const updateProfile = async (profileData) => {
  let user = getCurrentUser();
  if (!user || !user.accessToken) return null;

  try {
    const response = await axios.put(API_URL + "profile", profileData, {
      headers: { Authorization: "Bearer " + user.accessToken },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to update profile:", error.response?.data || error.message);
    return null;
  }
};

const AuthService = { register, login, logout, getCurrentUser, getProfile, refreshToken, updateProfile };

console.log("AuthService loaded. Current user in localStorage:", localStorage.getItem("user"));

export default AuthService;
