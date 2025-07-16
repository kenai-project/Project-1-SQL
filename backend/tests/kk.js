const kafkaService = require('../services/kafka.service');

const TEST_TOPIC = 'hl7_records-update';
const TEST_MESSAGE = { type: 'test', payload: 'Hello Kafka!' };

(async () => {
  try {
    console.log('⏳ Starting Kafka connection test...');

    // Connect to Kafka
    await kafkaService.connect();
    console.log('✅ Connected to Kafka');

    // Create topic if it doesn’t exist
    await kafkaService.createTopics([TEST_TOPIC]);
    console.log(`✅ Topic "${TEST_TOPIC}" created or already exists`);

    // Send test message after delay (should be built-in)
    await kafkaService.sendMessage(TEST_TOPIC, TEST_MESSAGE);
    console.log('✅ Message sent to topic');

    process.exit(0);
  } catch (error) {
    console.error('❌ Kafka test failed:', error);
    process.exit(1);
  }
})();
