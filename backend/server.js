const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
//app.use(express.static("../frontend"));


// SALUTO
app.get("/", (req, res) => {
  console.log("GET request received on /");
  res.send("Ciao");
});

// LEGGI LISTE (GET)
app.get("/lists", (req, res) => {

  db.all("SELECT * FROM lists", (err, rows) => {

    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(rows);

  });

});


// CREA LISTA (POST)
app.post("/lists", (req, res) => {

  const { name, description } = req.body;

  db.run(
    "INSERT INTO lists (name, description) VALUES (?, ?)",
    [name, description],
    function(err){

      if(err){
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({
        id: this.lastID,
        name,
        description
      });

    }

  );

});


// ELIMINA LISTA (DELETE)
app.delete("/lists/:id", (req, res) => {

  const id = req.params.id;

  db.run(
    "DELETE FROM lists WHERE id = ?",
    [id],
    function(err){

      if(err){
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({deleted: this.changes});

    }

  );

});


// AGGIORNA LISTA (PUT)
app.put("/lists/:id", (req, res) => {

  const id = req.params.id;
  const { name, description } = req.body;

  db.run(
    "UPDATE lists SET name = ?, description = ? WHERE id = ?",
    [name, description, id],
    function(err){

      if(err){
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({updated: this.changes});

    }

  );

});


// LEGGI TASKS DI UNA LISTA
app.get("/lists/:id/items", (req, res) => {

  const listId = req.params.id;

  db.all(
    "SELECT * FROM items WHERE id_list = ?",
    [listId],
    (err, rows) => {

      if(err){
        console.log(err);
        return res.status(500).json(err);
      }

      res.json(rows);

    }

  );

});


// CREA TASK
app.post("/items", (req, res) => {

  const { name, id_list, stato } = req.body;

  db.run(
    "INSERT INTO items (name, id_list, stato) VALUES (?, ?, ?)",
    [name, id_list, stato],
    function(err){

      if(err){
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({
        id: this.lastID,
        name,
        id_list,
        stato
      });

    }

  );

});


// ELIMINA TASK
app.delete("/items/:id", (req, res) => {

  const id = req.params.id;

  db.run(
    "DELETE FROM items WHERE id = ?",
    [id],
    function(err){

      if(err){
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({deleted: this.changes});

    }

  );

});


// MODIFICA TASK
app.put("/items/:id", (req, res) => {

  const id = req.params.id;
  const { name, stato } = req.body;

  db.run(
    "UPDATE items SET name = ?, stato = ? WHERE id = ?",
    [name, stato, id],
    function(err){

      if(err){
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({updated: this.changes});

    }

  );

});


// AVVIO SERVER SULLA PORTA 3000
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});