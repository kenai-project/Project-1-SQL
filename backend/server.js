require("dotenv").config(); // Load environment variables
console.log("🔐 OpenRouter Key Loaded:", process.env.OPENROUTER_API_KEY ? "✅ Yes" : "❌ No");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const hl7 = require("simple-hl7");
const { Pool } = require("pg");

const authRoutes = require("./routes/auth.routes");
const aiRoutes = require("./routes/ai.routes");
const hl7Routes = require("./routes/hl7.routes");
const fhirRoutes = require("./routes/fhir.routes");
const patientRoutes = require("./routes/patient.routes");

// Optional: HL7 message logging model (create models/HL7Log.js)
const HL7Log = require("./models/HL7Log");

const app = express();
app.use(bodyParser.json());

// ✅ CORS Configuration
const corsOptions = {
  origin: "http://localhost:3000", // React frontend origin
  credentials: true, // Allow cookies/auth headers
};
app.use(cors(corsOptions));

// ✅ Middleware
app.use(express.json());

// ✅ MongoDB Connection
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in environment variables.");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ✅ PostgreSQL Connection
if (!process.env.PG_CONNECTION_STRING) {
  console.error("❌ PG_CONNECTION_STRING is not defined in environment variables.");
  process.exit(1);
}

const pgPool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
});

pgPool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});

// Make pgPool accessible in req for controllers
app.use((req, res, next) => {
  req.pgPool = pgPool;
  next();
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/hl7", hl7Routes);
app.use("/api/fhir", fhirRoutes);
app.use("/api/patients", patientRoutes);

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ✅ HL7 Sending Endpoint
app.post("/api/send-hl7", async (req, res) => {
  const hl7Message = req.body.message;

  if (!hl7Message || hl7Message.length === 0) {
    return res.status(400).json({ message: "HL7 message is required." });
  }

  console.log("📩 Received HL7 Message:", hl7Message);

  // Setup HL7 TCP client configuration
  const hl7Host = process.env.HL7_SERVER_HOST || "localhost";
  const hl7Port = process.env.HL7_SERVER_PORT || 7777;

  const client = hl7.Server.createTcpClient({
    host: hl7Host,
    port: hl7Port,
    framing: hl7.TcpClient.MLLP, // Default framing, explicitly set
  });

  // Send HL7 message
  client.send(hl7Message, async (err, ack) => {
    if (err) {
      console.error("❌ HL7 send error:", err.message);
      return res.status(500).json({ acknowledgment: "Error sending HL7 message: " + err.message });
    }

    console.log("✅ Received ACK:", ack.log());

    // Optional: Store message and ACK in MongoDB for logging/auditing
    try {
      await HL7Log.create({ message: hl7Message, ack: ack.log() });
    } catch (logErr) {
      console.error("⚠️ Failed to save HL7 log:", logErr.message);
    }

    res.status(200).json({ acknowledgment: ack.log() });
  });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Internal Error:", err.message);
  res.status(500).send({ message: "Something went wrong!" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// ✅ Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Gracefully shutting down...");
  await mongoose.disconnect();
  await pgPool.end();
  server.close(() => {
    console.log("👋 Server closed.");
    process.exit(0);
  });
});
