// maršruti/auth.js
const express = require('express');
const bcrypt  = require('bcrypt');
const db      = require('../db');

const router = express.Router();
const SALT_ROUNDS = 10;

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  // Hash paroli un saglabā
  bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
    if (err) return res.status(500).json({ message: 'Hashing error' });

    const stmt = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(stmt, [username, hash], function(err) {
      if (err) {
        return res.status(500).json({ message: 'User already exists or DB error' });
      }
      // Saglabā sesijas lietotāja ID
      req.session.user_id = this.lastID;
      res.json({ message: 'Registration successful' });
    });
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const stmt = `SELECT * FROM users WHERE username = ?`;
  // Meklē lietotāju DB
  db.get(stmt, [username], (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Salīdzina paroles ar hash
    bcrypt.compare(password, user.password, (err, same) => {
      if (same) {
        req.session.user_id = user.id;
        res.json({ message: 'Login successful' });
      } else {
        res.status(400).json({ message: 'Invalid credentials' });
      }
    });
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  // Iziet no sesijas
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

module.exports = router;