import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/";

// Update user profile
const updateProfile = async (profileData) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.accessToken) {
    throw new Error("User not authenticated");
  }

  try {
    const response = await axios.put(`${API_URL}profile`, profileData, {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to update profile:", error.response?.data || error.message);
    throw error;
  }
};

const userService = {
  updateProfile,
};

export default userService;
