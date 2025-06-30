const { Kafka } = require('kafkajs');
const axios = require('axios');

const kafka = new Kafka({
  clientId: 'test-client',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

async function produceMessage() {
  await producer.connect();
  const message = { test: 'Kafka message test' };
  await producer.send({
    topic: 'hl7_records-update',
    messages: [{ value: JSON.stringify(message) }],
  });
  console.log('Message produced:', message);
  await producer.disconnect();
}

async function scrapeMetrics(retries = 5, delay = 5000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get('http://localhost:8083/metrics');
      console.log('Debezium metrics scraped successfully:');
      console.log(response.data);
      return;
    } catch (error) {
      console.error(`Attempt ${attempt} failed to scrape metrics:`, error.message);
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('Max retries reached for metrics scraping.');
      }
    }
  }
}

async function runTest() {
  try {
    await produceMessage();
    await scrapeMetrics();
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTest();
