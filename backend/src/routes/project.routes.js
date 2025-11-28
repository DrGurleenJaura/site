// src/routes/project.routes.js
const express = require("express");
const Project = require("../models/Project");
const router = express.Router();

// CREATE project
router.post("/", async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: "Error creating project", error: error.message });
  }
});

// GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("client")
      .populate("freelancers")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
});

// GET one project
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("client")
      .populate("freelancers");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error fetching project", error: error.message });
  }
});

// UPDATE project
router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("client")
      .populate("freelancers");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: "Error updating project", error: error.message });
  }
});

// DELETE project
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error: error.message });
  }
});

module.exports = router;
