// maršruti/tasks.js
const express = require('express');
const db      = require('../db');

const router = express.Router();

// GET /api/tasks?category=ID&completed=true
router.get('/', (req, res) => {
  // Iegūst lietotāja ID no sesijas
  const user_id = req.session.user_id;
  const { category, completed } = req.query;

  let sql = `
    SELECT tasks.*, categories.name AS category_name
      FROM tasks
 LEFT JOIN categories ON tasks.category_id = categories.id
     WHERE tasks.user_id = ?`;
  const params = [user_id];

  if (category) {
    sql += ' AND category_id = ?';
    params.push(category);
  }
  if (completed !== undefined) {
    sql += ' AND completed = ?';
    params.push(completed === 'true' ? 1 : 0);
  }

  // Iegūst uzdevumus no DB
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows);
  });
});

// POST /api/tasks
router.post('/', (req, res) => {
  const user_id = req.session.user_id;
  const { title, description, category_id } = req.body;

  const stmt = `
    INSERT INTO tasks (user_id, title, description, category_id)
    VALUES (?, ?, ?, ?)`;
  // Pievieno jaunu uzdevumu
  db.run(stmt, [user_id, title, description, category_id || null], function(err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ id: this.lastID });
  });
});

// PUT /api/tasks/:id
router.put('/:id', (req, res) => {
  const user_id  = req.session.user_id;
  const task_id  = req.params.id;
  const { title, description, category_id, completed } = req.body;

  const stmt = `
    UPDATE tasks
       SET title = ?, description = ?, category_id = ?, completed = ?,
           updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND user_id = ?`;
  // Atjauno uzdevumu
  db.run(stmt,
    [title, description, category_id || null, completed ? 1 : 0, task_id, user_id],
    function(err) {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json({ changes: this.changes });
    }
  );
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  const user_id = req.session.user_id;
  const task_id = req.params.id;

  // Dzēš uzdevumu
  db.run(
    `DELETE FROM tasks WHERE id = ? AND user_id = ?`,
    [task_id, user_id],
    function(err) {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json({ changes: this.changes });
    }
  );
});

// GET /api/tasks/categories
router.get('/categories', (req, res) => {
  // Iegūst kategoriju sarakstu
  db.all(`SELECT * FROM categories`, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows);
  });
});

module.exports = router;