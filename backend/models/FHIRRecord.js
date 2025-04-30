const mongoose = require("mongoose");

const FHIRRecordSchema = new mongoose.Schema({
  resourceType: String,
  data: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FHIRRecord", FHIRRecordSchema);
