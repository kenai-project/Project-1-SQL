const HL7 = require("hl7"); // HL7.js library for parsing
const HL7Record = require("../models/HL7Record"); // Import the HL7Record model

exports.parseHL7 = async (req, res) => {
  try {
    const { hl7Message } = req.body;

    // Validate that hl7Message exists in the request body
    if (!hl7Message) {
      return res.status(400).json({ error: "HL7 message is required" });
    }

    // Attempt to parse the HL7 message
    let parsed;
    try {
      parsed = HL7.parseString(hl7Message); // Assuming this method returns a JavaScript object
    } catch (parseError) {
      return res.status(400).json({ error: "Invalid HL7 message format" });
    }

    // Create a new record with both raw message and parsed data
    const newRecord = new HL7Record({
      rawMessage: hl7Message,
      parsedData: parsed, // Store parsed data as an object
    });

    // Save the record to the database
    await newRecord.save();

    // Return success response with the saved record
    res.status(201).json({ message: "HL7 parsed and saved", data: newRecord });
  } catch (err) {
    console.error("❌ HL7 Parse Error:", err);
    res.status(500).json({ error: "Failed to parse HL7" });
  }
};
