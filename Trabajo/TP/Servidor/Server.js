const express = require('express');
const path = require('path');
const pool = require('./db'); // Archivo de conexión a MySQL
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Obtener cursos
app.get('/api/cursos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, anio, division, especialidad FROM Cursos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener cursos', detalle: err.message });
  }
});

// Obtener materias por curso
app.get('/api/materias/:cursoId', async (req, res) => {
  try {
    const cursoId = req.params.cursoId;
    const [rows] = await pool.query(
      'SELECT id, nombre FROM Materias WHERE curso = ?',
      [cursoId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener materias', detalle: err.message });
  }
});

// Obtener alumnos por curso
app.get('/api/alumnos/:cursoId', async (req, res) => {
  try {
    const cursoId = req.params.cursoId;
    const [rows] = await pool.query(
      'SELECT id, nombre, apellido FROM Alumnos WHERE curso = ?',
      [cursoId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener alumnos', detalle: err.message });
  }
});

// Insertar asistencia
app.post('/api/asistencias', async (req, res) => {
  const { tipo, alumno, materia } = req.body;

  if (!tipo || !alumno || !materia) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const tipoAbreviado = abreviarTipo(tipo);

    const [result] = await pool.query(
      'INSERT INTO Asistencias (tipo, alumno, materia) VALUES (?, ?, ?)',
      [tipoAbreviado, alumno, materia]
    );

    res.status(201).json({
      mensaje: 'Asistencia registrada con éxito',
      asistencia: {
        id: result.insertId,
        tipo: tipoAbreviado,
        alumno,
        materia
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar asistencia', detalle: err.message });
  }
});

// Función para mapear tipo largo a abreviado
function abreviarTipo(texto) {
  const mapa = {
    'Presente': 'P',
    'Ausente': 'A',
    'Tarde': 'T',
    'Retiro Anticipado': 'RA'
  };
  return mapa[texto] || texto;
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
