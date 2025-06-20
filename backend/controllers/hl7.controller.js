const { insertHL7Record, getHL7Records } = require("../models/HL7Record");
const { createPatient, getAllPatients, updatePatient } = require("../models/patient.model");
const HL7MongoRecord = require("../models/hl7Mongo.model");  // added

// Basic custom HL7 parser function (splits message into segments and fields)
function parseHL7Message(message) {
  const segments = message.split('\\r');
  const parsed = segments.map(segment => {
    const fields = segment.split('|');
    return { segment: fields[0], fields: fields.slice(1) };
  });
  return parsed;
}

async function extractPatientFromPID(parsed) {
  if (!Array.isArray(parsed)) return null;
  const pidSegment = parsed.find(segment => segment.segment === "PID");
  if (!pidSegment) return null;
  const fields = pidSegment.fields;
  return {
    first_name: fields[4] ? fields[4].split('^')[1] || '' : '',
    last_name: fields[4] ? fields[4].split('^')[0] || '' : '',
    date_of_birth: fields[6] || '',
    gender: fields[7] || '',
    address: fields[10] || '',
    phone: fields[12] || '',
    email: '', // HL7 may not have email in PID segment
  };
}

exports.parseHL7 = async (req, res) => {
  try {
    const { hl7Message } = req.body;

    if (!hl7Message) {
      return res.status(400).json({ error: "HL7 message is required" });
    }

    // Parse HL7 message using custom parser
    const parsed = parseHL7Message(hl7Message);

    // Save the record to PostgreSQL using the new model function
    const newRecord = await insertHL7Record(hl7Message, parsed);

    // Save the record to MongoDB using mongoose model
    const mongoRecord = new HL7MongoRecord({
      message: hl7Message,
      parsed_data: parsed,
    });
    await mongoRecord.save();

    // Extract patient info from PID segment
    const patientData = await extractPatientFromPID(parsed);
    if (patientData) {
      // Check if patient already exists by matching first_name, last_name, and date_of_birth
      const allPatients = await getAllPatients(req.pgPool);
      const existingPatient = allPatients.find(p =>
        p.first_name === patientData.first_name &&
        p.last_name === patientData.last_name &&
        p.date_of_birth.toISOString().split('T')[0] === formatDate(patientData.date_of_birth)
      );

      if (existingPatient) {
        // Update existing patient, including date_of_birth formatting
        const updatedPatientData = {
          ...patientData,
          date_of_birth: formatDate(patientData.date_of_birth),
        };
        await updatePatient(req.pgPool, existingPatient.id, updatedPatientData);
      } else {
        // Create new patient, including date_of_birth formatting
        const newPatientData = {
          ...patientData,
          date_of_birth: formatDate(patientData.date_of_birth),
        };
        await createPatient(req.pgPool, newPatientData);
      }
    }

    res.status(201).json({ message: "HL7 parsed and saved", data: newRecord });
  } catch (err) {
    console.error("❌ HL7 Parse Error:", err);
    res.status(500).json({ error: "Failed to parse HL7" });
  }
};

function formatDate(dateString) {
  if (!dateString) return null;
  // Handle HL7 date format (YYYYMMDD) by inserting dashes
  if (/^\d{8}$/.test(dateString)) {
    return dateString.slice(0, 4) + "-" + dateString.slice(4, 6) + "-" + dateString.slice(6, 8);
  }
  const date = new Date(dateString);
  if (isNaN(date)) return null; // fallback if invalid date
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

exports.getHL7Patients = async (req, res) => {
  try {
    // Fetch all HL7 records from database
    const records = await getHL7Records();

    // Extract patient info from each record's parsed data (PID segment)
    const patients = records.map(record => {
      let parsedData = record.parsed_data;
      if (typeof parsedData === 'string') {
        try {
          parsedData = JSON.parse(parsedData);
        } catch (e) {
          parsedData = [];
        }
      }
      if (!Array.isArray(parsedData)) {
        parsedData = [];
      }
      const pidSegment = parsedData.find(segment => segment.segment === "PID");
      if (!pidSegment) return null;

      // Extract fields from PID segment (example indices)
      const fields = pidSegment.fields;
      return {
        id: record.id,
        first_name: fields[4] ? fields[4].split('^')[1] || '' : '',
        last_name: fields[4] ? fields[4].split('^')[0] || '' : '',
        date_of_birth: fields[6] || '',
        gender: fields[7] || '',
        address: fields[10] || '',
        phone: fields[12] || '',
        email: '', // HL7 may not have email in PID segment
      };
    }).filter(p => p !== null);

    res.status(200).json(patients);
  } catch (err) {
    console.error("❌ Error fetching HL7 patients:", err);
    res.status(500).json({ error: "Failed to fetch HL7 patients" });
  }
};

exports.deleteHL7Patient = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const { deleteHL7Record } = require("../models/HL7Record");
    await deleteHL7Record(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting HL7 patient:", error);
    res.status(500).json({ message: "Failed to delete HL7 patient" });
  }
};

exports.getHL7Patients = async (req, res) => {
  try {
    // Fetch all HL7 records from database
    const records = await getHL7Records();

    // Extract patient info from each record's parsed data (PID segment)
    const patients = records.map(record => {
      let parsedData = record.parsed_data;
      if (typeof parsedData === 'string') {
        try {
          parsedData = JSON.parse(parsedData);
        } catch (e) {
          parsedData = [];
        }
      }
      if (!Array.isArray(parsedData)) {
        parsedData = [];
      }
      const pidSegment = parsedData.find(segment => segment.segment === "PID");
      if (!pidSegment) return null;

      // Extract fields from PID segment (example indices)
      const fields = pidSegment.fields;
      return {
        id: record.id,
        first_name: fields[4] ? fields[4].split('^')[1] || '' : '',
        last_name: fields[4] ? fields[4].split('^')[0] || '' : '',
        date_of_birth: fields[6] || '',
        gender: fields[7] || '',
        address: fields[10] || '',
        phone: fields[12] || '',
        email: '', // HL7 may not have email in PID segment
      };
    }).filter(p => p !== null);

    res.status(200).json(patients);
  } catch (err) {
    console.error("❌ Error fetching HL7 patients:", err);
    res.status(500).json({ error: "Failed to fetch HL7 patients" });
  }
};

exports.deleteHL7Patient = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const { deleteHL7Record } = require("../models/HL7Record");
    await deleteHL7Record(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting HL7 patient:", error);
    res.status(500).json({ message: "Failed to delete HL7 patient" });
  }
};
