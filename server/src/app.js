require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Simple route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Role Based Auth Application.' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/test', userRoutes);

// Sync Database and Start Server
// In production, you might not want to sync automatically.
const PORT = process.env.PORT || 3000;

db.syncDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });
});
