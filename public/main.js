// === FORMULARIO: AGREGAR NUEVO ALUMNO ===
function handleSubmit(event) {
    event.preventDefault(); // evita recargar la página

    const nombre = document.querySelector('#nombre').value.trim();
    const apellido = document.querySelector('#apellido').value.trim();
    const curso = document.querySelector('#alumCurso').value.trim();

    if (!nombre || !apellido || !curso) {
        alert('Por favor, completá todos los campos.');
        return;
    }

    const datos = { nombre, apellido, curso };
    const options = {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: { 'Content-Type': 'application/json' }
    };

    fetch('http://localhost:3000/api/alumnos', options)
        .then(res => res.json())
        .then(data => {
            alert(data.mensaje || JSON.stringify(data, null, 2));
            document.querySelector('#form-alumno').reset();
        })
        .catch(err => alert('Error: ' + err.message));
}



// === CARGAR CURSOS ===
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
        })
        .catch(err => console.error('Error al cargar cursos:', err));
}



// === CARGAR MATERIAS Y ALUMNOS ===
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
        })
        .catch(err => console.error('Error al cargar materias:', err));

    // Cargar alumnos del curso
    cargarAlumnos(cursoId);
}



// === CARGAR ALUMNOS DEL CURSO ===
function cargarAlumnos(cursoId) {
    fetch(`http://localhost:3000/api/alumnos/${cursoId}`)
        .then(res => res.json())
        .then(data => {
            // Este select ya no se usa directamente, así que no lo generamos
            // Los alumnos se muestran en crearListaConBotones()
            console.log(`Alumnos del curso ${cursoId} cargados (${data.length})`);
        })
        .catch(err => console.error('Error al cargar alumnos:', err));
}



// === CREAR LISTA DE ALUMNOS CON BOTONES DE ASISTENCIA ===
function crearListaConBotones() {
    const materiaId = document.querySelector('#materias').value;
    const cursoId = document.querySelector('#cursos').value;

    if (!materiaId || !cursoId) return;

    fetch(`http://localhost:3000/api/alumnos/${cursoId}`)
        .then(res => res.json())
        .then(alumnos => {
            const contenedor = document.querySelector('#lista-alumnos');
            contenedor.innerHTML = ''; // limpiar contenido anterior

            if (alumnos.length === 0) {
                contenedor.textContent = 'No hay alumnos en este curso.';
                return;
            }

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
        })
        .catch(err => console.error('Error al crear lista de alumnos:', err));
}



// === ENVIAR ASISTENCIA ===
function enviarAsistencia(tipo, alumnoId, materiaId) {
    const datos = { tipo, alumno: alumnoId, materia: materiaId };

    const options = {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: { 'Content-Type': 'application/json' }
    };

    fetch('http://localhost:3000/api/asistencias', options)
        .then(res => res.json())
        .then(data => {
            if (data.error) alert('⚠️ ' + data.error);
            else alert('✅ ' + data.mensaje);
        })
        .catch(err => alert('Error: ' + err.message));
}



// === INICIO ===
document.addEventListener('DOMContentLoaded', () => {
    cargarCursos();
});