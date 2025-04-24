// src/components/SymptomAI.js
import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Paper, Button } from '@mui/material';


function SymptomAI() {
  const [symptoms, setSymptoms] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem("aiHistory");
    return stored ? JSON.parse(stored) : [];
  });

  const handleAIAnalyze = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/ai/symptoms", { symptoms });
      const newEntry = { symptoms, reply: res.data.reply, timestamp: new Date().toISOString() };

      const updatedHistory = [newEntry, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("aiHistory", JSON.stringify(updatedHistory));

      setAiResponse(res.data.reply);
    } catch (error) {
      setAiResponse("Something went wrong. Try again later.");
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem("aiHistory");
    setHistory([]);
  };

  return (
    <div className="p-4 rounded shadow-md bg-white max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-2">🩺 Symptom Checker</h2>
      <textarea
        className="w-full border p-2 rounded"
        rows={4}
        placeholder="Enter symptoms (e.g., chest pain, headache)..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />
      <button
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleAIAnalyze}
      >
        Analyze
      </button>

      {aiResponse && (
        <Box mt={2}>
          <Typography variant="subtitle1">AI Response:</Typography>
          <Typography variant="body1">{aiResponse}</Typography>
        </Box>
      )}

      {history.length > 0 && (
        <Box mt={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" gutterBottom>Previous Analyses</Typography>
            <Button size="small" color="error" onClick={handleClearHistory}>
              Clear History
            </Button>
        </Box>
          {history.map((entry, index) => (
            <Paper key={index} sx={{ p: 2, my: 1 }}>
              <Typography variant="body2" color="text.secondary">{entry.timestamp}</Typography>
              <Typography><strong>Symptoms:</strong> {entry.symptoms}</Typography>
              <Typography><strong>AI Reply:</strong> {entry.reply}</Typography>
            </Paper>
          ))}
        </Box>
      )}



      {/* {history.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Query History</h3>
            <button
              className="text-sm text-red-500"
              onClick={handleClearHistory}
            >
              Clear History
            </button>
          </div>
          {history.map((entry, index) => (
            <div
              key={index}
              className="mb-3 p-2 border border-gray-300 rounded bg-gray-50"
            >
              <p className="text-sm text-gray-600">{new Date(entry.timestamp).toLocaleString()}</p>
              <p><strong>Symptoms:</strong> {entry.symptoms}</p>
              <p><strong>Response:</strong> {entry.reply}</p>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
}

export default SymptomAI;
