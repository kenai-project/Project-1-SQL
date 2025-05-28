const { exec } = require('child_process');
const axios = require('axios');

class MonitoringService {
  constructor() {
    this.kafkaBroker = 'localhost:9092';
    this.sparkRestApi = process.env.SPARK_REST_API_URL || 'http://localhost:8998';
  }

  async getKafkaLag(topic, groupId) {
    // Placeholder: Implement Kafka consumer lag check using kafka-consumer-groups.sh or Kafka Admin API
    // For example, run kafka-consumer-groups.sh command and parse output
    return new Promise((resolve, reject) => {
      exec(`kafka-consumer-groups.sh --bootstrap-server ${this.kafkaBroker} --describe --group ${groupId}`, (error, stdout, stderr) => {
        if (error) {
          return reject(error);
        }
        // Parse stdout to extract lag info
        resolve(stdout);
      });
    });
  }

  async getSparkJobStatus(appId) {
    try {
      const response = await axios.get(`${this.sparkRestApi}/applications/${appId}/jobs`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get Spark job status: ${error.message}`);
    }
  }

  async checkSparkJobFailures(appId) {
    const jobs = await this.getSparkJobStatus(appId);
    return jobs.some(job => job.status === 'FAILED');
  }
}

module.exports = new MonitoringService();
