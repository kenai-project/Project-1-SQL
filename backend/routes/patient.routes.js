const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patient.controller");

// Initialize patients table before handling any requests
// Temporarily disable to debug 404 issue
// router.use(patientController.initializePatientTable);

// GET /api/patients - get all patients
router.get("/", patientController.getPatients);

// GET /api/patients/:id - get patient by id
router.get("/:id", patientController.getPatient);

// POST /api/patients - create new patient
router.post("/", patientController.createPatient);

// PUT /api/patients/:id - update patient by id
router.put("/:id", patientController.updatePatient);

// DELETE /api/patients/:id - delete patient by id
router.delete("/:id", patientController.deletePatient);

module.exports = router;
