import React, { useEffect, useState } from "react";
import patientService from "../services/patient.service";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import PatientForm from "./PatientForm";

const emptyPatient = {
  first_name: "",
  last_name: "",
  date_of_birth: "",
  gender: "",
  address: "",
  phone: "",
  email: "",
};

function formatDate(dateString) {
  if (!dateString) return "";
  // Handle HL7 date format (YYYYMMDD) by inserting dashes
  if (/^\d{8}$/.test(dateString)) {
    return dateString.slice(0, 4) + "-" + dateString.slice(4, 6) + "-" + dateString.slice(6, 8);
  }
  const date = new Date(dateString);
  if (isNaN(date)) return dateString; // fallback if invalid date
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

// Helper to map FHIR Patient resource to internal patient object, excluding empty fields
function mapFHIRPatientToInternal(fhirPatient) {
  const patient = {};
  if (fhirPatient.data) {
    const data = fhirPatient.data;
    // Extract name
    if (Array.isArray(data.name) && data.name.length > 0) {
      const officialName = data.name.find((n) => n.use === "official") || data.name[0];
      if (officialName.family) patient.last_name = officialName.family;
      if (officialName.given && officialName.given.length > 0) patient.first_name = officialName.given[0];
    }
    // Extract gender
    if (data.gender) patient.gender = data.gender;
    // Extract birthDate
    if (data.birthDate) patient.date_of_birth = data.birthDate;
    // Additional fields can be added here if present in FHIR resource
  }
  return patient;
}

function PatientManager() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState(emptyPatient);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    setLoading(true);
    setError(null);
    try {
      // Fetch patients from all three sources concurrently
      const [standardPatients, hl7Patients, fhirPatients] = await Promise.all([
        patientService.getPatients(),
        patientService.getHL7Patients(),
        patientService.getFHIRPatients(),
      ]);

      // Merge patients, avoiding duplicates by id
      const mergedPatientsMap = new Map();

      standardPatients.forEach((p) => {
        mergedPatientsMap.set(p.id, { ...p, source: "standard" });
      });

      hl7Patients.forEach((p) => {
        if (!mergedPatientsMap.has(p.id)) {
          mergedPatientsMap.set(p.id, { ...p, source: "hl7" });
        }
      });

      fhirPatients.forEach((p) => {
        if (!mergedPatientsMap.has(p.id)) {
          const mappedPatient = mapFHIRPatientToInternal(p);
          // Only add if mappedPatient has at least one non-empty field
          if (Object.keys(mappedPatient).length > 0) {
            mergedPatientsMap.set(p.id, { id: p.id, ...mappedPatient, source: "fhir" });
          }
        }
      });

      setPatients(Array.from(mergedPatientsMap.values()));
    } catch (err) {
      setError(err.message || "Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(patient) {
    if (patient.source !== "standard") {
      setError("Editing is only supported for standard patients.");
      return;
    }
    setEditingPatient(patient.id);
    setFormData(patient);
  }

  function cancelEdit() {
    setEditingPatient(null);
    setFormData(emptyPatient);
  }

  async function handleSubmit(values) {
    setError(null);
    try {
      if (editingPatient) {
        await patientService.updatePatient(editingPatient, values);
        setSuccessMessage("Patient updated successfully");
      } else {
        await patientService.createPatient(values);
        setSuccessMessage("Patient added successfully");
      }
      cancelEdit();
      fetchPatients();
    } catch (err) {
      setError(err.message || "Failed to save patient");
    }
  }

  function handleDeleteClick(patient) {
    if (patient.source !== "standard" && patient.source !== "hl7" && patient.source !== "fhir") {
      setError("Delete is not supported for this patient.");
      return;
    }
    setPatientToDelete(patient);
    setDeleteDialogOpen(true);
  }

  async function handleDeleteConfirm() {
    setError(null);
    try {
      if (patientToDelete.source === "standard") {
        await patientService.deletePatient(patientToDelete.id);
      } else if (patientToDelete.source === "hl7") {
        await patientService.deleteHL7Patient(patientToDelete.id);
      } else if (patientToDelete.source === "fhir") {
        await patientService.deleteFHIRPatient(patientToDelete.id);
      }
      setSuccessMessage("Patient deleted successfully");
      fetchPatients();
    } catch (err) {
      setError(err.message || "Failed to delete patient");
    } finally {
      setDeleteDialogOpen(false);
      setPatientToDelete(null);
    }
  }

  function handleDeleteCancel() {
    setDeleteDialogOpen(false);
    setPatientToDelete(null);
  }

  function handleCloseSnackbar() {
    setError(null);
    setSuccessMessage(null);
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, mb: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
        Patient Manager
      </Typography>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={successMessage}
      />
      <Snackbar open={!!error} autoHideDuration={3000} onClose={handleCloseSnackbar} message={error} />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 4, maxHeight: 600, overflowY: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Date of Birth</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id} hover>
                    <TableCell>{patient.first_name}</TableCell>
                    <TableCell>{patient.last_name}</TableCell>
                    <TableCell>{formatDate(patient.date_of_birth)}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.address}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.source}</TableCell>
                    <TableCell align="center">
                      <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => startEdit(patient)}>
                        Edit
                      </Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteClick(patient)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: "bold", color: "#1976d2" }}>
            {editingPatient ? "Edit Patient" : "Add New Patient"}
          </Typography>

          <PatientForm
            initialValues={formData}
            onSubmit={handleSubmit}
            onCancel={cancelEdit}
            isEditing={!!editingPatient}
          />

          <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>Are you sure you want to delete this patient?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel}>Cancel</Button>
              <Button onClick={handleDeleteConfirm} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
}

export default PatientManager;
