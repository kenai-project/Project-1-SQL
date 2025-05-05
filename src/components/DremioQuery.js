import React, { useState } from 'react';
import dremioService from '../services/dremio.service';

const DremioQuery = () => {
  const [sql, setSql] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRunQuery = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await dremioService.runQuery(sql);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Error running query');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Dremio Query</h2>
      <textarea
        rows="6"
        cols="80"
        value={sql}
        onChange={(e) => setSql(e.target.value)}
        placeholder="Enter SQL query here"
      />
      <br />
      <button onClick={handleRunQuery} disabled={loading || !sql.trim()}>
        {loading ? 'Running...' : 'Run Query'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {result && (
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default DremioQuery;
