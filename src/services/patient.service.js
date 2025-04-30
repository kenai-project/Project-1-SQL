const API_URL = "http://localhost:5000/api/patients";
const HL7_API_URL = "http://localhost:5000/api/hl7/patients";
const FHIR_API_URL = "http://localhost:5000/api/fhir/patients";

async function getPatients() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch patients");
  }
  return response.json();
}

async function getHL7Patients() {
  const response = await fetch(HL7_API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch HL7 patients");
  }
  return response.json();
}

async function getFHIRPatients() {
  const response = await fetch(FHIR_API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch FHIR patients");
  }
  return response.json();
}

async function getPatient(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch patient");
  }
  return response.json();
}

async function createPatient(patient) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patient),
  });
  if (!response.ok) {
    throw new Error("Failed to create patient");
  }
  return response.json();
}

async function updatePatient(id, patient) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patient),
  });
  if (!response.ok) {
    throw new Error("Failed to update patient");
  }
  return response.json();
}

async function deletePatient(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete patient");
  }
  return true;
}

async function deleteHL7Patient(id) {
  const response = await fetch(`${HL7_API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete HL7 patient");
  }
  return true;
}

async function deleteFHIRPatient(id) {
  const response = await fetch(`${FHIR_API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete FHIR patient");
  }
  return true;
}

const patientService = {
  getPatients,
  getHL7Patients,
  getFHIRPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  deleteHL7Patient,
  deleteFHIRPatient,
};

export default patientService;
