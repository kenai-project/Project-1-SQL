const mongoose = require("mongoose");

const HL7LogSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  ack: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("HL7Log", HL7LogSchema);
