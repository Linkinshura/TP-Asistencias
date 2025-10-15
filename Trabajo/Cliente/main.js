function HandleClick(event) {
    const datos = {
        tipo: event.target.textContent,
        alumno: 2,
        materia: 1,
    };

    const options = {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: { 'Content-Type': 'application/json' }
    };

    const url = 'http://localhost:3000/api/asistencias';
    fetch(url, options)
        .then(res => res.json())
        .then(data => alert(JSON.stringify(data, null, 2)))
      //  .catch(err => alert(err.stack));
}

function cargarCursos() {
    fetch('http://localhost:3000/api/cursos')
        .then(res => res.json())
        .then(data => {
            const select = document.querySelector('#cursos');
            select.innerHTML = '';
            for (let curso of data) {
                const option = document.createElement('option');
                const { anio, division, esp, id } = curso;
                option.textContent = `${anio} ${division} ${esp}`;
                option.value = id;
                select.append(option);
            }
        })
     //   .catch(err => alert(err.stack));
}

function cargarMaterias(e) {
    const cursoId = e.target.value;
    fetch(`http://localhost:3000/api/materias/${cursoId}`)
        .then(res => res.json())
        .then(data => {
            const select = document.querySelector('#materias');
            select.innerHTML = '';
            for (let materia of data) {
                const option = document.createElement('option');
                option.textContent = materia.nombre;
                option.value = materia.id;
                select.append(option);
            }
        })
        // .catch(err => alert(err.stack));
}

function crearBotones() {
    const materiaId = document.querySelector('#materias').value;
    const contenedor = document.querySelector('#botones');
    contenedor.innerHTML = ''; // limpiar los anteriores

    if (!materiaId) return; // si no seleccionó materia, no muestra botones

    const tipos = ['Ausente', 'Tarde', 'Retiro Anticipado', 'Presente'];
    for (let tipo of tipos) {
        const boton = document.createElement('button');
        boton.textContent = tipo;
        boton.className = 'btn-asistencia';
        boton.addEventListener('click', HandleClick);
        contenedor.append(boton);
    }
}


cargarCursos();

