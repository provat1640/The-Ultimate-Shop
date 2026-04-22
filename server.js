const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = 3000;

const db = new sqlite3.Database('./project.db');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.use(session({
    secret: 'super_secret_faculty_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// user registration
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Missing fields" });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    db.run("INSERT INTO users (username, password, role) VALUES (?, ?, 'user')", [username, hash], function (err) {
        if (err) return res.status(500).json({ error: "Username already exists or database error" });
        res.status(201).json({ message: "Registration successful!" });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err || !user) return res.status(401).json({ error: "Invalid credentials" });
        const validPass = bcrypt.compareSync(password, user.password);
        if (!validPass) return res.status(401).json({ error: "Invalid credentials" });

        req.session.userId = user.id;
        req.session.role = user.role;
        req.session.username = user.username;
        res.json({ message: "Login successful", role: user.role });
    });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out" });
});

app.get('/api/me', (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: "Not logged in" });
    res.json({ id: req.session.userId, username: req.session.username, role: req.session.role });
});

const requireAdmin = (req, res, next) => {
    if (!req.session.userId || req.session.role !== 'admin') return res.status(403).json({ error: "Admin required" });
    next();
};

// get all products
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => res.json(rows || []));
});

app.get('/api/products/new-arrivals', (req, res) => {
    db.all('SELECT * FROM products WHERE is_new_arrival = 1', [], (err, rows) => res.json(rows || []));
});

// Admin product endpoints
app.post('/api/products', requireAdmin, (req, res) => {
    const { name, price, image, is_new_arrival } = req.body;
    db.run(`INSERT INTO products (name, price, image, is_new_arrival) VALUES (?, ?, ?, ?)`, 
        [name, price, image, is_new_arrival ? 1 : 0], function(err) {
        if (err) return res.status(500).json({ error: "Failed to create product" });
        res.status(201).json({ id: this.lastID });
    });
});
app.put('/api/products/:id', requireAdmin, (req, res) => {
    const { name, price, image, is_new_arrival } = req.body;
    db.run(`UPDATE products SET name = ?, price = ?, image = ?, is_new_arrival = ? WHERE id = ?`, 
        [name, price, image, is_new_arrival ? 1 : 0, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: "Failed to update product" });
        res.json({ message: "Updated" });
    });
});
app.delete('/api/products/:id', requireAdmin, (req, res) => {
    db.run(`DELETE FROM products WHERE id = ?`, [req.params.id], function(err) {
        res.json({ message: "Deleted" });
    });
});

// checkout logic
app.post('/api/checkout', (req, res) => {
    // Allows guest or logged in user
    const userId = req.session.userId || null;
    const { items, paymentMethod, total } = req.body;
    
    // items should be parsed JSON, paymentMethod is 'credit_card' or 'cod'
    db.run(`INSERT INTO orders (user_id, items_json, total_amount, payment_method) VALUES (?, ?, ?, ?)`, 
        [userId, JSON.stringify(items), total, paymentMethod], function(err) {
            if (err) return res.status(500).json({ error: "Checkout failed internally" });
            res.json({ message: "Order placed successfully!", orderId: this.lastID });
    });
});

app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
});
