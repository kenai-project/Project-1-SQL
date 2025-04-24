import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Eye, EyeOff } from "lucide-react"; // Import icons
import * as Yup from "yup";
import AuthService from "../services/auth.service";
import "./Register.css"; 

const Register = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3, "Too Short!").max(20, "Too Long!").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Too Short!").max(40, "Too Long!").required("Required"),
  });

  const handleRegister = async (values) => {
    setMessage("");
    setSuccessful(false);
    setLoading(true);

    try {
      const response = await AuthService.register(values.username, values.email, values.password);
      setMessage(response?.data?.message || "Registration successful!");
      setSuccessful(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error?.response?.data?.message || "Something went wrong!");
      setSuccessful(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Formik
          initialValues={{ username: "", email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ isSubmitting }) => (
            <Form>
              {!successful && (
                <>
                  <div className="form-group mb-3">
                    <label htmlFor="username">Username</label>
                    <Field type="text" className="form-control" name="username" />
                    <ErrorMessage name="username" component="div" className="invalid-feedback d-block" />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="email">Email</label>
                    <Field type="email" className="form-control" name="email" />
                    <ErrorMessage name="email" component="div" className="invalid-feedback d-block" />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="password">Password</label>
                    <div className="password-input-container">
                      <Field 
                        type={showPassword ? "text" : "password"} 
                        className="form-control" 
                        name="password" 
                      />
                      <span 
                        className="toggle-password" 
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </span>
                    </div>
                    <ErrorMessage name="password" component="div" className="invalid-feedback d-block" />
                  </div>

                  <div className="form-group d-grid">
                    <button className="btn btn-primary" disabled={isSubmitting || loading}>
                      {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                      Sign Up
                    </button>
                  </div>
                </>
              )}

              {message && (
                <div className="form-group mt-3">
                  <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                    {message}
                  </div>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
