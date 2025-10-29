// importar paquetes de npm
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const morgan = require('morgan');

// config vars
const PORT = process.env.PORT || 3000;

// crear el objeto app
const app = express();

// middlewares globales
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

// Conexión a la base de datos (misma BD que ya usás)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // agregá si tu BD lo requiere
  database: 'school'
});

connection.connect(err => {
  if (err) {
    console.error('Error al conectar con MySQL:', err.message);
    return;
  }
  console.log('✅ Base de datos conectada');
});


// ======================================================
// ================   RUTAS PRINCIPALES   ===============
// ======================================================

// Obtener todos los cursos
app.get('/api/cursos', (req, res) => {
  const query = 'SELECT id, anio, division, especialidad FROM Cursos';
  connection.query(query, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener cursos', detalle: err.message });
    res.status(200).json(rows);
  });
});

// Obtener materias por curso
app.get('/api/materias/:cursoId', (req, res) => {
  const cursoId = req.params.cursoId;
  const query = 'SELECT id, nombre FROM Materias WHERE curso = ?';
  connection.query(query, [cursoId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener materias', detalle: err.message });
    res.status(200).json(rows);
  });
});

// Obtener alumnos por curso
app.get('/api/alumnos/:cursoId', (req, res) => {
  const cursoId = req.params.cursoId;
  const query = 'SELECT id, nombre, apellido FROM Alumnos WHERE curso = ?';
  connection.query(query, [cursoId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener alumnos', detalle: err.message });
    res.status(200).json(rows);
  });
});


// ======================================================
// ==============   INSERTAR NUEVO ALUMNO   =============
// ======================================================
app.post('/api/alumnos', (req, res) => {
  const { nombre, apellido, curso } = req.body;

  if (!nombre || !apellido || !curso) {
    return res.status(400).json({ error: 'Faltan datos requeridos (nombre, apellido, curso)' });
  }

  const data = [null, nombre, apellido, curso];
  const query = 'INSERT INTO Alumnos VALUES (?, ?, ?, ?)';

  connection.query(query, data, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al agregar alumno', detalle: err.message });

    const nuevoAlumno = {
      id: result.insertId,
      nombre,
      apellido,
      curso
    };
    res.status(201).json({ mensaje: 'Alumno agregado con éxito', alumno: nuevoAlumno });
  });
});


// ======================================================
// ===============   REGISTRAR ASISTENCIA   =============
// ======================================================
app.post('/api/asistencias', (req, res) => {
  const { tipo, alumno, materia } = req.body;

  if (!tipo || !alumno || !materia) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const tipoAbreviado = abreviarTipo(tipo);

  // Verificar si ya existe una asistencia hoy
  const verificar = `
    SELECT id FROM Asistencias
    WHERE alumno = ? AND materia = ? AND DATE(creado) = CURDATE()
  `;

  connection.query(verificar, [alumno, materia], (err, existentes) => {
    if (err) return res.status(500).json({ error: 'Error al verificar asistencia', detalle: err.message });

    if (existentes.length > 0) {
      return res.status(409).json({ error: 'Ya se registró asistencia para este alumno y materia hoy.' });
    }

    const insertar = 'INSERT INTO Asistencias (tipo, alumno, materia) VALUES (?, ?, ?)';
    connection.query(insertar, [tipoAbreviado, alumno, materia], (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al guardar asistencia', detalle: err.message });

      res.status(201).json({
        mensaje: 'Asistencia registrada con éxito',
        asistencia: {
          id: result.insertId,
          tipo: tipoAbreviado,
          alumno,
          materia
        }
      });
    });
  });
});


// ======================================================
// =============   FUNCIÓN DE ABREVIACIÓN   =============
// ======================================================
function abreviarTipo(texto) {
  const mapa = {
    'Presente': 'P',
    'Ausente': 'A',
    'Tarde': 'T',
    'Retiro Anticipado': 'RA',
    'Presente con Atraso': 'PA'
  };
  return mapa[texto] || texto;
}


// ======================================================
// ==================   INICIAR SERVIDOR   ===============
// ======================================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});