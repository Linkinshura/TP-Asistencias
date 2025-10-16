INSERT INTO cursos (anio, division, turno, especialidad, aula) VALUES
(4, 3, "Noche", "Computacion", 20),
(4, 4, "Tarde", "Computacion", 18),
(4, 5, "Mañana", "Computacion", 3);

INSERT INTO alumnos (nombre, apellido, curso) VALUES
<--- 4to 3ra
("Victor", "Aguilar", 1),
("Agustin", "Albina", 1),
("Ariel", "Alvarez", 1),
("Leonel", "Apaza", 1),
("Katherine", "Benavidez", 1),
("Lucas", "Brem", 1),
("Eric", "Cornejo", 1),
("Luna", "Estanga", 1),
("Cain", "Flores", 1),
("Kevin", "Flores", 1),
("Aurea", "Gomez", 1),
("Florencia", "Gonzales", 1),
("Ian", "Gutierrez", 1),
("Tomas", "Hasmat", 1),
("Lucas", "Huala", 1),
("Max", "Iacovone", 1),
("Fabricio", "Jauregui", 1),
("Sol", "Liste", 1),
("Josua", "Lopez", 1),
("Marcos", "Madonni", 1),
("Nazir", "Molina", 1),
("Lourdes", "Moya", 1),
("Aramis", "Perez", 1),
("Richard", "Prado", 1),
("Esteban", "Quispe", 1),
("Adriano", "Romero", 1),
("Facundo", "Vattino", 1),
("Francisco", "Vazques", 1),
("Fausto", "Venguria", 1),
("Santiago", "Villaroel", 1),
("Bruno", "Zapico", 1),




 <--- 4to 4ta
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
 <--- 4to 5ta
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


INSERT INTO materias (nombre, horas, profesor, contraturno, curso) VALUES
 <--- 4to 3ra
("Proyecto Informatico", 4, "Santiago Trini", 0, 1),
("Organizacion de las Computadoras", 7, "Alexis De Reyes", 0, 1),
("Laboratorio de Algoritmos y Estructura de Datos", 9, "Camila De La Puente", 0, 1),
("Lengua", 3, "Ernesto Garcia", 0, 1),

 <--- 4to 4ta
("Laboratorio De Algoritmos y Estructura de Datos", 9, "Santiago Trini", 1, 2),
("Base De Datos", 8, "Fabiola Perez Pardela", 0, 2),
("Geografia", 3, "Guadalupe Cortez Torres", 0, 2),
("Historia", 3, "Rodrigo Frey", 0, 2),
 
 <--- 4to 5ta
("Logica Computacional", 3, "Gonzalo Ledesma", 0, 3),
("Historia", 3, "David Lizzaraga", 0, 3),
("Proyecto Informatico", 4, "Agustin Pecile", 0, 3),
("Geografia", 3, "Guadalupe Cortez Torres", 0, 3);

<--- Insert para hacer en JS INSERT INTO asistencias (tipo, alumno, materia)
