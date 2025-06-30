const express = require('express');
const router = express.Router();
const HL7MongoRecord = require('../models/hl7Mongo.model');

router.post('/test-hl7', async (req, res) => {
  try {
    const sampleHL7Message = "MSH|^~\\&|SendingApp|SendingFac|ReceivingApp|ReceivingFac|202306201200||ADT^A01|MSG00001|P|2.3\rPID|1||123456^^^Hospital^MR||Doe^John||19800101|M|||123 Main St^^Metropolis^NY^12345||(555)555-5555|||M|123456789|987-65-4321\r";

    const parsedData = sampleHL7Message.split('\r').map(segment => {
      const fields = segment.split('|');
      return { segment: fields[0], fields: fields.slice(1) };
    });

    const mongoRecord = new HL7MongoRecord({
      message: sampleHL7Message,
      parsed_data: parsedData,
    });

    await mongoRecord.save();

    res.status(201).json({ message: 'Sample HL7 message saved to MongoDB', data: mongoRecord });
  } catch (error) {
    console.error('Error saving sample HL7 message:', error);
    res.status(500).json({ error: 'Failed to save sample HL7 message' });
  }
});

module.exports = router;
