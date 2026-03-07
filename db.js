const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'hospital.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        console.log("Connected to the SQLite database.");
        db.run(`CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patientName TEXT NOT NULL,
            patientPhone TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            symptoms TEXT,
            status TEXT DEFAULT 'Pending'
        )`, (err) => {
            if (err) {
                console.error("Error creating table " + err.message);
                return;
            }
            console.log("Appointments table ready.");
        });
    }
});

module.exports = db;
