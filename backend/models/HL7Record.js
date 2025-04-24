const mongoose = require("mongoose");

// Define the schema for HL7 records
const HL7RecordSchema = new mongoose.Schema({
  rawMessage: { 
    type: String, 
    required: true,  // Store the raw HL7 message 
    trim: true       // Optional: Remove any extra spaces
  },
  parsedData: { 
    type: mongoose.Schema.Types.Mixed, // Store parsed HL7 data as an object
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now // Automatically set the timestamp
  }
});

// Create and export the HL7Record model
module.exports = mongoose.model("HL7Record", HL7RecordSchema);
