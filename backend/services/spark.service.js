const axios = require('axios');

class SparkService {
  constructor() {
    this.baseUrl = process.env.SPARK_REST_API_URL || 'http://localhost:8998';
  }

  async submitStatement(sql) {
    try {
      const response = await axios.post(`${this.baseUrl}/statements`, {
        code: sql,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to submit statement: ${error.message}`);
    }
  }

  async query(sql) {
    return this.submitStatement(sql);
  }

  async submitStreamingJob(jobConfig) {
    // jobConfig should include Kafka topic, Iceberg table, schema, etc.
    // This is a placeholder example of submitting a Spark Structured Streaming job via REST API
    try {
      const sql = `
        CREATE STREAMING LIVE TABLE ${jobConfig.icebergTable} AS
        SELECT * FROM kafka.${jobConfig.kafkaTopic}
      `;
      const response = await axios.post(`${this.baseUrl}/statements`, {
        code: sql,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to submit streaming job: ${error.message}`);
    }
  }
}

module.exports = new SparkService();
