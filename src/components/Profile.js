import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";

const Profile = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    profileImage: currentUser?.profileImage || "",
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!currentUser) {
    return (
      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          User not logged in
        </Typography>
      </Box>
    );
  }

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login", { replace: true });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    // Add password update logic here (API call)
    setMessage("Password updated successfully!");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSave = () => {
    setLoading(true);
    // Add profile update logic here (API call)
    setTimeout(() => {
      setLoading(false);
      setEditMode(false);
      setMessage("Profile updated successfully!");
    }, 1000);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 3 }}>
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Avatar
          src={profileData.profileImage || "/default-profile.png"}
          alt="Profile"
          sx={{ width: 150, height: 150, margin: "auto" }}
        />
        <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
          {currentUser.username}'s Profile
        </Typography>

        {editMode ? (
          <>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={profileData.username}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Profile Image URL"
              name="profileImage"
              value={profileData.profileImage}
              onChange={handleChange}
              margin="normal"
            />

            <Typography variant="h6" sx={{ mt: 3 }}>
              Change Password
            </Typography>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
            />
            {message && (
              <Alert severity={message.includes("successfully") ? "success" : "error"} sx={{ mt: 2 }}>
                {message}
              </Alert>
            )}
            <Box sx={{ mt: 3, position: "relative" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePasswordChange}
                fullWidth
                sx={{ mb: 2 }}
              >
                Change Password
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                fullWidth
                disabled={loading}
              >
                Save Changes
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              )}
            </Box>
          </>
        ) : (
          <>
            <Typography variant="body1">
              <strong>ID:</strong> {currentUser.id}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {currentUser.email}
            </Typography>
            {currentUser.roles && currentUser.roles.length > 0 && !currentUser.roles.includes("ROLE_USER") && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Roles:</Typography>
                <ul>
                  {currentUser.roles.map((role, index) => (
                    <li key={index}>{role.replace("ROLE_", "").toLowerCase()}</li>
                  ))}
                </ul>
              </Box>
            )}
            <Button variant="outlined" color="primary" onClick={() => setEditMode(true)} sx={{ mt: 3 }}>
              Edit Profile
            </Button>
          </>
        )}

        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          sx={{
            mt: 3,
            transition: 'transform 0.3s ease, background-color 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#d32f2f', // Slightly lighter red
              transform: 'scale(1.05)',
            },
          }}
        >
          Logout
        </Button>
      </Paper>
    </Box>
  );
};

export default Profile;
