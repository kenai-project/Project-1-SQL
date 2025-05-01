const API_URL = "http://localhost:5000/api/auth";

async function updatePassword(currentPassword, newPassword, confirmPassword) {
  const response = await fetch(`${API_URL}/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update password");
  }
  return response.json();
}

const userService = {
  updatePassword,
};

export default userService;
