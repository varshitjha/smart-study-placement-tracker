// server.js
// This is the MAIN entry point of the backend.
// It sets up Express, connects to MongoDB, registers all routes, and starts the server.

// Load environment variables from .env file FIRST (before anything else)
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import route files
const authRoutes = require("./routes/authRoutes");
const studyRoutes = require("./routes/studyRoutes");
const placementRoutes = require("./routes/placementRoutes");

// ---- Connect to MongoDB ----
connectDB();

// ---- Create Express App ----
const app = express();

// ---- Middleware ----
// express.json() allows our server to read JSON data sent in request bodies
app.use(express.json());

// cors() allows your frontend (running on a different port) to talk to this backend
// Without this, the browser would block frontend API calls
app.use(cors());

// ---- Routes ----
// All auth routes will be prefixed with /api/auth
// Example: POST /api/auth/register, POST /api/auth/login
app.use("/api/auth", authRoutes);

// All study routes will be prefixed with /api/study
// Example: POST /api/study, GET /api/study
app.use("/api/study", studyRoutes);

// All placement routes will be prefixed with /api/placement
// Example: POST /api/placement, GET /api/placement
app.use("/api/placement", placementRoutes);

// ---- Health Check Route ----
// A simple route to verify the server is running
// Visit http://localhost:8000/ in the browser to check
app.get("/", (req, res) => {
  res.json({ message: "Smart Study + Placement Tracker API is running!" });
});

// ---- 404 Handler ----
// If no route matches, send a 404 error
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ---- Start Server ----
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
