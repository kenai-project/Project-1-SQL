import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";
import About from "./components/About";
import ContactUs from "./components/ContactUs";
import PrivateRoute from "./components/PrivateRoute";
import Report from "./components/Report";
import FHIRUploader from "../../Project-1/src/components/FHIRUploader";
import HL7Uploader from "../../Project-1/src/components/HL7Uploader";
import PatientManager from "./components/PatientManager";

import EventBus from "./common/EventBus";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


const App = () => {
  const [theme, setTheme] = useState("dark");
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [, setModalPosition] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)

    const logOut = () => {
      AuthService.logout();
      setShowModeratorBoard(false);
      setShowAdminBoard(false);
      setCurrentUser(null);
      setShowProfileModal(false);
      navigate("/login");
    };

    const user = AuthService.getCurrentUser();
    if (user && user.roles) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", logOut);
    return () => {
      EventBus.remove("logout", logOut);
    };
  }, [navigate, theme]);

  const handleLogout = () => {
    AuthService.logout();
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(null);
    setShowProfileModal(false);
    navigate("/login");
  };

  const handleMouseEnter = (e) => {
    const profileImage = e.target.getBoundingClientRect();
    setModalPosition({
      top: profileImage.bottom + window.scrollY + 10,
      left: profileImage.left + window.scrollX - 50,
    });
    setShowProfileModal(true);
  };

  const handleProfileClick = () => {
    setShowProfileModal(false);
    navigate("/profile");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">Personicle</Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
            // aria-controls="navbarNav"
            // aria-expanded="false"
            // aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
              <li className="nav-item"><Link to="/about" className="nav-link">About</Link></li>
              <li className="nav-item"><Link to="/contactus" className="nav-link">Contact Us</Link></li>

              {currentUser && (
                <>
                  <li className="nav-item">
                    <Link to="/fhir" className="nav-link">FHIR</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/hl7" className="nav-link">HL7</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/report" className="nav-link">Report</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/patients" className="nav-link">Patients</Link>
                  </li>
                </>
              )}
              {showModeratorBoard && <li className="nav-item"><Link to="/mod" className="nav-link">Moderator</Link></li>}
              {showAdminBoard && <li className="nav-item"><Link to="/admin" className="nav-link">Admin</Link></li>}
            </ul>
            <ul className="navbar-nav ms-auto">
            <li className="nav-item">
                <button onClick={toggleTheme} className="btn btn-outline-light btn-sm me-2">
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
              </li>
              {currentUser ? (
                <li className="nav-item" style={{ position: "relative" }}>
                  <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={() => setShowProfileModal(false)}
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <div
                      className="nav-link d-flex align-items-center"
                      onMouseEnter={handleMouseEnter}
                      onClick={handleProfileClick}
                      style={{ cursor: "pointer" }}
                    >
                      <img 
                        src={currentUser?.profileImageUrl || "/default-profile.jpg"} 
                        alt="Profile" 
                        className="rounded-circle" 
                        width="30" 
                        height="30" 
                      />
                      <span className="ms-2">{currentUser?.username}</span>
                    </div>

                    {showProfileModal && (
                      <div className="profile-modal">
                        <p onClick={handleProfileClick}>{currentUser?.username}</p>
                        <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                          Log Out
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ) : (
                <>
                  <li className="nav-item"><Link to="/register" className="btn btn-primary btn-sm mx-1">Sign Up</Link></li>
                  <li className="nav-item"><Link to="/login" className="btn btn-success btn-sm mx-1">Login</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Routes */} 
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/mod" element={<PrivateRoute roles={["ROLE_MODERATOR"]}><BoardModerator /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute roles={["ROLE_ADMIN"]}><BoardAdmin /></PrivateRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/fhir" element={
            <PrivateRoute>
              <FHIRUploader />
            </PrivateRoute>
          } />
          <Route path="/hl7" element={
            <PrivateRoute>
              <HL7Uploader />
            </PrivateRoute>
          } />
          <Route path="/report" element={
            <PrivateRoute>
              <Report />
            </PrivateRoute>
          } />
          <Route path="/patients" element={
            <PrivateRoute>
              <PatientManager />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </div>
  );
};

export default App;
