import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Eye, EyeOff } from "lucide-react"; // Eye icons for toggling visibility
import * as Yup from "yup";
import AuthService from "../services/auth.service";
import "./Login.css"; // Ensure you have styles for password toggle

const Login = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Too Short!").max(40, "Too Long!").required("Required"),
  });

  const handleLogin = async (values) => {
    setMessage("");
    setLoading(true);

    try {
      await AuthService.login(values.email, values.password);
      navigate("/", { replace: true });
    } catch (error) {
      setMessage(error?.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-md-12 login-container">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form>
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
                <button type="submit" className="btn btn-primary" disabled={isSubmitting || loading}>
                  {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                  Login
                </button>
              </div>

              {message && (
                <div className="form-group mt-3">
                  <div className="alert alert-danger" role="alert">{message}</div>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
