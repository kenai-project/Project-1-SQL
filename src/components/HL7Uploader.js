import React, { useState } from 'react';
import axios from 'axios';
import './HL7Uploader.css';

const HL7Uploader = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
    setResult(null);

    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError('File size exceeds the 5MB limit.');
        return;
      }

      try {
        const fileText = await selectedFile.text();
        if (!fileText.trim()) {
          setError('HL7 file is empty.');
          return;
        }

        setResult({ message: 'Preview of uploaded HL7 message', data: fileText });
      } catch (err) {
        setError('Failed to read HL7 file');
      }
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const fileContent = await file.text();
      const response = await axios.post('http://localhost:5000/api/hl7/parse-hl7', {
        message: fileContent,
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
    <div className="hl7-uploader">
      <h2>HL7 Message Upload</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".hl7,.txt" 
        />
        <small>Accepted formats: .hl7, .txt (max 5MB)</small>

        <div className="button-group">
          <button type="submit" disabled={!file || isLoading}>
            {isLoading ? 'Processing...' : 'Upload & Parse'}
          </button>
          <button 
            type="button" 
            onClick={handleReset}
            className="reset-button"
          >
            Reset
          </button>
        </div>
      </form>

      {isLoading && <div className="loader">Parsing HL7 message...</div>}
      {error && <div className="error">{error}</div>}
      {result && (
        <div className="result">
          <h3>{result.message || 'Parsed Result'}:</h3>
          <pre>{typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default HL7Uploader;
