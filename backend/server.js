const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

const PORT = process.env.PORT || 3000;

// Accettiamo sia "localhost" che "127.0.0.1" per evitare falsi blocchi CORS,
// dato che alcuni tool (es. live-server) possono usare l'uno o l'altro.
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://127.0.0.1:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    // "origin" è undefined per richieste senza origine (es. Postman, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Non consentito da CORS"));
    }
  }
}));

app.use(express.json({ limit: "100kb" }));

function parseId(rawId) {
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// SALUTO
app.get("/", (req, res) => {
  console.log("GET request received on /");
  res.send("Ciao");
});

// LEGGI LISTE (GET)
app.get("/lists", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM lists");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore durante il recupero delle liste" });
  }
});

// CREA LISTA (POST)
app.post("/lists", async (req, res) => {
  const { name, description } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Il campo 'name' è obbligatorio" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO lists (name, description) VALUES (?, ?)",
      [name.trim(), description ?? null]
    );

    res.status(201).json({
      id: result.insertId,
      name: name.trim(),
      description: description ?? null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore durante la creazione della lista" });
  }
});

// ELIMINA LISTA (DELETE)
app.delete("/lists/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "ID non valido" });
  }

  try {
    const [result] = await db.query("DELETE FROM lists WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Lista non trovata" });
    }
    res.json({ deleted: result.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore durante l'eliminazione della lista" });
  }
});

// AGGIORNA LISTA (PUT)
app.put("/lists/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "ID non valido" });
  }

  const { name, description } = req.body;
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Il campo 'name' è obbligatorio" });
  }

  try {
    const [result] = await db.query(
      "UPDATE lists SET name = ?, description = ? WHERE id = ?",
      [name.trim(), description ?? null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Lista non trovata" });
    }
    res.json({ updated: result.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore durante l'aggiornamento della lista" });
  }
});

// LEGGI TASKS DI UNA LISTA
app.get("/lists/:id/items", async (req, res) => {
  const listId = parseId(req.params.id);
  if (!listId) {
    return res.status(400).json({ error: "ID lista non valido" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM items WHERE id_list = ?", [listId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore durante il recupero dei task" });
  }
});

// CREA TASK
app.post("/items", async (req, res) => {
  const { name, id_list, stato } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Il campo 'name' è obbligatorio" });
  }
  const listId = parseId(id_list);
  if (!listId) {
    return res.status(400).json({ error: "Il campo 'id_list' è obbligatorio e deve essere un ID valido" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO items (name, id_list, stato) VALUES (?, ?, ?)",
      [name.trim(), listId, stato || "Todo"]
    );

    res.status(201).json({
      id: result.insertId,
      name: name.trim(),
      id_list: listId,
      stato: stato || "Todo"
    });
  } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ error: "La lista indicata in 'id_list' non esiste" });
    }
    console.error(err);
    res.status(500).json({ error: "Errore durante la creazione del task" });
  }
});

// ELIMINA TASK
app.delete("/items/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "ID non valido" });
  }

  try {
    const [result] = await db.query("DELETE FROM items WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task non trovato" });
    }
    res.json({ deleted: result.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore durante l'eliminazione del task" });
  }
});

// MODIFICA TASK
app.put("/items/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "ID non valido" });
  }

  const { name, stato } = req.body;
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Il campo 'name' è obbligatorio" });
  }

  try {
    const [result] = await db.query(
      "UPDATE items SET name = ?, stato = ? WHERE id = ?",
      [name.trim(), stato || "Todo", id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task non trovato" });
    }
    res.json({ updated: result.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore durante la modifica del task" });
  }
});

// AVVIO SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});