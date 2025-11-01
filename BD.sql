DROP DATABASE IF EXISTS tp;
CREATE DATABASE IF NOT EXISTS tp;
use tp;
CREATE TABLE Cursos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    anio INT,
    division INT,
    turno ENUM("Mañana", "Tarde", "Noche"),
    especialidad ENUM("Automotores", "Computacion", "Ciclo basico"),
    aula INT
);

CREATE TABLE Alumnos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    dni INT,
    nombre VARCHAR(255),
    apellido VARCHAR(255),
    curso INT,
    FOREIGN KEY (curso) REFERENCES cursos(id) 
);

CREATE TABLE Materias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255),
    horas INT,
    profesor VARCHAR(255),
    contraturno BOOLEAN,
    curso INT,
    FOREIGN KEY (curso) REFERENCES cursos(id)
);

CREATE TABLE Asistencias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo ENUM("P","A","T","RA","PA"),
    alumno INT,
    materia INT,
    FOREIGN KEY (alumno) REFERENCES Alumnos(id),
    FOREIGN KEY (materia) REFERENCES Materias(id)
);
