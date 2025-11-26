async function consultarAsistencias() {
  const curso = document.getElementById('consultaCurso').value;
  const materia = document.getElementById('consultaMateria').value;
  const fecha = document.getElementById('fechaFiltro').value;

  if (!curso || !materia || !fecha) return alert('Complete todos los filtros');

  try {
    const res = await fetch(`http://localhost:3000/asistencias?curso=${curso}&materia=${materia}&fecha=${fecha}`);
    const registros = await res.json();
    renderAsistencias(registros);
  } catch (error) {
    console.error('Error al consultar asistencias:', error);
  }
}


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
  <td>
    <button class="editar" onclick="editarAsistencia(${a.id})">Editar</button>
    <button class="eliminar" onclick="eliminarAsistencia(${a.id})">Eliminar</button>
  </td>
`;

    tbody.appendChild(fila);
  });
}


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

async function cargarCursos() {
  try {
    const res = await fetch('http://localhost:3000/cursos');
    const cursos = await res.json();

    const selects = ['selectCurso', 'filtroCurso', 'consultaCurso'];
    selects.forEach(id => {
      const select = document.getElementById(id);
      select.innerHTML = '<option value="">Seleccione</option>';
      cursos.forEach(c => {
        select.innerHTML += `<option value="${c.id}">${c.anio}-${c.division} ${c.esp}</option>`;
      });
    });
  } catch (error) {
    console.error('Error al cargar cursos:', error);
  }
}


async function crearAlumno() {
  const nombres = document.getElementById('nombre').value.trim();
  const apellidos = document.getElementById('apellido').value.trim();
  const curso = document.getElementById('selectCurso').value;

  if (!nombres || !apellidos || !curso) return alert('Complete todos los campos');

  try {
    await fetch('http://localhost:3000/alumnos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombres, apellidos, curso })
    });
    alert('Alumno creado correctamente');
  } catch (error) {
    console.error('Error al crear alumno:', error);
  }
}


async function cargarMateriasYAlumnos(cursoId) {
  const materiaSelect = document.getElementById('filtroMateria');
  const lista = document.getElementById('listaAlumnos');

  if (!cursoId) {
    materiaSelect.disabled = true;
    lista.innerHTML = '';
    return;
  }

  try {
    // matriass 
    const resMat = await fetch(`http://localhost:3000/materias/${cursoId}`);
    const materias = await resMat.json();
    materiaSelect.innerHTML = '<option value="">Seleccione</option>';
    materias.forEach(m => {
      materiaSelect.innerHTML += `<option value="${m.id}">${m.nombre}</option>`;
    });
    materiaSelect.disabled = false;

    // alumnos :p
    const resAl = await fetch(`http://localhost:3000/alumnos/${cursoId}`);
    const alumnos = await resAl.json();

    lista.innerHTML = '';
   alumnos.forEach(a => {
  const div = document.createElement('div');
  div.innerHTML = `
    <span>${a.nombres} ${a.apellidos}</span>
    <div class="botones-asistencia">
      <button class="estado" data-alumno="${a.id}" data-tipo="P">P</button>
      <button class="estado" data-alumno="${a.id}" data-tipo="T">T</button>
      <button class="estado" data-alumno="${a.id}" data-tipo="A">A</button>
      <button class="estado" data-alumno="${a.id}" data-tipo="RA">RA</button>
    </div>
  `;
  lista.appendChild(div);
});


    lista.querySelectorAll('button.estado').forEach(btn => {
      btn.addEventListener('click', () => registrarAsistencia(btn));
    });
  } catch (error) {
    console.error('Error al cargar materias o alumnos:', error);
  }
}


async function registrarAsistencia(btn) {
  const alumno = btn.dataset.alumno;
  const tipo = btn.dataset.tipo;
  const materia = document.getElementById('filtroMateria').value;

  if (!materia) return alert('Seleccione materia');

  try {
    await fetch('http://localhost:3000/asistencias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alumno, materia, tipo })
    });
    alert('Asistencia registrada');
    btn.parentNode.querySelectorAll('button.estado').forEach(b => b.disabled = true);
  } catch (error) {
    console.error('Error al registrar asistencia:', error);
  }
}


function obtenerHoraActual() {
  const ahora = new Date();
  const horas = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');
  return `${horas}:${minutos}`;
}


document.addEventListener('DOMContentLoaded', cargarCursos);
document.getElementById('btnCrearAlumno').addEventListener('click', crearAlumno);
document.getElementById('filtroCurso').addEventListener('change', e => cargarMateriasYAlumnos(e.target.value));
document.getElementById('consultaCurso').addEventListener('change', e => cargarMateriasConsulta(e.target.value));
document.getElementById('btnConsultar').addEventListener('click', consultarAsistencias);
