import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { Eye, EyeOff } from "lucide-react";
import * as Yup from "yup";
import AuthService from "../services/auth.service";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";

const Register = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        mt: 8,
        p: 3,
      }}
    >
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Sign Up
        </Typography>
        <Formik
          initialValues={{ username: "", email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ isSubmitting, values, handleChange, touched, errors }) => (
            <Form>
              {!successful && (
                <>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Username"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            aria-label="toggle password visibility"
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              )}
              {message && (
                <Alert severity={successful ? "success" : "error"} sx={{ mt: 2 }}>
                  {message}
                </Alert>
              )}
              <Box sx={{ mt: 3, position: "relative" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting || loading}
                >
                  Sign Up
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
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default Register;
