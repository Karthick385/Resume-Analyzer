const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use(
  "/api/auth",
  require("./Routes/authRoutes")
);

app.use(
  "/api/resume",
  require("./Routes/resumeRoutes")
);

app.use(
  "/api/jobs",
  require("./Routes/JobRoutes")
);

app.use(
  "/api/match",
  require("./Routes/MatchRoutes")
);

// Test Route
app.get("/", (req, res) => {
  res.send("Resume Analyzer API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});