// app.js
const express = require('express');
const path    = require('path');
const session = require('express-session');

// Pārliecinās, ka DB tabulas tiek inicializētas primāri
require('./db');

const auth_routes  = require('./routes/auth');
const task_routes  = require('./routes/tasks');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'replace_with_a_strong_secret',
  resave: false,
  save_uninitialized: false,
}));

// Vienkārša autentifikācijas pārbaude
function is_authenticated(req, res, next) {
  if (req.session.user_id) return next();
  res.status(401).json({ message: 'Unauthorized' });
}

// Apkalpo statiskos failus; ar index.html mapē /public
app.use(express.static(path.join(__dirname, 'public')));

// API maršruti
app.use('/api/auth', auth_routes);
app.use('/api/tasks', is_authenticated, task_routes);

// Noklusējums: pāradresēt jebkuru nezināmu maršrutu uz `/`
app.get('*', (req, res) => {
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});