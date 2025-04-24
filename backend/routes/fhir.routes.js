const express = require("express");
const router = express.Router();
const FhirRecord = require("../models/fhir.model");

// POST /api/fhir/parse-fhir
router.post("/parse-fhir", async (req, res) => {
  try {
    const fhirData = req.body;

    if (!fhirData || Object.keys(fhirData).length === 0) {
      return res.status(400).json({ message: "No FHIR data provided" });
    }

    console.log("✅ Received FHIR data:", fhirData);

    // Save to MongoDB
    const newFhirRecord = new FhirRecord({ data: fhirData });
    await newFhirRecord.save();

    res.status(200).json({ message: "FHIR data saved successfully" });
  } catch (error) {
    console.error("❌ Error saving FHIR data:", error);
    res.status(500).json({ message: "Server error while saving FHIR data" });
  }
});

module.exports = router;
