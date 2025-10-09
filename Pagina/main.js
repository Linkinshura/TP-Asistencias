const API = 'http://localhost:3000';

async function cargarFiltros() {
  const cursos = await fetch(`${API}/cursos`).then(r => r.json());
  const materias = await fetch(`${API}/materias`).then(r => r.json());

  const cursoSelect = document.getElementById('curso');
  cursos.forEach(c => {
    const option = document.createElement('option');
    option.value = c.id;
    option.text = c.nombre;
    cursoSelect.add(option);
  });

  const materiaSelect = document.getElementById('materia');
  materias.forEach(m => {
    const option = document.createElement('option');
    option.value = m.id;
    option.text = m.nombre;
    materiaSelect.add(option);
  });
}

async function cargarAlumnos() {
  const cursoId = document.getElementById('curso').value;
  const materiaId = document.getElementById('materia').value;

  const alumnos = await fetch(`${API}/alumnos?curso_id=${cursoId}&materia_id=${materiaId}`).then(r => r.json());

  const container = document.getElementById('alumnos-container');
  container.innerHTML = '';

  const table = document.createElement('table');
  table.border = '1';

  const header = table.insertRow();
  header.innerHTML = `
    <th>Nombre</th>
    <th>Presente</th>
    <th>Ausente</th>
    <th>Retiro Anticipado</th>
    <th>Llegó Tarde</th>
  `;

  alumnos.forEach(alumno => {
    const row = table.insertRow();
    row.insertCell().innerText = alumno.nombre;

   const estados = [
  { nombre: 'Presente', clase: 'presente' },
  { nombre: 'Ausente', clase: 'ausente' },
  { nombre: 'Retiro Anticipado', clase: 'retiro' },
  { nombre: 'Llego tarde', clase: 'tarde' }
];

estados.forEach(({ nombre, clase }) => {
  const btn = document.createElement('button');
  btn.innerText = nombre;
  btn.classList.add(clase);
  btn.onclick = () => registrarAsistencia(alumno.id, cursoId, materiaId, nombre);
  const cell = row.insertCell();
  cell.appendChild(btn);
});

  });

  container.appendChild(table);
}

async function registrarAsistencia(alumnoId, cursoId, materiaId, estado) {
  const hora = (estado === 'Retiro Anticipado' || estado === 'Llego tarde')
    ? new Date().toISOString()
    : null;

  await fetch(`${API}/asistencia`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alumno_id: alumnoId, curso_id: cursoId, materia_id: materiaId, estado, hora })
  });

  alert(`Asistencia "${estado}" registrada para el alumno ${alumnoId}`);
}

window.onload = cargarFiltros;
