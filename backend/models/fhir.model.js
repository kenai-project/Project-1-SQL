const mongoose = require("mongoose");

const fhirSchema = new mongoose.Schema({
  data: {
    type: Object,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("FhirRecord", fhirSchema);
