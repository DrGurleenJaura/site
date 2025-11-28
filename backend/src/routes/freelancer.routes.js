// src/routes/freelancer.routes.js
const express = require("express");
const Freelancer = require("../models/Freelancer");
const router = express.Router();

// CREATE freelancer
router.post("/", async (req, res) => {
  try {
    const freelancer = await Freelancer.create(req.body);
    res.status(201).json(freelancer);
  } catch (error) {
    res.status(400).json({ message: "Error creating freelancer", error: error.message });
  }
});

// GET all freelancers
router.get("/", async (req, res) => {
  try {
    const freelancers = await Freelancer.find().sort({ createdAt: -1 });
    res.json(freelancers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching freelancers", error: error.message });
  }
});

// GET one freelancer
router.get("/:id", async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id);
    if (!freelancer) return res.status(404).json({ message: "Freelancer not found" });
    res.json(freelancer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching freelancer", error: error.message });
  }
});

// UPDATE freelancer
router.put("/:id", async (req, res) => {
  try {
    const freelancer = await Freelancer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!freelancer) return res.status(404).json({ message: "Freelancer not found" });
    res.json(freelancer);
  } catch (error) {
    res.status(400).json({ message: "Error updating freelancer", error: error.message });
  }
});

// DELETE freelancer
router.delete("/:id", async (req, res) => {
  try {
    const freelancer = await Freelancer.findByIdAndDelete(req.params.id);
    if (!freelancer) return res.status(404).json({ message: "Freelancer not found" });
    res.json({ message: "Freelancer removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting freelancer", error: error.message });
  }
});

module.exports = router;
