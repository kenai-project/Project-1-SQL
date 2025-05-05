const axios = require('axios');

class DremioService {
  constructor() {
    this.baseUrl = process.env.DREMIO_API_URL || 'http://localhost:9047/api/v3';
    this.token = null;
  }

  async authenticate() {
    if (this.token) {
      return this.token;
    }
    const username = process.env.DREMIO_USERNAME || 'admin';
    const password = process.env.DREMIO_PASSWORD || 'password';

    try {
      const response = await axios.post(`${this.baseUrl}/login`, {
        userName: username,
        password: password,
      });
      this.token = response.data.token;
      return this.token;
    } catch (error) {
      console.error('Dremio authentication failed:', error.message);
      throw error;
    }
  }

  async query(sql) {
    await this.authenticate();

    try {
      const response = await axios.post(
        `${this.baseUrl}/sql`,
        { sql },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Dremio query failed:', error.message);
      throw error;
    }
  }
}

module.exports = new DremioService();
