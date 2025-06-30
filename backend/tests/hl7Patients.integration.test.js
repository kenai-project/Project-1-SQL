const request = require('supertest');
const app = require('../server');

describe('HL7 API Endpoints', () => {
  afterAll(async () => {
    // Add cleanup logic to stop cron jobs and close connections
    const { stopCron } = require('../scheduler/incrementalSyncScheduler');
    stopCron();
  });

  test('should insert a sample HL7 message via test endpoint', async () => {
    const hl7Message = "MSH|^~\\&|SendingApp|SendingFac|ReceivingApp|ReceivingFac|202304271200||ADT^A01|123456|P|2.3\rPID|1||12345^^^Hospital^MR||Doe^John||19800101|M|||123 Main St^^Metropolis^NY^12345||(555)555-5555|||M||123456789|987-65-4321\r";
    const response = await request(app)
      .post('/api/test-hl7')
      .send({ hl7Message })
      .expect(200);
    expect(response.body).toHaveProperty('acknowledgment');
  });

  test('should return 404 for unknown route', async () => {
    const response = await request(app).get('/api/unknown-route');
    expect(response.status).toBe(404);
  });
});
