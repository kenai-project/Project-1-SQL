import React, { useEffect, useState } from "react";
import patientService from "../services/patient.service";

const emptyPatient = {
  first_name: "",
  last_name: "",
  date_of_birth: "",
  gender: "",
  address: "",
  phone: "",
  email: "",
};

function PatientManager() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState(emptyPatient);

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    setLoading(true);
    setError(null);
    try {
      const data = await patientService.getPatients();
      setPatients(data);
    } catch (err) {
      setError(err.message || "Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function startEdit(patient) {
    setEditingPatient(patient.id);
    setFormData(patient);
  }

  function cancelEdit() {
    setEditingPatient(null);
    setFormData(emptyPatient);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      if (editingPatient) {
        await patientService.updatePatient(editingPatient, formData);
      } else {
        await patientService.createPatient(formData);
      }
      cancelEdit();
      fetchPatients();
    } catch (err) {
      setError(err.message || "Failed to save patient");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    setError(null);
    try {
      await patientService.deletePatient(id);
      fetchPatients();
    } catch (err) {
      setError(err.message || "Failed to delete patient");
    }
  }

  return (
    <div>
      <h2>Patient Manager</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading patients...</p>
      ) : (
        <>
          <table border="1" cellPadding="5" cellSpacing="0">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.first_name}</td>
                  <td>{patient.last_name}</td>
                  <td>{patient.date_of_birth}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.address}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.email}</td>
                  <td>
                    <button onClick={() => startEdit(patient)}>Edit</button>{" "}
                    <button onClick={() => handleDelete(patient.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>{editingPatient ? "Edit Patient" : "Add New Patient"}</h3>
          <form onSubmit={handleSubmit}>
            <label>
              First Name:
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
              />
            </label>
            <br />
            <label>
              Last Name:
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
              />
            </label>
            <br />
            <label>
              Date of Birth:
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                required
              />
            </label>
            <br />
            <label>
              Gender:
              <select name="gender" value={formData.gender} onChange={handleInputChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <br />
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Phone:
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <button type="submit">{editingPatient ? "Update" : "Add"}</button>
            {editingPatient && <button type="button" onClick={cancelEdit}>Cancel</button>}
          </form>
        </>
      )}
    </div>
  );
}

export default PatientManager;
