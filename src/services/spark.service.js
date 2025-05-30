import axios from 'axios';

const API_URL = '/api/spark';

const runQuery = async (sql) => {
  const response = await axios.post(`${API_URL}/query`, { sql });
  return response.data;
};

const sparkService = {
  runQuery,
};

export default sparkService;
