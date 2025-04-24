const express = require('express');
const router = express.Router();
const HL7 = require('../models/HL7'); // Import the HL7 model

// Example parser function (replace with actual HL7 parsing logic)
const parseHL7 = (hl7String) => {
  const segments = hl7String.split('\n').map(line => line.trim()).filter(Boolean);
  const parsed = {};

  segments.forEach(segment => {
    const parts = segment.split('|');
    const segmentType = parts[0];
    parsed[segmentType] = parts;
  });

  return parsed;
};

router.post('/parse-hl7', async (req, res) => {
  const hl7Message = req.body.message;

  if (!hl7Message) {
    return res.status(400).json({ error: 'HL7 message is required.' });
  }

  try {
    // Parse the HL7 message
    const parsedData = parseHL7(hl7Message);

    // Create and save the HL7 record to the database
    const hl7Record = new HL7({
      message: hl7Message,
      parsedData: parsedData
    });

    await hl7Record.save();

    res.status(200).json({
      message: 'HL7 message processed and saved successfully',
      data: {
        rawMessage: hl7Message,
        parsedData: parsedData
      }
    });
  } catch (err) {
    console.error('Error processing HL7:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
