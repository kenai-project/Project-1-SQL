import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const Profile = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  // Local state to manage profile data in edit mode
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    profileImage: currentUser?.profileImage || '',
  });

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!currentUser) {
    return (
      <div className="container text-center mt-5">
        <h3 className="text-danger">User not logged in</h3>
      </div>
    );
  }

  // Handle logout
  const handleLogout = () => {
    AuthService.logout();
    navigate("/login", { replace: true });
  };

  // Handle change in profile data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle password change
  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Here, you can add logic for updating the password (API call, etc.)
    alert("Password updated successfully!");
    setNewPassword('');
    setConfirmPassword('');
  };

  // Handle the Save changes
  const handleSave = () => {
    // Save logic (API call or localStorage, etc.)
    console.log("Profile updated:", profileData);
    setEditMode(false); // Switch back to view mode after saving
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-lg text-center">
        {/* Profile Image */}
        <img
          src={profileData.profileImage || "/default-profile.png"}
          alt="Profile"
          className="profile-img-card"
          style={{ width: "150px", height: "150px", borderRadius: "50%" }}
        />

        <header>
          <h3><strong>{currentUser.username}</strong>'s Profile</h3>
        </header>
        <hr />

        {/* Show profile data based on edit mode */}
        {editMode ? (
          <>
            <div>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleChange}
                className="form-control mt-2"
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className="form-control mt-2"
              />
            </div>
            <div>
              <label>Profile Image URL:</label>
              <input
                type="text"
                name="profileImage"
                value={profileData.profileImage}
                onChange={handleChange}
                className="form-control mt-2"
              />
            </div>

            <div className="mt-4">
              <h5><strong>Change Password</strong></h5>

              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                className="btn btn-success w-50 mx-auto mt-3"
                onClick={handlePasswordChange}
              >
                Change Password
              </button>
            </div>

            <button className="btn btn-primary w-50 mx-auto mt-3" onClick={handleSave}>
              Save Changes
            </button>
          </>
        ) : (
          <>
            <p><strong>ID:</strong> {currentUser.id}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>

            {/* Conditional rendering for roles */}
            {currentUser.roles && currentUser.roles.length > 0 && !currentUser.roles.includes("ROLE_USER") && (
              <>
                <ul>
                  {currentUser.roles?.map((role, index) => (
                    <li key={index}>{role.replace("ROLE_", "").toLowerCase()}</li>
                  ))}
                </ul>
              </>
            )}

            {/* Edit Profile Button */}
            <button className="btn btn-warning w-50 mx-auto mt-3" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </>
        )}

        {/* Logout Button with adjusted width */}
        <button className="btn btn-danger w-50 mx-auto mt-3" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
