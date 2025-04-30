import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  Link,
} from '@mui/material';
import axios from 'axios';

const Report = () => {
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const fetchUploadedFiles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/upload');
      setUploadedFiles(res.data);
    } catch (error) {
      console.error('Failed to fetch uploaded files', error);
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFile(null);
      fetchUploadedFiles();
    } catch (error) {
      console.error('File upload failed', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#0d47a1',
          backgroundColor: '#e3f2fd',
          padding: '10px 15px',
          borderRadius: 1,
          userSelect: 'none',
        }}
      >
        Medical Report Analysis
      </Typography>

      {/* File Upload */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          bgcolor: '#1565c0', // light blue
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
          Upload X-ray / Report
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button variant="contained" component="label" color="primary">
            Choose File
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUpload}
            disabled={!file}
            sx={{ minWidth: 100 }}
          >
            Upload
          </Button>
        </Box>
        {file && (
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: '#555' }}>
            Selected: {file.name}
          </Typography>
        )}
      </Paper>

      {/* Uploaded Files List */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: '#1565c0', // same light blue
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
          Uploaded Files
        </Typography>
        {uploadedFiles.length === 0 ? (
          <Typography>No files uploaded yet.</Typography>
        ) : (
          <List>
            {uploadedFiles.map((filename) => (
              <ListItem
                key={filename}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  bgcolor: '#1976d2', // slightly different blue
                  color: '#fff',
                  '&:hover': { bgcolor: '#1e88e5' },
                }}
                secondaryAction={
                  <Link
                    href={`http://localhost:5000/uploads/${filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{ color: '#bbdefb' }}
                  >
                    View
                  </Link>
                }
              >
                <ListItemText primary={filename} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default Report;
