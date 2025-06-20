const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Assuming server.js exports the Express app
const HL7MongoRecord = require('../models/hl7Mongo.model');
const pgPool = require('../db');

describe('HL7 MongoDB Integration Tests', () => {
  beforeAll(async () => {
    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  afterAll(async () => {
    // Clean up test data
    await HL7MongoRecord.deleteMany({});
    await mongoose.connection.close();
    await pgPool.end();
  });

  test('POST /api/send-hl7 should save HL7 data to both PostgreSQL and MongoDB', async () => {
    const hl7Message = "MSH|^~\\&|SendingApp|SendingFac|ReceivingApp|ReceivingFac|202304271200||ADT^A01|123456|P|2.3\rPID|1||12345^^^Hospital^MR||Doe^John||19800101|M|||123 Main St^^Metropolis^NY^12345||(555)555-5555|||M||123456789|987-65-4321\r";

    const response = await request(app)
      .post('/api/send-hl7')
      .send({ hl7Message })
      .expect(200);

    expect(response.body).toHaveProperty('acknowledgment');

    // Check MongoDB for saved record
    const mongoRecord = await HL7MongoRecord.findOne({ message: hl7Message });
    expect(mongoRecord).not.toBeNull();
    expect(mongoRecord.parsed_data).toBeDefined();
    expect(Array.isArray(mongoRecord.parsed_data)).toBe(true);

    // Check PostgreSQL for saved record
    const pgResult = await pgPool.query('SELECT * FROM hl7_records WHERE message = $1', [hl7Message]);
    expect(pgResult.rows.length).toBeGreaterThan(0);
  });

  test('POST /api/send-hl7 with missing message should return 400', async () => {
    const response = await request(app)
      .post('/api/send-hl7')
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('message', 'HL7 message is required.');
  });
});
