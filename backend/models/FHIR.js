const mongoose = require("mongoose");

const fhirSchema = new mongoose.Schema({
  resourceType: { type: String, required: true },
  data: { type: Object, required: true },  // Store the parsed FHIR data
  createdAt: { type: Date, default: Date.now },
});

const FHIR = mongoose.model("FHIR", fhirSchema);
module.exports = FHIR;
