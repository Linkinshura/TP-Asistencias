-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS colegio;
USE colegio;

-- Tabla de cursos
CREATE TABLE IF NOT EXISTS cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100)
);

-- Tabla de materias
CREATE TABLE IF NOT EXISTS materias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100)
);

-- Tabla de alumnos
CREATE TABLE IF NOT EXISTS alumnos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  curso_id INT,
  FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

-- Relación alumnos ↔ materias (muchos a muchos)
CREATE TABLE IF NOT EXISTS alumnos_materias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alumno_id INT,
  materia_id INT,
  FOREIGN KEY (alumno_id) REFERENCES alumnos(id),
  FOREIGN KEY (materia_id) REFERENCES materias(id)
);

-- Tabla de asistencias
CREATE TABLE IF NOT EXISTS asistencias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alumno_id INT,
  curso_id INT,
  materia_id INT,
  estado ENUM('Presente', 'Ausente', 'Retiro Anticipado', 'Llego tarde'),
  hora DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Datos de ejemplo
INSERT INTO cursos (nombre) VALUES ('1º Año'), ('2º Año');

INSERT INTO materias (nombre) VALUES ('Matemática'), ('Lengua');

INSERT INTO alumnos (nombre, curso_id) VALUES 
('Juan Pérez', 1),
('Ana Gómez', 1),
('Carlos Ruiz', 2);

INSERT INTO alumnos_materias (alumno_id, materia_id) VALUES
(1, 1), -- Juan - Matemática
(2, 1), -- Ana - Matemática
(3, 2); -- Carlos - Lengua
