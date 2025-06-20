const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const HL7MongoRecord = require('../models/hl7Mongo.model');

describe('HL7 Patients API Integration Tests', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  afterAll(async () => {
    await HL7MongoRecord.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear collection before each test
    await HL7MongoRecord.deleteMany({});
  });

  test('GET /api/patients should return empty array when no records', async () => {
    const response = await request(app)
      .get('/api/patients')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  test('GET /api/patients should return patients extracted from HL7 records', async () => {
    const hl7Message = "MSH|^~\\&|SendingApp|SendingFac|ReceivingApp|ReceivingFac|202304271200||ADT^A01|123456|P|2.3\rPID|1||12345^^^Hospital^MR||Doe^John||19800101|M|||123 Main St^^Metropolis^NY^12345||(555)555-5555|||M||123456789|987-65-4321\r";
    const parsedData = [
      { segment: "MSH", fields: ["^~\\&","SendingApp","SendingFac","ReceivingApp","ReceivingFac","202304271200","","ADT^A01","123456","P","2.3"] },
      { segment: "PID", fields: ["1","","12345^^^Hospital^MR","","Doe^John","","19800101","M","","","123 Main St^^Metropolis^NY^12345","","(555)555-5555","","M","","123456789","987-65-4321"] }
    ];

    await HL7MongoRecord.create({ message: hl7Message, parsed_data: parsedData });

    const response = await request(app)
      .get('/api/patients')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    const patient = response.body[0];
    expect(patient.first_name).toBe("John");
    expect(patient.last_name).toBe("Doe");
    expect(patient.date_of_birth).toBe("19800101");
    expect(patient.gender).toBe("M");
    expect(patient.address).toBe("123 Main St^^Metropolis^NY^12345");
    expect(patient.phone).toBe("(555)555-5555");
  });

  test('DELETE /api/patients/:id should delete HL7 record', async () => {
    const hl7Record = await HL7MongoRecord.create({
      message: "Test message",
      parsed_data: [],
    });

    const response = await request(app)
      .delete(`/api/patients/${hl7Record._id}`)
      .expect(204);

    const deletedRecord = await HL7MongoRecord.findById(hl7Record._id);
    expect(deletedRecord).toBeNull();
  });

  test('DELETE /api/patients/:id with invalid id should return 500', async () => {
    const response = await request(app)
      .delete('/api/patients/invalidid')
      .expect(500);

    expect(response.body).toHaveProperty('message', 'Failed to delete HL7 patient');
  });
});
