require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const hl7 = require("simple-hl7");
const pgPool = require('./db');

const authRoutes = require("./routes/auth.routes");
const aiRoutes = require("./routes/ai.routes");
const hl7Routes = require("./routes/hl7.routes");
const fhirRoutes = require("./routes/fhir.routes");
const patientRoutes = require("./routes/patient.routes");
const uploadRoutes = require("./routes/upload.routes");
const dremioRoutes = require("./routes/dremio.routes");
const sparkRoutes = require("./routes/spark.routes");
const monitoringRoutes = require("./routes/monitoring.routes");

const HL7Log = require("./models/HL7Log");

const kafkaService = require("./services/kafka.service");
require("./scheduler/incrementalSyncScheduler");

const app = express();
app.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

app.use((req, res, next) => {
  req.pgPool = pgPool;
  next();
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

app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

app.post("/api/send-hl7", async (req, res) => {
  const hl7Message = req.body.message;

  if (!hl7Message || hl7Message.length === 0) {
    return res.status(400).json({ message: "HL7 message is required." });
  }

  console.log("📩 Received HL7 Message:", hl7Message);

  const hl7Host = process.env.HL7_SERVER_HOST || "localhost";
  const hl7Port = process.env.HL7_SERVER_PORT || 7777;

  const client = hl7.Server.createTcpClient({
    host: hl7Host,
    port: hl7Port,
    framing: hl7.TcpClient.MLLP,
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
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// Start Kafka service connection
(async () => {
  try {
    await kafkaService.connect();
    console.log("✅ Kafka service connected");
  } catch (error) {
    console.error("❌ Kafka service connection failed:", error);
  }
})();

process.on("SIGINT", async () => {
  console.log("🛑 Gracefully shutting down...");
  await pgPool.end();
  server.close(() => {
    console.log("👋 Server closed.");
    process.exit(0);
  });
});

module.exports.pgPool = pgPool;
