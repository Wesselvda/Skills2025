const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const he = require('he');
const fs = require('fs');

const app = express();
const db = new sqlite3.Database('./db.sqlite');

app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-very-secret',
  resave: false,
  saveUninitialized: true
}));

function logEvent(message) {
  fs.appendFile('security.log', `[${new Date().toISOString()}] ${message}\n`, () => {});
}

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, role TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, description TEXT)");

  db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
    if (row.count === 0) {
      const adminPass = bcrypt.hashSync('admin123', 10);
      const userPass = bcrypt.hashSync('user123', 10);
      db.run("INSERT INTO users (username, password, role) VALUES ('admin', ?, 'admin')", [adminPass]);
      db.run("INSERT INTO users (username, password, role) VALUES ('user', ?, 'user')", [userPass]);
      console.log('Default users created, remember to change in production');
    }
  });
});

function isAdmin(req, res, next) {
  if (req.session.user?.role === 'admin') return next();
  res.status(403).send('Access denied');
}

app.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  db.all("SELECT * FROM tasks WHERE user_id = ?", [req.session.user.id], (err, rows) => {
    res.send(`
      <h1>Welcome ${he.encode(req.session.user.username)}</h1>
      <form method="POST" action="/task">
        <input name="description" placeholder="Task"><button>Add</button>
      </form>
      ${rows.map(t => `<p>${he.encode(t.description)}</p>`).join('')}
      <a href="/logout">Logout</a>
      <br><a href="/admin">Admin panel</a>
    `);
  });
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.post('/login',
  rateLimit({ windowMs: 60 * 1000, max: 5 }),
  (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        logEvent(`Successful login: ${username}`);
        res.redirect('/');
      } else {
        logEvent(`Failed login: ${username}`);
        res.send('Login failed');
      }
    });
  });

app.post('/task',
  body('description').trim().isLength({ min: 1, max: 255 }).escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send('Invalid task input');
    const { description } = req.body;
    db.run("INSERT INTO tasks (user_id, description) VALUES (?, ?)", [req.session.user.id, description]);
    res.redirect('/');
  });

app.get('/admin', isAdmin, (req, res) => {
  db.all("SELECT * FROM tasks", (err, rows) => {
    res.send(`<h1>Admin Panel</h1>${rows.map(t => `<p>${he.encode(t.description)}</p>`).join('')}<br><a href="/">Home</a>`);
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

app.use((err, req, res, next) => {
  res.status(500).send('Server error');
});

app.listen(3000, () => console.log('Secure app running on http://localhost:3000'));