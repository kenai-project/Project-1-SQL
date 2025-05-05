import React, { useEffect, useState } from "react";
import AuthService from "../services/auth.service";
import { Grid, TextField, Button } from "@mui/material";

const Profile = () => {
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await AuthService.getProfile();
        if (response && response.user) {
          setProfile({
            username: response.user.username,
            email: response.user.email,
          });
        } else {
          setError("Failed to load profile.");
        }
      } catch (err) {
        setError("Error fetching profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await AuthService.updateProfile(profile);
      alert("Profile updated successfully.");
    } catch (err) {
      alert("Failed to update profile: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <TextField
          label="Username"
          name="username"
          value={profile.username}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid xs={12}>
        <TextField
          label="Email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid xs={12}>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </Grid>
    </Grid>
  );
};

export default Profile;
