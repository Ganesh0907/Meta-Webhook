// Import Express
const express = require("express");

// Create Express app
const app = express();

// Parse JSON bodies (REQUIRED)
app.use(express.json());

// Read environment variables
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// ==============================
// GET /webhook  → Verification
// ==============================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WEBHOOK VERIFIED");
    return res.status(200).send(challenge);
  }

  console.error("❌ WEBHOOK VERIFICATION FAILED");
  return res.sendStatus(403);
});

// ==============================
// POST /webhook → Events
// ==============================
app.post("/webhook", (req, res) => {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);

  console.log("\n====================================");
  console.log(`📩 WEBHOOK RECEIVED @ ${timestamp}`);
  console.log("====================================");
  console.log(JSON.stringify(req.body, null, 2));

  // Always respond 200 to Meta
  res.sendStatus(200);
});

// ==============================
// Health check (optional)
// ==============================
app.get("/", (req, res) => {
  res.status(200).send("WhatsApp Webhook is running 🚀");
});

// ==============================
// Start server
// ==============================
app.listen(PORT, () => {
  console.log(`\n🚀 Server listening on port ${PORT}\n`);
});
