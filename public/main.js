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

                const tipos = [
  { texto: "Presente", autoHora: null },
  { texto: "Ausente", autoHora: null },
  { texto: "Tarde", autoHora: "ingreso" },
  { texto: "Presente con Atraso", autoHora: "ingreso" },
  { texto: "Retiro Anticipado", autoHora: "egreso" }
];

tipos.forEach(t => {
  const btn = document.createElement("button");
  btn.textContent = t.texto;
  btn.className = "btn-asistencia"; // si ya usás clases, mantenelas
  btn.onclick = () => enviarAsistencia(alumno.id, materiaId, t.texto, t.autoHora);
  contenedorBotones.appendChild(btn);
});
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



async function cargarAsistencias() {
  const curso = document.getElementById("cursos").value;
  const materia = document.getElementById("materias").value;
  const fecha = document.getElementById("fechaFiltro").value;

  if(!curso || !materia || !fecha) {
    alert("Elegí curso, materia y fecha");
    return;
  }

  const res = await fetch(`/api/asistencias?fecha=${fecha}&curso=${curso}&materia=${materia}`);
  const data = await res.json();
  
  const tabla = document.getElementById("tablaAsistencias");
  const cuerpo = tabla.querySelector("tbody");
  cuerpo.innerHTML = "";

  if (data.asistencias?.length > 0) {
    tabla.style.display = "table";
    
    data.asistencias.forEach(a => {
      cuerpo.innerHTML += `
        <tr>
          <td>${a.alumno_id}</td>
          <td>${a.nombre}</td>
          <td>${a.apellido}</td>
          <td>${a.tipo}</td>
          <td>${a.fecha_ingreso ?? "-"}</td>
          <td>${a.fecha_egreso ?? "-"}</td>
          <td>${a.id}</td>
          <td>
            <button onclick="editarAsistencia(${a.id})">✏️</button>
            <button onclick="eliminarAsistencia(${a.id})">🗑️</button>
          </td>
        </tr>
      `;
    });

  } else {
    tabla.style.display = "none";
    alert("No hay asistencias ese día");
  }
}

async function eliminarAsistencia(id) {
  if(!confirm("¿Eliminar asistencia?")) return;

  await fetch(`/api/asistencias/${id}`, { method: "DELETE" });
  cargarAsistencias();
}

async function editarAsistencia(id) {
  const tipo = prompt("Nuevo tipo (P, A, T, RA, PA):");
  const fecha_ingreso = prompt("Fecha ingreso (YYYY-MM-DD HH:MM) o vacío:");
  const fecha_egreso = prompt("Fecha egreso (YYYY-MM-DD HH:MM) o vacío:");

  await fetch(`/api/asistencias/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipo, fecha_ingreso, fecha_egreso })
  });

  cargarAsistencias();
}


async function enviarAsistencia(alumnoId, materiaId, tipo, autoHora) {
  try {
    await fetch("http://localhost:3000/api/asistencias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alumno: alumnoId, materia: materiaId, tipo, autoHora })
    });

    alert(`${tipo} registrada`);
    crearListaConBotones(); // refresca lista
  } catch (err) {
    console.error(err);
    alert("Error registrando asistencia");
  }
}




// === INICIO ===
document.addEventListener('DOMContentLoaded', () => {
    cargarCursos();
});