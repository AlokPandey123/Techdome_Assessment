const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const loanRoutes = require('./routes/loanRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const app = express();
const PORT = 3000;

const db = require('./config/db');

app.use(cors());

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/loans', loanRoutes);

app.use('/api/auth', authRoutes);

// Database connection
db.connect();

// Server start
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
