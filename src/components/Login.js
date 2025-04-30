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

const Login = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(6, "Too Short!")
      .max(40, "Too Long!")
      .required("Required"),
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
          Login
        </Typography>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting, values, handleChange, touched, errors }) => (
            <Form>
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
              {message && (
                <Alert severity="error" sx={{ mt: 2 }}>
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
                  Login
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

export default Login;
