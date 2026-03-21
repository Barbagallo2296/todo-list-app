const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../database/app.sqlite");

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
 CREATE TABLE IF NOT EXISTS lists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  description TEXT
)
    `);
});

db.run(`
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  stato TEXT DEFAULT 'Todo',
  id_list INTEGER,
  FOREIGN KEY (id_list) REFERENCES lists(id)
)
`);

module.exports = db;
