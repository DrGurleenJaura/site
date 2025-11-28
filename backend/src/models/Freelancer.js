// src/models/Freelancer.js
const mongoose = require("mongoose");

const freelancerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    skills: [{ type: String }],
    country: { type: String },
    hourlyRate: { type: Number },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Freelancer", freelancerSchema);
