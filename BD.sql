DROP DATABASE IF EXISTS tp;
CREATE DATABASE tp;
USE tp;


CREATE TABLE cursos(
  id INT AUTO_INCREMENT PRIMARY KEY,
  anio INT,
  division INT,
  esp ENUM('Automotores', 'Ciclo basico', 'Computacion'),
  aula INT
);


CREATE TABLE alumnos(
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombres VARCHAR(255),
  apellidos VARCHAR(255),
  dni INT,
  curso INT,
  FOREIGN KEY (curso) REFERENCES cursos(id)
);


CREATE TABLE materias(
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  horas INT,
  profesor VARCHAR(255),
  contraturno BOOLEAN,
  curso INT,
  FOREIGN KEY (curso) REFERENCES cursos(id)
);


CREATE TABLE registros(
  id INT AUTO_INCREMENT PRIMARY KEY,
  creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  tipo ENUM('A','P','T','RA','AP'),
  alumno INT,
  materia INT,
  FOREIGN KEY(alumno) REFERENCES alumnos(id),
  FOREIGN KEY(materia) REFERENCES materias(id)
);



ALTER TABLE registros
ADD COLUMN hora_ingreso TIME NULL,
ADD COLUMN hora_egreso TIME NULL;


INSERT INTO cursos (anio, division, esp, aula) VALUES
(4, 3, 'Computacion', 20),
(4, 4, 'Computacion', 18),
(4, 5, 'Computacion', 3);


INSERT INTO materias (nombre, horas, profesor, contraturno, curso) VALUES
('Proyecto Informatico', 4, 'Santiago Trini', 0, 1),
('Organizacion de las Computadoras', 7, 'Alexis De Reyes', 0, 1),
('Laboratorio de Algoritmos y Estructura de Datos', 9, 'Camila De La Puente', 0, 1),
('Lengua', 3, 'Ernesto Garcia', 0, 1),
('Base De Datos', 8, 'Fabiola Perez Pardela', 0, 2),
('Geografia', 3, 'Guadalupe Cortez Torres', 0, 2),
('Historia', 3, 'Rodrigo Frey', 0, 2),
('Logica Computacional', 3, 'Gonzalo Ledesma', 0, 3),
('Proyecto Informatico', 4, 'Agustin Pecile', 0, 3),
('Geografia', 3, 'Guadalupe Cortez Torres', 0, 3);


INSERT INTO alumnos (nombres, apellidos, curso) VALUES
("Ian", "Gutierrez", 1),
("Luna", "Estanga", 1),
("Nazir", "Molina", 1),
("Santiago", "Villaroel", 1),
("Agustin", "Albina", 1),
("Tomas", "Hasmat", 1),
("Florencia", "Gonzales", 1),
("Aramis", "Perez Hurtado", 1),
("Facundo", "Vattino", 1),
("Bruno", "Zapico", 1),

("Joaquin", "Muzzi", 2),
("Felipe", "Igarzabal", 2),
("Ulises", "Verriotis", 2),
("Matias", "Siniani", 2),
("Santino", "Portaluppi", 2),
("Kevin", "Yavi", 2),
("Milagros", "Garmendia", 2),
("Sofia", "Valda", 2),
("Juan", "Hracek", 2),
("Luana", "Galvan", 2),

("Matias", "Decurguez", 3),
("Matias", "Ozores", 3),
("Antonio", "Vinazza", 3),
("Sarah", "Villareal", 3),
("Micaela", "Lonano", 3),
("Matias", "Lamenza", 3),
("Ciro", "Maratea", 3),
("Thiago", "Orue", 3),
("Jeronimo", "Heutchert", 3),
("Tiziano", "Roberti", 3);

