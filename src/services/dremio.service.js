import axios from 'axios';

const API_URL = '/api/dremio';

const runQuery = async (sql) => {
  const response = await axios.post(`${API_URL}/query`, { sql });
  return response.data;
};

export default {
  runQuery,
};
