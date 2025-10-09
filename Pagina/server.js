const express = require('express');
const mariadb = require('mariadb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a MariaDB
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'tu_usuario', // ⚠️ CAMBIAR
  password: 'tu_contraseña', // ⚠️ CAMBIAR
  database: 'colegio'
});

// Endpoints
app.get('/cursos', async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT * FROM cursos");
  conn.end();
  res.json(rows);
});

app.get('/materias', async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT * FROM materias");
  conn.end();
  res.json(rows);
});

app.get('/alumnos', async (req, res) => {
  const { curso_id, materia_id } = req.query;
  const conn = await pool.getConnection();
  const rows = await conn.query(`
    SELECT a.id, a.nombre
    FROM alumnos a
    JOIN alumnos_materias am ON a.id = am.alumno_id
    WHERE a.curso_id = ? AND am.materia_id = ?
  `, [curso_id, materia_id]);
  conn.end();
  res.json(rows);
});

app.post('/asistencia', async (req, res) => {
  const { alumno_id, curso_id, materia_id, estado, hora } = req.body;
  const conn = await pool.getConnection();
  await conn.query(`
    INSERT INTO asistencias (alumno_id, curso_id, materia_id, estado, hora)
    VALUES (?, ?, ?, ?, ?)
  `, [alumno_id, curso_id, materia_id, estado, hora]);
  conn.end();
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
