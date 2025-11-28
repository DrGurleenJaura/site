// src/routes/freelancers.js
const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

// GET /api/freelancers  → list all freelancers
router.get('/', (req, res) => {
  const db = getDb();

  db.all(
    `SELECT 
       id,
       name,
       email,
       skills,
       status,
       hourly_rate,
       location,
       created_at
     FROM freelancers
     ORDER BY created_at DESC`,
    [],
    (err, rows) => {
      if (err) {
        console.error('❌ Error querying freelancers:', err.message);
        return res.status(500).json({ error: 'Failed to fetch freelancers' });
      }
      res.json(rows);
    }
  );
});

// POST /api/freelancers  → add a freelancer
router.post('/', (req, res) => {
  const db = getDb();
  const { name, email, skills, status, hourly_rate, location, notes } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const sql = `
    INSERT INTO freelancers (name, email, skills, status, hourly_rate, location, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [name, email, skills || '', status || 'active', hourly_rate || null, location || '', notes || ''],
    function (err) {
      if (err) {
        console.error('❌ Error inserting freelancer:', err.message);
        return res.status(500).json({ error: 'Failed to create freelancer' });
      }

      res.status(201).json({
        id: this.lastID,
        name,
        email,
        skills,
        status: status || 'active',
        hourly_rate,
        location,
        notes,
      });
    }
  );
});

// PUT /api/freelancers/:id  → update a freelancer
router.put('/:id', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { name, email, skills, status, hourly_rate, location, notes } = req.body;

  const sql = `
    UPDATE freelancers
    SET
      name = COALESCE(?, name),
      email = COALESCE(?, email),
      skills = COALESCE(?, skills),
      status = COALESCE(?, status),
      hourly_rate = COALESCE(?, hourly_rate),
      location = COALESCE(?, location),
      notes = COALESCE(?, notes)
    WHERE id = ?
  `;

  db.run(
    sql,
    [name, email, skills, status, hourly_rate, location, notes, id],
    function (err) {
      if (err) {
        console.error('❌ Error updating freelancer:', err.message);
        return res.status(500).json({ error: 'Failed to update freelancer' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Freelancer not found' });
      }

      res.json({ success: true });
    }
  );
});

// DELETE /api/freelancers/:id
router.delete('/:id', (req, res) => {
  const db = getDb();
  const { id } = req.params;

  db.run('DELETE FROM freelancers WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('❌ Error deleting freelancer:', err.message);
      return res.status(500).json({ error: 'Failed to delete freelancer' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Freelancer not found' });
    }

    res.json({ success: true });
  });
});

module.exports = router;
