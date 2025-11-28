// src/models/Project.js
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    description: { type: String },
    status: {
      type: String,
      enum: ["planning", "active", "on-hold", "completed", "cancelled"],
      default: "planning",
    },
    startDate: { type: Date },
    endDate: { type: Date },
    freelancers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Freelancer" }],
    budget: { type: Number },
    currency: { type: String, default: "INR" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
