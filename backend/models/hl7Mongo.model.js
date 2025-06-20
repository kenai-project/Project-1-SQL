const mongoose = require('mongoose');

const HL7Schema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  parsed_data: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const HL7Record = mongoose.model('HL7Record', HL7Schema);

module.exports = HL7Record;
