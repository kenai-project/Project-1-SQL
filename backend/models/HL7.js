const mongoose = require("mongoose");

const hl7Schema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true
  },
  parsedData: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // Optional: for querying by date
  }
});

// Optional: Add a text index if you want to search raw message text
// hl7Schema.index({ message: 'text' });

const HL7 = mongoose.model("HL7", hl7Schema);
module.exports = HL7;
