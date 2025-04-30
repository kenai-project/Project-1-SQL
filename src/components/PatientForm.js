import React from "react";
import { Box, TextField, Select, MenuItem, Button, Paper } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const PatientForm = ({ initialValues, onSubmit, onCancel, isEditing }) => {
  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    date_of_birth: Yup.date().required("Date of birth is required"),
    gender: Yup.string().required("Gender is required"),
    email: Yup.string().email("Invalid email format"),
    phone: Yup.string(),
    address: Yup.string(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
    enableReinitialize: true,
  });

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: "#1565c0", maxWidth: 600 }}>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: "grid", gap: 2 }}>
        <TextField
          label="First Name"
          name="first_name"
          value={formik.values.first_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.first_name && Boolean(formik.errors.first_name)}
          helperText={formik.touched.first_name && formik.errors.first_name}
          required
          fullWidth
          InputLabelProps={{ style: { color: "#fff" } }}
          sx={{ input: { color: "#fff" } }}
        />
        <TextField
          label="Last Name"
          name="last_name"
          value={formik.values.last_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.last_name && Boolean(formik.errors.last_name)}
          helperText={formik.touched.last_name && formik.errors.last_name}
          required
          fullWidth
          InputLabelProps={{ style: { color: "#fff" } }}
          sx={{ input: { color: "#fff" } }}
        />
        <TextField
          label="Date of Birth"
          name="date_of_birth"
          type="date"
          value={formik.values.date_of_birth}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.date_of_birth && Boolean(formik.errors.date_of_birth)}
          helperText={formik.touched.date_of_birth && formik.errors.date_of_birth}
          required
          fullWidth
          InputLabelProps={{ shrink: true, style: { color: "#fff" } }}
          sx={{ input: { color: "#fff" } }}
        />
        <Select
          label="Gender"
          name="gender"
          value={formik.values.gender}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          displayEmpty
          fullWidth
          required
          error={formik.touched.gender && Boolean(formik.errors.gender)}
          sx={{
            color: "#fff",
            ".MuiSelect-icon": { color: "#fff" },
            ".MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: "#1565c0",
                color: "#fff",
              },
            },
          }}
        >
          <MenuItem value="" disabled sx={{ color: "#fff" }}>
            Select Gender
          </MenuItem>
          <MenuItem value="Male" sx={{ color: "#fff" }}>
            Male
          </MenuItem>
          <MenuItem value="Female" sx={{ color: "#fff" }}>
            Female
          </MenuItem>
          <MenuItem value="Other" sx={{ color: "#fff" }}>
            Other
          </MenuItem>
        </Select>
        <TextField
          label="Address"
          name="address"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          InputLabelProps={{ style: { color: "#fff" } }}
          sx={{ input: { color: "#fff" } }}
        />
        <TextField
          label="Phone"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          InputLabelProps={{ style: { color: "#fff" } }}
          sx={{ input: { color: "#fff" } }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          fullWidth
          InputLabelProps={{ style: { color: "#fff" } }}
          sx={{ input: { color: "#fff" } }}
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button type="submit" variant="contained" color="secondary">
            {isEditing ? "Update" : "Add"}
          </Button>
          {isEditing && (
            <Button variant="outlined" color="inherit" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default PatientForm;
