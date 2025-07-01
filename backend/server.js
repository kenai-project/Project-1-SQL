require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const hl7 = require("simple-hl7");
const pgPool = require('./db');
const connectMongoDB = require('./mongodb');
const { exec } = require('child_process');

const authRoutes = require("./routes/auth.routes");
const aiRoutes = require("./routes/ai.routes");
const hl7Routes = require("./routes/hl7.routes");
const fhirRoutes = require("./routes/fhir.routes");
const patientRoutes = require("./routes/patient.routes");
const uploadRoutes = require("./routes/upload.routes");
const dremioRoutes = require("./routes/dremio.routes");
const sparkRoutes = require("./routes/spark.routes");
const monitoringRoutes = require("./routes/monitoring.routes");
const healthcheckRoutes = require("./routes/healthcheck.routes");
const testHL7Routes = require("./routes/testHL7.routes");

const HL7Log = require("./models/HL7Log");

const kafkaService = require("./services/kafka.service");
require("./scheduler/incrementalSyncScheduler");

const app = express();
app.use(bodyParser.json());

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

app.use((req, res, next) => {
  req.pgPool = pgPool;
  next();
});

// Initialize MongoDB connection
connectMongoDB().catch(error => {
  console.error('❌ MongoDB connection failed:', error);
  process.exit(1);
});

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/hl7", hl7Routes);
app.use("/api/fhir", fhirRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/dremio", dremioRoutes);
app.use("/api/spark", sparkRoutes);
app.use("/api/monitoring", monitoringRoutes);
app.use("/api", healthcheckRoutes);
app.use("/api", testHL7Routes);

app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

/**
 * 🔁 On-demand route to run kafka-consumer-groups.sh safely
 * URL: http://localhost:5000/kafka/describe-group
 */
app.get('/kafka/describe-group', (req, res) => {
  const kafkaCmd = `bash -i C:\\kafka\\bin\\kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group group2`;

  exec(kafkaCmd, (error, stdout, stderr) => {
    if (error) {
      console.error('Error running Kafka command:', stderr);
      return res.status(500).send(stderr);
    }
    res.send(stdout);
  });
});

app.post("/api/send-hl7", async (req, res) => {
  const hl7Message = req.body.hl7Message;

  if (!hl7Message || hl7Message.length === 0) {
    return res.status(400).json({ message: "HL7 message is required." });
  }

  console.log("📩 Received HL7 Message:", hl7Message);

  const hl7Host = process.env.HL7_SERVER_HOST || "localhost";
  const hl7Port = process.env.HL7_SERVER_PORT || 7777;

  const client = hl7.Server.createTcpClient({
    host: hl7Host,
    port: hl7Port,
    framing: "MLLP",
  });

  client.send(hl7Message, async (err, ack) => {
    if (err) {
      console.error("❌ HL7 send error:", err.message);
      return res.status(500).json({ acknowledgment: "Error sending HL7 message: " + err.message });
    }

    console.log("✅ Received ACK:", ack.log());

    try {
      const hl7Log = new HL7Log({
        message: hl7Message,
        ack: ack.log(),
      });
      await hl7Log.save();
    } catch (logErr) {
      console.error("⚠️ Failed to save HL7 log:", logErr.message);
    }

    res.status(200).json({ acknowledgment: ack.log() });
  });
});

app.use((err, req, res, next) => {
  console.error("🔥 Internal Error:", err.message);
  res.status(500).send({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
let server;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

// Start Kafka service connection with retry logic
const waitForKafka = async () => {
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      await kafkaService.connect();
      console.log("✅ Kafka service connected");
      break;
    } catch (error) {
      console.warn(`⏳ Kafka connection attempt ${attempt} failed: ${error.message}`);
      await new Promise(res => setTimeout(res, 3000));
    }
  }
};

(async () => {
  await waitForKafka();
})();

process.on("SIGINT", async () => {
  console.log("🛑 Gracefully shutting down...");
  await pgPool.end();
  if (server) {
    server.close(() => {
      console.log("👋 Server closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

module.exports = app;
