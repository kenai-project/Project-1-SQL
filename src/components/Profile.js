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
  Grid,
  Divider,
  useTheme,
} from "@mui/material";

const Profile = () => {
  const theme = useTheme();
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
      <Box sx={{ mt: 5, textAlign: "center", backgroundColor: theme.palette.background.default, borderRadius: 2 }}>
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

  const textFieldSx = {
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "#fff",
    color: theme.palette.text.primary,
    "& .MuiInputBase-input": {
      color: theme.palette.text.primary,
    },
    "& .MuiInputLabel-root": {
      color: theme.palette.text.secondary,
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: theme.palette.divider,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary.main,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
    "& input::placeholder": {
      color: theme.palette.text.disabled,
      opacity: 1,
    },
  };

  const buttonSx = {
    py: 1.5,
    fontWeight: "bold",
  };

  const outlinedButtonSx = {
    mt: 3,
    py: 1.2,
    fontWeight: "bold",
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    "&:hover": {
      borderColor: theme.palette.primary.dark,
      backgroundColor: theme.palette.action.hover,
    },
  };

  const containedButtonSx = {
    mt: 4,
    py: 1.5,
    fontWeight: "bold",
    transition: "transform 0.3s ease, background-color 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
      transform: "scale(1.05)",
    },
  };

  return (
    <Box sx={{ maxWidth: 700, margin: "auto", mt: 5, p: 3, backgroundColor: theme.palette.background.default }}>
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 2,
          textAlign: "center",
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Avatar
          src={profileData.profileImage || "/default-profile.png"}
          alt="Profile"
          sx={{ width: 160, height: 160, margin: "auto", boxShadow: 3 }}
        />
        <Typography
          variant="h4"
          sx={{ mt: 3, mb: 3, fontWeight: "bold", color: theme.palette.text.primary }}
        >
          {currentUser.username}'s Profile
        </Typography>

        {editMode ? (
          <Box component="form" noValidate autoComplete="off">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={profileData.username}
                  onChange={handleChange}
                  margin="normal"
                  sx={textFieldSx}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  margin="normal"
                  sx={textFieldSx}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Profile Image URL"
                  name="profileImage"
                  value={profileData.profileImage}
                  onChange={handleChange}
                  margin="normal"
                  sx={textFieldSx}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "medium", color: theme.palette.text.primary }}
            >
              Change Password
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  margin="normal"
                  sx={textFieldSx}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  margin="normal"
                  sx={textFieldSx}
                />
              </Grid>
            </Grid>
            {message && (
              <Alert
                severity={message.includes("successfully") ? "success" : "error"}
                sx={{
                  mt: 3,
                  backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : undefined,
                  color: theme.palette.text.primary,
                }}
              >
                {message}
              </Alert>
            )}
            <Box sx={{ mt: 4, position: "relative" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePasswordChange}
                fullWidth
                sx={{ ...buttonSx, mb: 2 }}
              >
                Change Password
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                fullWidth
                disabled={loading}
                sx={buttonSx}
              >
                Save Changes
              </Button>
              {loading && (
                <CircularProgress
                  size={28}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-14px",
                    marginLeft: "-14px",
                    color: theme.palette.primary.main,
                  }}
                />
              )}
            </Box>
          </Box>
        ) : (
          <>
            <Typography
              variant="body1"
              sx={{ textAlign: "left", mb: 1, color: theme.palette.text.primary }}
            >
              <strong>ID:</strong> {currentUser.id}
            </Typography>
            <Typography
              variant="body1"
              sx={{ textAlign: "left", mb: 1, color: theme.palette.text.primary }}
            >
              <strong>Email:</strong> {currentUser.email}
            </Typography>
            {/* Removed roles display as per user request */}
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setEditMode(true)}
              sx={outlinedButtonSx}
            >
              Edit Profile
            </Button>
          </>
        )}

        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          sx={containedButtonSx}
        >
          Logout
        </Button>
      </Paper>
    </Box>
  );
};

export default Profile;
