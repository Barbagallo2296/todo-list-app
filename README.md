# 📝 TODO List App

## Descrizione
Applicazione web per gestire più liste di cose da fare (ToDo List).
Il sistema permette di creare, visualizzare, modificare ed eliminare liste e i relativi elementi (tasks).
Ogni lista può contenere più tasks, e ogni task ha uno stato:
* Todo
* Done

## Tecnologie utilizzate
* Node.js
* Express
* MySQL
* HTML
* CSS
* JavaScript

## Funzionalità

### Gestione liste
* Creare una nuova lista
* Visualizzare tutte le liste
* Modificare una lista
* Eliminare una lista

### Gestione tasks
* Aggiungere un task ad una lista
* Visualizzare i task di una lista
* Modificare un task
* Eliminare un task
* Cambiare lo stato tra `Todo` e `Done`

## Setup del progetto

### Prerequisiti
* [Node.js](https://nodejs.org/) (v18 o superiore consigliata)
* [XAMPP](https://www.apachefriends.org/) (o un'altra installazione MySQL locale)

### 1. Clonare il repository
```bash
git clone https://github.com/Barbagallo2296/todo-list-app.git
cd todo-list-app
```

### 2. Avviare MySQL
Avvia XAMPP e assicurati che il servizio **MySQL** sia attivo.

Il database e le tabelle vengono creati automaticamente all'avvio del server (non serve eseguire manualmente nessuno script). In alternativa, per riferimento, la struttura del database è disponibile in `database/schema.sql`.

### 3. Configurare le variabili d'ambiente
Copia il file di esempio e personalizzalo se necessario:
```bash
cp .env.example .env
```
Il file `.env.example` contiene:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=todolist_db
PORT=3000
FRONTEND_URL=http://localhost:5173
Con XAMPP i valori di default vanno bene così come sono.

### 4. Installare le dipendenze
```bash
npm install
```

### 5. Avviare il progetto
```bash
npm run dev
```
Questo comando avvia contemporaneamente backend e frontend:
* Backend: `http://localhost:3000`
* Frontend: `http://localhost:5173`

## Autore
Manuel Barbagallo
Progetto realizzato per il corso di Full Stack Developer ITS Prodigi