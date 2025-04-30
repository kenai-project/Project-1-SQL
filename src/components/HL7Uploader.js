import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Box, Button, CircularProgress, Typography, Alert, Paper } from '@mui/material';
import { useDropzone } from 'react-dropzone';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const HL7Uploader = () => {
  const [fileContent, setFileContent] = useState('');
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
      const text = reader.result;
      if (!text.trim()) {
        setError('HL7 file is empty.');
        setFileContent('');
        setResult(null);
        return;
      }
      setFileContent(text);
      setError(null);
      setResult({ message: 'Preview of uploaded HL7 message', data: text });
    };
    reader.onerror = () => {
      setError('Failed to read HL7 file');
      setFileContent('');
      setResult(null);
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/plain': ['.hl7', '.txt'] },
    maxFiles: 1,
  });

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
      const response = await axios.post('http://localhost:5000/api/hl7/parse-hl7', {
        hl7Message: fileContent,
      });
      setResult(response.data);
    } catch (err) {
      console.error('HL7 upload error:', err);
      setError(err.response?.data?.error || 'Failed to parse HL7 file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        HL7 Message Upload
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
          <Typography>Drop the HL7 file here...</Typography>
        ) : (
          <Typography>Drag & drop an HL7 file here, or click to select file</Typography>
        )}
      </Box>

      {result && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="info">{result.message}</Alert>
          <Paper variant="outlined" sx={{ p: 2, mt: 1, maxHeight: 200, overflow: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
            {result.parsed_data ? (
              result.parsed_data.map((segment, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Segment: {segment.segment}
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {segment.fields.map((field, i) => (
                      <li key={i}>{field}</li>
                    ))}
                  </ul>
                </Box>
              ))
            ) : (
              result.message
            )}
          </Paper>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!fileContent || isLoading} fullWidth>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Upload & Parse'}
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleReset} disabled={isLoading} fullWidth>
          Reset
        </Button>
      </Box>
    </Paper>
  );
};

export default HL7Uploader;
