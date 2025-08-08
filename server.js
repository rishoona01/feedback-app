const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // For JSON payloads (e.g., fetch)
app.use(bodyParser.urlencoded({ extended: true })); // For form submissions
app.use(express.static("public")); // Serves static files from /public

// PostgreSQL pool connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Optional: Simple homepage check
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Route: POST /submit
app.post("/submit", async (req, res) => {
  const { name, feedback } = req.body;

  // Basic validation
  if (!name || !feedback) {
    return res.status(400).send("Name and feedback are required.");
  }

  try {
    await pool.query(
      "INSERT INTO feedback (name, feedback) VALUES ($1, $2)",
      [name, feedback]
    );
    res.send("Feedback received!");
  } catch (error) {
    console.error("❌ Database error:", error);
    res.status(500).send("Something went wrong on the server.");
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

