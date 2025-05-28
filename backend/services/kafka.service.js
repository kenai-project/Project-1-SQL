const { Kafka } = require('kafkajs');
const pgPool = require('../server').pgPool; // Import pgPool from server.js or pass it as param

class KafkaService {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'my-app',
      brokers: ['localhost:9092'],
    });
    this.producer = this.kafka.producer();
    this.connected = false;
  }

  async connect() {
    if (!this.connected) {
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
    await this.connect();
    const client = await pgPool.connect();
    try {
      const query = 'SELECT * FROM ' + tableName + ' WHERE ' + incrementalColumn + ' > $1 ORDER BY ' + incrementalColumn + ' ASC';
      const res = await client.query(query, [lastValue]);
      for (const row of res.rows) {
        const topic = tableName + '-update';
        await this.sendMessage(topic, row);
      }
      return res.rows.length;
    } finally {
      client.release();
    }
  }
}

module.exports = new KafkaService();
