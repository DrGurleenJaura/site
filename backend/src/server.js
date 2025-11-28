// src/server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

// Init DB once at startup
initDb();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
const freelancerRoutes = require('./routes/freelancers');
app.use('/api/freelancers', freelancerRoutes);

// Health check (optional)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DGx Freelance backend running' });
});

// Global error handler (last)
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 DGx Freelance backend running on http://localhost:${PORT}`);
});
