const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.post("/submit", async (req, res) => {
  const { name, feedback } = req.body;
  try {
    await pool.query(
      "INSERT INTO feedback (name, feedback) VALUES ($1, $2)",
      [name, feedback]
    );
    res.send("Feedback received!");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Something went wrong.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
