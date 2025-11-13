// Materias en consulta
async function cargarMateriasConsulta(cursoId) {
  const materiaSelect = document.getElementById('consultaMateria');
  if (!cursoId) {
    materiaSelect.disabled = true;
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/materias/${cursoId}`);
    const materias = await res.json();
    materiaSelect.innerHTML = '<option value="">Seleccione</option>';
    materias.forEach(m => materiaSelect.innerHTML += `<option value="${m.id}">${m.nombre}</option>`);
    materiaSelect.disabled = false;
  } catch (error) {
    console.error('Error al cargar materias:', error);
  }
}

// Tabla de Asistencias
function renderAsistencias(asistencias) {
  const tbody = document.querySelector('#tablaAsistencias tbody');
  tbody.innerHTML = '';
  asistencias.forEach(a => {
    const fila = document.createElement('tr');
  fila.innerHTML = `
  <td>${a.id}</td>
  <td>${a.alumno_id}</td>
  <td>${a.nombres}</td>
  <td>${a.apellidos}</td>
  <td>${a.tipo}</td>
  <td>${a.hora_ingreso || '-'}</td>
  <td>${a.hora_egreso || '-'}</td>
  <td>${a.fecha}</td>
  <td>
    <button class="editar" onclick="editarAsistencia(${a.id})">Editar</button>
    <button class="eliminar" onclick="eliminarAsistencia(${a.id})">Eliminar</button>
  </td>
`;

    tbody.appendChild(fila);
  });
}

// Boton para editar asistencias
async function editarAsistencia(id) {
  try {
    const tipo = prompt('Ingrese nuevo tipo (A, P, T, RA, PA):');
    if (!tipo) return alert('Edición cancelada.');

    let hora_ingreso = null;
    let hora_egreso = null;

    if (tipo === 'T' || tipo === 'PA') {
      hora_ingreso = prompt('Ingrese hora de ingreso (HH:MM):', obtenerHoraActual());
    } else if (tipo === 'RA') {
      hora_egreso = prompt('Ingrese hora de egreso (HH:MM):', obtenerHoraActual());
    }

    const res = await fetch(`http://localhost:3000/asistencias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo, hora_ingreso, hora_egreso })
    });

    if (res.ok) {
      alert('Asistencia actualizada correctamente.');
      consultarAsistencias();
    } else {
      alert('Error al actualizar la asistencia.');
    }
  } catch (error) {
    console.error('Error al editar asistencia:', error);
  }
}

// Boton para eliminar asistencias
async function eliminarAsistencia(id) {
  try {
    const confirmar = confirm('¿Seguro que desea eliminar este registro?');
    if (!confirmar) return;

    const res = await fetch(`http://localhost:3000/asistencias/${id}`, { method: 'DELETE' });

    if (res.ok) {
      alert('Registro eliminado correctamente.');
      consultarAsistencias();
    } else {
      alert('Error al eliminar el registro.');
    }
  } catch (error) {
    console.error('Error al eliminar asistencia:', error);
  }
}

// Para la hora actual
function obtenerHoraActual() {
  const ahora = new Date();
  const horas = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');
  return `${horas}:${minutos}`;
}

// Eventos
document.addEventListener('DOMContentLoaded', cargarCursos);
document.getElementById('btnCrearAlumno').addEventListener('click', crearAlumno);
document.getElementById('filtroCurso').addEventListener('change', e => cargarMateriasYAlumnos(e.target.value));
document.getElementById('consultaCurso').addEventListener('change', e => cargarMateriasConsulta(e.target.value));
document.getElementById('btnConsultar').addEventListener('click', consultarAsistencias);