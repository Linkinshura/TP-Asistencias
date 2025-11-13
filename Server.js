const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Conexión 
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tp'
});

const path = require('path');

app.use(express.static(path.join(__dirname, 'Cliente')));


app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente ');
});


db.connect(err => {
  if (err) throw err;
  console.log('Conectado a la base de datos');
});

// Cursos
app.get('/cursos', (req, res) => {
  db.query('SELECT * FROM cursos', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Materias por curso
app.get('/materias/:cursoId', (req, res) => {
  const { cursoId } = req.params;
  db.query('SELECT * FROM materias WHERE curso = ?', [cursoId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Alumnos por curso
app.get('/alumnos/:cursoId', (req, res) => {
  const { cursoId } = req.params;
  db.query('SELECT * FROM alumnos WHERE curso = ?', [cursoId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Crear alumnos
app.post('/alumnos', (req, res) => {
  const { nombres, apellidos, curso } = req.body;
  if (!nombres || !apellidos || !curso)
    return res.status(400).json({ message: 'Faltan datos' });

  db.query(
    'INSERT INTO alumnos (nombres, apellidos, curso) VALUES (?, ?, ?)',
    [nombres, apellidos, curso],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ id: result.insertId });
    }
  );
});

// Registrar asistencias
app.post('/asistencias', (req, res) => {
  const { alumno, materia, tipo } = req.body;
  if (!alumno || !materia || !tipo)
    return res.status(400).json({ message: 'Faltan datos' });

  const now = new Date();
  const hora = now.toTimeString().split(' ')[0];

  let hora_ingreso = null;
  let hora_egreso = null;

  if (tipo === 'T' || tipo === 'PA') hora_ingreso = hora;
  if (tipo === 'RA') hora_egreso = hora;

  db.query(
    `INSERT INTO registros (alumno, materia, tipo, hora_ingreso, hora_egreso, creado)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [alumno, materia, tipo, hora_ingreso, hora_egreso],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ id: result.insertId });
    }
  );
});

// Asistencias filtradas
app.get('/asistencias', (req, res) => {
  const { curso, materia, fecha } = req.query;

  if (!curso || !materia || !fecha)
    return res.status(400).json({ message: 'Faltan filtros' });

  db.query(
    `SELECT r.id, a.id AS alumno_id, a.nombres, a.apellidos, r.tipo, 
            r.hora_ingreso, r.hora_egreso, DATE(r.creado) AS fecha
     FROM registros r
     JOIN alumnos a ON r.alumno = a.id
     WHERE a.curso = ? AND r.materia = ? AND DATE(r.creado) = ?`,
    [curso, materia, fecha],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    }
  );
});

// Editar asistencias
app.put('/asistencias/:id', (req, res) => {
  const { id } = req.params;
  const { tipo, hora_ingreso, hora_egreso } = req.body;
  if (!tipo)
    return res.status(400).json({ message: 'Faltan datos para actualizar' });

  db.query(
    `UPDATE registros
     SET tipo = ?, hora_ingreso = ?, hora_egreso = ?
     WHERE id = ?`,
    [tipo, hora_ingreso, hora_egreso, id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Registro actualizado correctamente' });
    }
  );
});

// Eliminar asistencias
app.delete('/asistencias/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM registros WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Registro eliminado correctamente' });
  });
});

// Server
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
