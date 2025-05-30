const { Kafka } = require('kafkajs');
const pgPool = require('../db'); // Import pgPool from db.js

const isRender = process.env.RENDER === 'true';

class KafkaService {
  constructor() {
    if (!isRender) {
      this.kafka = new Kafka({
        clientId: 'my-app',
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      });
      this.producer = this.kafka.producer();
      this.connected = false;
    }
  }

  async connect() {
    if (!isRender && !this.connected) {
      await this.producer.connect();
      this.connected = true;
    }
  }

  async sendMessage(topic, message) {
    await this.connect();
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  async produceIncrementalData(tableName, incrementalColumn, lastValue) {
    const validTables = {
      hl7_records: ['created_at'],
      fhir_records: ['updated_at'],
    };

    if (!validTables[tableName] || !validTables[tableName].includes(incrementalColumn)) {
      console.error(`Invalid tableName or incrementalColumn: ${tableName}, ${incrementalColumn}`);
      return 0;
    }

    await this.connect();
    const client = await pgPool.connect();
    try {
      const query = 'SELECT * FROM ' + tableName + ' WHERE ' + incrementalColumn + ' > $1 ORDER BY ' + incrementalColumn + ' ASC';
      const res = await client.query(query, [lastValue]);
      for (const row of res.rows) {
        const topic = tableName + '-update';
        try {
          await this.sendMessage(topic, row);
        } catch (sendError) {
          console.error(`Error sending message to topic ${topic}:`, sendError.stack || sendError);
        }
      }
      return res.rows.length;
    } catch (error) {
      console.error(`Error in produceIncrementalData for table ${tableName}:`, error.stack || error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new KafkaService();
