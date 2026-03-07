const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client/dist')));

// --- API Endpoints ---

// 1. Create a new appointment
app.post('/api/appointments', (req, res) => {
    const { patientName, patientPhone, date, time, symptoms } = req.body;
    
    if (!patientName || !patientPhone || !date || !time) {
        return res.status(400).json({ error: "Please provide all required fields." });
    }

    const sql = `INSERT INTO appointments (patientName, patientPhone, date, time, symptoms) 
                 VALUES (?, ?, ?, ?, ?)`;
    const params = [patientName, patientPhone, date, time, symptoms || ''];

    db.run(sql, params, function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: "Failed to book appointment." });
        }
        res.status(201).json({ 
            message: "Appointment booked successfully!", 
            appointmentId: this.lastID 
        });
    });
});

// 2. Get all appointments (for Doctor Dashboard)
app.get('/api/appointments', (req, res) => {
    const sql = `SELECT * FROM appointments ORDER BY date ASC, time ASC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: "Failed to retrieve appointments." });
        }
        res.json({ appointments: rows });
    });
});

// 3. Get appointments by patient phone (for User checking status)
app.get('/api/appointments/:phone', (req, res) => {
    const phone = req.params.phone;
    const sql = `SELECT * FROM appointments WHERE patientPhone = ? ORDER BY date DESC`;
    db.all(sql, [phone], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: "Failed to retrieve appointments." });
        }
        res.json({ appointments: rows });
    });
});

// 4. Update appointment status (Confirm/Cancel - for Doctor Dashboard)
app.patch('/api/appointments/:id/status', (req, res) => {
    const id = req.params.id;
    const { status } = req.body;

    if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
        return res.status(400).json({ error: "Invalid status value." });
    }

    const sql = `UPDATE appointments SET status = ? WHERE id = ?`;
    db.run(sql, [status, id], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: "Failed to update status." });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Appointment not found." });
        }
        res.json({ message: "Status updated successfully.", status });
    });
});

// 5. Catch-all for React SPA routing
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
