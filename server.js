const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const User = require('./models/User');
const Appointment = require('./models/Appointment');
const { protect, protectDoctor } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client/dist')));

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// --- AUTH API Endpoints ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const user = await User.create({ name, email, password, phone, role: role || 'patient' });
    if (user) {
      res.status(201).json({
        _id: user._id, name: user.name, email: user.email, role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id, name: user.name, email: user.email, role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', protect, async (req, res) => {
  res.json(req.user);
});

// --- APPOINTMENTS API Endpoints ---
// 1. Create appointment (Patient only)
app.post('/api/appointments', protect, async (req, res) => {
  try {
    const { date, time, symptoms } = req.body;
    
    if (!date || !time) {
      return res.status(400).json({ error: "Please provide date and time." });
    }

    const appointment = await Appointment.create({
      patientId: req.user._id,
      patientName: req.user.name,
      patientPhone: req.user.phone,
      date, time, symptoms
    });

    res.status(201).json({ message: "Appointment booked successfully!", appointment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// 2. Get all appointments (Doctor only)
app.get('/api/appointments', protect, protectDoctor, async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1, time: 1 });
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve appointments' });
  }
});

// 3. Get my appointments (Patient)
app.get('/api/appointments/me', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id }).sort({ date: -1 });
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve appointments' });
  }
});

// 4. Update appointment status (Doctor only)
app.patch('/api/appointments/:id/status', protect, protectDoctor, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    appointment.status = status;
    await appointment.save();
    
    res.json({ message: "Status updated successfully.", appointment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Catch-all for React SPA routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
