const axios = require('axios');
const client = require('prom-client');
const { Pool } = require('pg');

class MonitoringService {
  constructor() {
    this.kafkaBroker = 'localhost:9092';
    this.sparkRestApi = process.env.SPARK_REST_API_URL || 'http://localhost:8998';

    this.kafkaConnectRestApi = process.env.KAFKA_CONNECT_REST_API || 'http://localhost:8083';
    this.pgPool = new Pool({
      connectionString: process.env.PG_CONNECTION_STRING,
    });

    // Prometheus metrics
    this.register = new client.Registry();

    // Kafka metrics
    this.kafkaIngestionLagGauge = new client.Gauge({
      name: 'kafka_ingestion_lag',
      help: 'Kafka ingestion lag per topic and consumer group',
      labelNames: ['topic', 'groupId'],
    });

    this.kafkaMessageThroughputCounter = new client.Counter({
      name: 'kafka_message_throughput_total',
      help: 'Total number of messages processed by Kafka topic',
      labelNames: ['topic'],
    });

    // Kafka Connect (Debezium) metrics
    this.kafkaConnectConnectorHealthGauge = new client.Gauge({
      name: 'kafka_connect_connector_health',
      help: 'Health status of Kafka Connect connectors (1=healthy, 0=unhealthy)',
      labelNames: ['connector'],
    });

    this.kafkaConnectErrorRateGauge = new client.Gauge({
      name: 'kafka_connect_error_rate',
      help: 'Error rate of Kafka Connect connectors',
      labelNames: ['connector'],
    });

    // PostgreSQL metrics
    this.postgresQueryDurationHistogram = new client.Histogram({
      name: 'postgres_query_duration_seconds',
      help: 'Histogram of PostgreSQL query durations',
      labelNames: ['query'],
      buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 5],
    });

    this.postgresErrorRateCounter = new client.Counter({
      name: 'postgres_error_rate_total',
      help: 'Total number of PostgreSQL errors',
      labelNames: ['error_type'],
    });

    this.register.registerMetric(this.kafkaIngestionLagGauge);
    this.register.registerMetric(this.kafkaMessageThroughputCounter);
    this.register.registerMetric(this.kafkaConnectConnectorHealthGauge);
    this.register.registerMetric(this.kafkaConnectErrorRateGauge);
    this.register.registerMetric(this.postgresQueryDurationHistogram);
    this.register.registerMetric(this.postgresErrorRateCounter);

    // Set default labels
    this.register.setDefaultLabels({
      app: 'my_app',
    });

    // Collect default metrics (CPU, memory, etc.)
    client.collectDefaultMetrics({ register: this.register });

    // Schedule periodic metric collection
    this.collectMetricsInterval = setInterval(() => {
      this.collectKafkaMetrics();
      this.collectDebeziumMetrics();
      this.collectPostgresMetrics();
    }, 15000); // every 15 seconds
  }

  async getKafkaLag(topic, groupId) {
    // Run kafka-consumer-groups.sh command without spawning new terminal window
    // Use spawn with stdio pipes to avoid opening new terminal windows on Windows
    const { spawn } = require('child_process');
    return new Promise((resolve, reject) => {
      const cmd = spawn('kafka-consumer-groups.sh', ['--bootstrap-server', this.kafkaBroker, '--describe', '--group', groupId], { shell: true });

      let output = '';
      let errorOutput = '';

      cmd.stdout.on('data', (data) => {
        output += data.toString();
      });

      cmd.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      cmd.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`kafka-consumer-groups.sh exited with code ${code}: ${errorOutput}`));
        }
        resolve(output);
      });

      cmd.on('error', (err) => {
        reject(err);
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

  async collectKafkaMetrics() {
    try {
      // Example: collect lag for a list of topics and groups
      const topics = ['topic1', 'topic2']; // TODO: replace with actual topics
      const groups = ['group1', 'group2']; // TODO: replace with actual consumer groups

      for (const topic of topics) {
        for (const groupId of groups) {
          const lagOutput = await this.getKafkaLag(topic, groupId);
          // Parse lagOutput to extract lag value (example parsing)
          const lagMatch = lagOutput.match(/lag\s+(\d+)/i);
          const lag = lagMatch ? parseInt(lagMatch[1], 10) : 0;
          this.kafkaIngestionLagGauge.set({ topic, groupId }, lag);
        }
        // Simulate message throughput increment (replace with real data)
        this.kafkaMessageThroughputCounter.inc({ topic }, Math.floor(Math.random() * 100));
      }
    } catch (error) {
      console.error('Error collecting Kafka metrics:', error.message);
    }
  }

  async collectDebeziumMetrics() {
    // Disabled Debezium metrics scraping as per user request to use Datadog instead
    console.log('Debezium metrics scraping disabled. Using Datadog for monitoring.');
  }

  async collectPostgresMetrics() {
    try {
      const client = await this.pgPool.connect();
      try {
        // Example query duration measurement
        const query = 'SELECT pg_sleep(0.01)'; // Dummy query for example
        const start = Date.now();
        await client.query(query);
        const duration = (Date.now() - start) / 1000;
        this.postgresQueryDurationHistogram.observe({ query }, duration);

        // Example error rate increment (replace with real error detection)
        // For demo, increment error rate randomly
        if (Math.random() < 0.1) {
          this.postgresErrorRateCounter.inc({ error_type: 'random_error' });
        }
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error collecting PostgreSQL metrics:', error.message);
    }
  }

  async getMetrics() {
    return await this.register.metrics();
  }
}

module.exports = new MonitoringService();
