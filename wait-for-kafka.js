const net = require('net');

const host = 'localhost';
const port = 29092;
const timeout = 1000;

function waitForKafka(attempt = 0) {
  const client = new net.Socket();
  client
    .connect(port, host, () => {
      console.log(`✅ Kafka is ready on ${host}:${port}`);
      client.destroy();
      process.exit(0);
    })
    .on('error', () => {
      if (attempt >= 30) {
        console.error("❌ Kafka didn't start in time. Exiting.");
        process.exit(1);
      }
      console.log(`⌛ Waiting for Kafka to be ready... (${attempt + 1})`);
      setTimeout(() => waitForKafka(attempt + 1), timeout);
    });
}

waitForKafka();
