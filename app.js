const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const todoRoutes = require('./routes/tododb');
const authRoutes = require('./routes/authRoutes');
const { isAuthenticated } = require('./middlewares/middleware');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Folder untuk file statis (e.g., logo)
app.use(expressLayouts);

// Konfigurasi session
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
}));

// Set EJS sebagai view engine
app.set('view engine', 'ejs');

// Routes
app.use('/', authRoutes); // Login, Signup, Logout
app.use('/todos', isAuthenticated, todoRoutes); // Todo routes

// Halaman utama
app.get('/', isAuthenticated, (req, res) => {
    res.render('index', { layout: 'layouts/main-layout', user: req.session.user });
});

// Halaman kontak
app.get('/contact', isAuthenticated, (req, res) => {
    res.render('contact', { layout: 'layouts/main-layout', user: req.session.user });
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
