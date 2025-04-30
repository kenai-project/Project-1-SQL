const express = require("express");
const router = express.Router();
const { insertFhirRecord } = require("../models/fhir.model");
const { getFHIRPatients, deleteFHIRPatient } = require("../controllers/fhir.controller");

// POST /api/fhir/parse-fhir
router.post("/parse-fhir", async (req, res) => {
  try {
    const fhirData = req.body;

    if (!fhirData || Object.keys(fhirData).length === 0) {
      return res.status(400).json({ message: "No FHIR data provided" });
    }

    console.log("✅ Received FHIR data:", fhirData);

    // Save to PostgreSQL using insert function
    await insertFhirRecord(fhirData);

    res.status(200).json({ message: "FHIR data saved successfully" });
  } catch (error) {
    console.error("❌ Error saving FHIR data:", error);
    res.status(500).json({ message: "Server error while saving FHIR data" });
  }
});

router.get("/patients", getFHIRPatients);
router.delete("/patients/:id", deleteFHIRPatient);

module.exports = router;
