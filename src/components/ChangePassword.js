import React, { useState } from "react";
import AuthService from "../services/auth.service";
import { Grid, TextField, Button, Typography } from "@mui/material";

const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    setLoading(true);
    try {
      await AuthService.updatePassword(form);
      setSuccess("Password updated successfully.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      // Logout user after password change
      AuthService.logout();
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Change Password
      </Typography>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <TextField
            label="Current Password"
            name="currentPassword"
            type="password"
            value={form.currentPassword}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid xs={12}>
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            value={form.newPassword}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid xs={12}>
          <TextField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        {error && (
          <Grid xs={12}>
            <Typography color="error">{error}</Typography>
          </Grid>
        )}
        {success && (
          <Grid xs={12}>
            <Typography color="primary">{success}</Typography>
          </Grid>
        )}
        <Grid xs={12}>
          <Button type="submit" variant="contained" disabled={loading} fullWidth>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ChangePassword;
