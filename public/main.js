function HandleClick(event) {
    const tipo = event.target.textContent;
    const alumno = document.querySelector('#alumnos').value;
    const materia = document.querySelector('#materias').value;

    if (!alumno || !materia) {
        alert('Debe seleccionar un alumno y una materia.');
        return;
    }

    const datos = { tipo, alumno, materia };

    const options = {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: { 'Content-Type': 'application/json' }
    };

    const url = 'http://localhost:3000/api/asistencias';

    fetch(url, options)
        .then(res => res.json())
        .then(data => alert(JSON.stringify(data, null, 2)))
        .catch(err => alert('Error: ' + err.message));
}

function cargarCursos() {
    fetch('http://localhost:3000/api/cursos')
        .then(res => res.json())
        .then(data => {
            const select = document.querySelector('#cursos');
            select.innerHTML = '<option value="">Seleccione un curso</option>';
            for (let curso of data) {
                const option = document.createElement('option');
                const { anio, division, especialidad, id } = curso;
                option.textContent = `${anio}° ${division} - ${especialidad}`;
                option.value = id;
                select.append(option);
            }
        });
}

function cargarMaterias(e) {
    const cursoId = e.target.value;

    if (!cursoId) return;

    // Cargar materias
    fetch(`http://localhost:3000/api/materias/${cursoId}`)
        .then(res => res.json())
        .then(data => {
            const select = document.querySelector('#materias');
            select.innerHTML = '<option value="">Seleccione una materia</option>';
            for (let materia of data) {
                const option = document.createElement('option');
                option.textContent = materia.nombre;
                option.value = materia.id;
                select.append(option);
            }
        });

    // Cargar alumnos
    cargarAlumnos(cursoId);
}

function cargarAlumnos(cursoId) {
    fetch(`http://localhost:3000/api/alumnos/${cursoId}`)
        .then(res => res.json())
        .then(data => {
            const select = document.querySelector('#alumnos');
            select.innerHTML = '<option value="">Seleccione un alumno</option>';
            for (let alumno of data) {
                const option = document.createElement('option');
                option.textContent = `${alumno.apellido}, ${alumno.nombre}`;
                option.value = alumno.id;
                select.append(option);
            }
        });
}

function crearListaConBotones() {
    const materiaId = document.querySelector('#materias').value;
    const cursoId = document.querySelector('#cursos').value;

    if (!materiaId || !cursoId) return;

    fetch(`http://localhost:3000/api/alumnos/${cursoId}`)
        .then(res => res.json())
        .then(alumnos => {
            const contenedor = document.querySelector('#lista-alumnos');
            contenedor.innerHTML = ''; // Limpiar contenido anterior

            for (let alumno of alumnos) {
                const fila = document.createElement('div');
                fila.className = 'fila-alumno';

                const nombre = document.createElement('span');
                nombre.textContent = `${alumno.apellido}, ${alumno.nombre}`;
                nombre.className = 'nombre-alumno';

                const botones = document.createElement('div');
                botones.className = 'botones-asistencia';

                const tipos = ['Presente', 'Ausente', 'Tarde', 'Retiro Anticipado'];

                for (let tipo of tipos) {
                    const boton = document.createElement('button');
                    boton.textContent = tipo;
                    boton.className = 'btn-asistencia';
                    boton.addEventListener('click', () => {
                        enviarAsistencia(tipo, alumno.id, materiaId);
                    });
                    botones.appendChild(boton);
                }

                fila.appendChild(nombre);
                fila.appendChild(botones);
                contenedor.appendChild(fila);
            }
        });
}
function enviarAsistencia(tipo, alumnoId, materiaId) {
    const datos = { tipo, alumno: alumnoId, materia: materiaId };

    const options = {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: { 'Content-Type': 'application/json' }
    };

    fetch('http://localhost:3000/api/asistencias', options)
        .then(res => res.json())
        .then(data => alert(JSON.stringify(data, null, 2)))
        .catch(err => alert('Error: ' + err.message));
}



// Cargar cursos al iniciar
cargarCursos();
