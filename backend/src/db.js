// src/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

let db;

/**
 * Add missing columns to freelancers table if needed
 */
function migrateFreelancersTable() {
  db.all('PRAGMA table_info(freelancers)', (err, rows) => {
    if (err) {
      console.error('❌ Error reading freelancers schema:', err.message);
      return;
    }

    const existingCols = new Set(rows.map((r) => r.name));

    const migrations = [
      {
        name: 'status',
        sql: "ALTER TABLE freelancers ADD COLUMN status TEXT DEFAULT 'active'",
      },
      {
        name: 'hourly_rate',
        sql: 'ALTER TABLE freelancers ADD COLUMN hourly_rate REAL',
      },
      {
        name: 'location',
        sql: 'ALTER TABLE freelancers ADD COLUMN location TEXT',
      },
      {
        name: 'notes',
        sql: 'ALTER TABLE freelancers ADD COLUMN notes TEXT',
      },
    ];

    migrations.forEach((col) => {
      if (!existingCols.has(col.name)) {
        db.run(col.sql, (err2) => {
          if (err2) {
            console.error(
              `❌ Error adding column ${col.name} to freelancers:`,
              err2.message
            );
          } else {
            console.log(`✅ Column '${col.name}' added to freelancers table`);
          }
        });
      }
    });
  });
}

/**
 * Initialize SQLite DB, create tables and some sample data
 */
function initDb() {
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'dgx-freelance.db');

  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('❌ Error opening database:', err.message);
      return;
    }
    console.log('✅ SQLite DB opened at', dbPath);
  });

  db.serialize(() => {
    // Freelancers table
    db.run(
      `CREATE TABLE IF NOT EXISTS freelancers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        skills TEXT,
        status TEXT DEFAULT 'active',
        hourly_rate REAL,
        location TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      (err) => {
        if (err) {
          console.error('❌ Error creating freelancers table:', err.message);
        } else {
          // Ensure all expected columns exist (for older DBs)
          migrateFreelancersTable();
        }
      }
    );

    // Projects table
    db.run(
      `CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        client_name TEXT,
        status TEXT DEFAULT 'open',
        budget REAL,
        start_date TEXT,
        end_date TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      (err) => {
        if (err) console.error('❌ Error creating projects table:', err.message);
      }
    );

    // Assignments table
    db.run(
      `CREATE TABLE IF NOT EXISTS assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        freelancer_id INTEGER NOT NULL,
        project_id INTEGER NOT NULL,
        role TEXT,
        start_date TEXT,
        end_date TEXT,
        status TEXT DEFAULT 'ongoing',
        FOREIGN KEY (freelancer_id) REFERENCES freelancers(id),
        FOREIGN KEY (project_id) REFERENCES projects(id)
      )`,
      (err) => {
        if (err) console.error('❌ Error creating assignments table:', err.message);
      }
    );

    // Optional: Seed a couple of freelancers if table is empty
    db.get('SELECT COUNT(*) AS count FROM freelancers', (err, row) => {
      if (err) {
        console.error('❌ Error counting freelancers:', err.message);
        return;
      }

      if (row.count === 0) {
        console.log('ℹ️ Seeding initial freelancers...');
        const stmt = db.prepare(
          `INSERT INTO freelancers (name, email, skills, status, hourly_rate, location, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        );

        stmt.run(
          'Aman Sharma',
          'aman@example.com',
          'Video Annotation, Image Annotation, QA',
          'active',
          8.5,
          'Chandigarh',
          'Senior annotator with 3+ years experience'
        );
        stmt.run(
          'Simran Kaur',
          'simran@example.com',
          'Content Writing, Localization, Transcription',
          'active',
          7.0,
          'Mohali',
          'Strong in edtech + language projects'
        );
        stmt.finalize();
      }
    });
  });
}

/**
 * Get db instance after initDb has been called
 */
function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
}

module.exports = {
  initDb,
  getDb,
};
