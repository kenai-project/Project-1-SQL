const { Kafka } = require('kafkajs');
const pgPool = require('../db'); // Import pgPool from db.js

const isRender = process.env.RENDER === 'true';

class KafkaService {
  constructor() {
    console.log("DEBUG: KAFKA_BROKER env var:", process.env.KAFKA_BROKER);
    if (!isRender) {
      this.kafka = new Kafka({
        clientId: 'my-app',
        brokers: [process.env.KAFKA_BROKER || 'localhost:29092'],
      });
      this.producer = this.kafka.producer();
      this.admin = this.kafka.admin();
      this.connected = false;
    }
  }

  async connect() {
    if (!isRender && !this.connected) {
      try {
        await this.producer.connect();
        this.connected = true;
        console.log("✅ Kafka producer connected");
      } catch (error) {
        console.error("❌ Kafka connection failed:", error.message || error);
        throw error;
      }
    }
  }

  async sendMessage(topic, message) {
    await this.connect();
    // Add delay before sending first message to allow Kafka leader election
    if (!this._delayDone) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds delay
      this._delayDone = true;
    }
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
  async createTopics(topics) {
    if (!isRender) {
      try {
        await this.admin.connect();
        const created = await this.admin.createTopics({
          topics: topics.map(topic => ({ topic })),
          waitForLeaders: true,
        });
        console.log(`✅ Kafka topics created or already exist: ${topics.join(', ')}`);
        await this.admin.disconnect();
        return created;
      } catch (error) {
        console.error("❌ Error creating Kafka topics:", error.stack || error);
        throw error;
      }
    }
  }
}

module.exports = new KafkaService();
