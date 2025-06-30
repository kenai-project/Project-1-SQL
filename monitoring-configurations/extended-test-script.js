// Extended test script for full validation of monitoring system

const axios = require('axios');

async function testPrometheusMetrics() {
  try {
    const res = await axios.get('http://localhost:5000/metrics');
    console.log('Prometheus metrics endpoint response status:', res.status);
    if (res.status === 200) {
      console.log('Metrics snippet:', res.data.substring(0, 500));
    }
  } catch (error) {
    console.error('Error fetching Prometheus metrics:', error.message);
  }
}

async function simulateKafkaLag() {
  // You can use the existing simulate-kafka-lag.js script for this
  console.log('Please run simulate-kafka-lag.js separately to simulate Kafka lag.');
}

async function testDebeziumMetrics() {
  try {
    // Replace with actual Debezium metrics endpoint if available
    const res = await axios.get('http://localhost:5000/monitoring/debezium-metrics');
    console.log('Debezium metrics response status:', res.status);
    if (res.status === 200) {
      console.log('Debezium metrics snippet:', res.data.substring(0, 500));
    }
  } catch (error) {
    console.error('Error fetching Debezium metrics:', error.message);
  }
}

async function testPostgresMetrics() {
  try {
    // Replace with actual PostgreSQL metrics endpoint if available
    const res = await axios.get('http://localhost:5000/monitoring/postgres-metrics');
    console.log('PostgreSQL metrics response status:', res.status);
    if (res.status === 200) {
      console.log('PostgreSQL metrics snippet:', res.data.substring(0, 500));
    }
  } catch (error) {
    console.error('Error fetching PostgreSQL metrics:', error.message);
  }
}

async function testMongoMetrics() {
  try {
    // Replace with actual MongoDB metrics endpoint if available
    const res = await axios.get('http://localhost:5000/monitoring/mongo-metrics');
    console.log('MongoDB metrics response status:', res.status);
    if (res.status === 200) {
      console.log('MongoDB metrics snippet:', res.data.substring(0, 500));
    }
  } catch (error) {
    console.error('Error fetching MongoDB metrics:', error.message);
  }
}

async function runAllTests() {
  console.log('Starting extended monitoring tests...');
  await testPrometheusMetrics();
  await simulateKafkaLag();
  await testDebeziumMetrics();
  await testPostgresMetrics();
  await testMongoMetrics();
  console.log('Extended monitoring tests completed.');
}

runAllTests();
