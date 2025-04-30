import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Box, Button, CircularProgress, Typography, Alert, Paper, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useDropzone } from 'react-dropzone';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const sampleFormats = {
  Patient: {
    resourceType: "Patient",
    id: "example",
    name: [{
      given: ["John"],
      family: "Doe"
    }]
  },
  Observation: {
    resourceType: "Observation",
    status: "final",
    code: {
      text: "Blood Pressure"
    }
  },
  Condition: {
    resourceType: "Condition",
    id: "example",
    code: {
      text: "Hypertension"
    }
  }
};

const FHIRUploader = () => {
  const [fileContent, setFileContent] = useState('');
  const [resourceType, setResourceType] = useState('Patient');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds the 5MB limit.');
      setFileContent('');
      setResult(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result;
        const json = JSON.parse(text);
        setFileContent(text);
        setResourceType(json.resourceType || 'Patient');
        setError(null);
        setResult({ message: 'Preview of uploaded FHIR resource', data: json });
      } catch (e) {
        setError('Invalid JSON in file');
        setFileContent('');
        setResult(null);
      }
    };
    reader.onerror = () => {
      setError('Failed to read FHIR file');
      setFileContent('');
      setResult(null);
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    maxFiles: 1,
  });

  const handleResourceTypeChange = (event) => {
    setResourceType(event.target.value);
  };

  const loadSample = () => {
    const sample = sampleFormats[resourceType];
    setResult({ message: 'Loaded sample successfully', data: sample });
    setFileContent(JSON.stringify(sample, null, 2));
  };

  const handleReset = () => {
    setFileContent('');
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileContent) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const jsonData = JSON.parse(fileContent);

      const response = await axios.post('http://localhost:5000/api/fhir/parse-fhir', {
        resourceType,
        data: jsonData
      });

      setResult(response.data);
    } catch (err) {
      console.error("FHIR upload error:", err);
      setError(err.response?.data?.error || 'Failed to process FHIR file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        FHIR Resource Upload
      </Typography>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #1976d2',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          bgcolor: isDragActive ? '#e3f2fd' : 'inherit',
          cursor: 'pointer',
          mb: 2,
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Drop the FHIR JSON file here...</Typography>
        ) : (
          <Typography>Drag & drop a FHIR JSON file here, or click to select file</Typography>
        )}
      </Box>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="resource-type-label">Resource Type</InputLabel>
        <Select
          labelId="resource-type-label"
          value={resourceType}
          label="Resource Type"
          onChange={handleResourceTypeChange}
        >
          <MenuItem value="Patient">Patient</MenuItem>
          <MenuItem value="Observation">Observation</MenuItem>
          <MenuItem value="Condition">Condition</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!fileContent || isLoading} fullWidth>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Upload & Process'}
        </Button>
        <Button variant="outlined" onClick={loadSample} fullWidth>
          Load Sample
        </Button>
        <Button variant="outlined" onClick={handleReset} fullWidth>
          Reset
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Paper variant="outlined" sx={{ p: 2, maxHeight: 300, overflow: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
          <Typography variant="subtitle1" gutterBottom>{result.message || 'Processed Result'}:</Typography>
          <pre>{JSON.stringify(result.data || result, null, 2)}</pre>
        </Paper>
      )}
    </Paper>
  );
};

export default FHIRUploader;
