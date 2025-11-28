// server.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

dotenv.config();

const app = express();

// --- DB CONNECTION ---
connectDB();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// --- BASIC HEALTH CHECK ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "DGx Freelance Management API running" });
});

// --- ROUTES ---
const freelancerRoutes = require("./src/routes/freelancer.routes");
const clientRoutes = require("./src/routes/client.routes");
const projectRoutes = require("./src/routes/project.routes");

app.use("/api/freelancers", freelancerRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
