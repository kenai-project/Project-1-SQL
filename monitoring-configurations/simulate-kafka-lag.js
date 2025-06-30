/**
 * simulate-kafka-lag.js
 * 
 * Script to simulate Kafka consumer lag by pausing consumption for a specified duration.
 * This helps test the kafka_ingestion_lag metric in Prometheus.
 * 
 * Usage:
 *   node simulate-kafka-lag.js --topic your_topic --group your_group --pauseMs 30000
 * 
 * Prerequisites:
 * - Kafka client library installed (npm install kafkajs)
 * - Kafka broker accessible at localhost:9092 or update broker address below
 * 
 * Expected outcome:
 * - Consumer pauses consumption for pauseMs milliseconds
 * - kafka_ingestion_lag metric should increase during this period
 * 
 * Troubleshooting:
 * - Ensure Kafka broker is running and accessible
 * - Adjust topic and group to match your environment
 */

const { Kafka } = require('kafkajs');
const argv = require('minimist')(process.argv.slice(2));

const topic = argv.topic || 'test-topic';
const groupId = argv.group || 'test-group';
const pauseMs = parseInt(argv.pauseMs, 10) || 30000;

const kafka = new Kafka({
  clientId: 'lag-simulator',
  brokers: ['localhost:9092'], // Updated to localhost:9092 based on your Docker setup
});

const consumer = kafka.consumer({ groupId });

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  console.log(`Starting consumer for topic "${topic}" with group "${groupId}"`);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message offset ${message.offset} - pausing for ${pauseMs}ms`);
      await new Promise(resolve => setTimeout(resolve, pauseMs));
      console.log(`Resuming consumption after pause`);
    },
  });
}

run().catch(e => {
  console.error(`[simulate-kafka-lag] Error:`, e);
  process.exit(1);
});
