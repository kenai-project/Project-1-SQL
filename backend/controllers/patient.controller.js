const patientModel = require("../models/patient.model");

async function initializePatientTable(req, res, next) {
  try {
    await patientModel.createTable(req.pgPool);
    next();
  } catch (error) {
    console.error("Error creating patients table:", error);
    res.status(500).json({ message: "Failed to initialize patients table" });
  }
}

async function getPatients(req, res) {
  try {
    const patients = await patientModel.getAllPatients(req.pgPool);
    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
}

async function getPatient(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const patient = await patientModel.getPatientById(req.pgPool, id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Failed to fetch patient" });
  }
}

async function createPatient(req, res) {
  try {
    const newPatient = await patientModel.createPatient(req.pgPool, req.body);
    res.status(201).json(newPatient);
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({ message: "Failed to create patient" });
  }
}

async function updatePatient(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const updatedPatient = await patientModel.updatePatient(req.pgPool, id, req.body);
    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(updatedPatient);
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Failed to update patient" });
  }
}

async function deletePatient(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    await patientModel.deletePatient(req.pgPool, id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ message: "Failed to delete patient" });
  }
}

module.exports = {
  initializePatientTable,
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
};
