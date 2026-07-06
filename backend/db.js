const mysql = require("mysql2");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });


const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_NAME"];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(
    `Errore: variabili d'ambiente mancanti: ${missingEnvVars.join(", ")}`
  );
  console.error("Verifica il file .env (puoi usare .env.example come riferimento).");
  process.exit(1);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const db = pool.promise();

async function initDB() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS lists (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description VARCHAR(255)
      ) ENGINE=InnoDB;
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        stato VARCHAR(50) DEFAULT 'Todo',
        id_list INT,
        FOREIGN KEY (id_list) REFERENCES lists(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    console.log("Database MySQL inizializzato con successo!");
  } catch (error) {
    console.error("Errore durante l'inizializzazione del database:", error);
    process.exit(1); 
  }
}

initDB();

async function closePool() {
  try {
    await db.end();
    console.log("Pool di connessioni MySQL chiuso correttamente.");
  } catch (err) {
    console.error("Errore durante la chiusura del pool:", err);
  } finally {
    process.exit(0);
  }
}

process.on("SIGINT", closePool);
process.on("SIGTERM", closePool);

module.exports = db;