const form = document.getElementById('formRegistro');
const lista = document.getElementById('listaUsuarios');
let integrantes = JSON.parse(localStorage.getItem('integrantes')) || [];

document.addEventListener('DOMContentLoaded', () => {
    cargarIntegrantes();
    // Mejorar experiencia móvil
    document.querySelectorAll('input, textarea').forEach(input => {
        input.style.fontSize = '16px'; // Evita zoom automático en iOS
    });
});

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const sangre = document.getElementById('sangre').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const enfermedades = document.getElementById('enfermedades').value;
    const alergias = document.getElementById('alergias').value;
    const edad = calcularEdad(fechaNacimiento);

    const usaMedicacion = document.getElementById('usaMedicacion').checked;
    const medicacionDetalle = document.getElementById('medicacionDetalle').value;

    const integrante = {
        id: Date.now(),
        nombre,
        sangre,
        fechaNacimiento,
        edad,
        enfermedades,
        alergias,
        usaMedicacion,
        medicacionDetalle
    };

    integrantes.push(integrante);
    guardarIntegrantes();
    mostrarIntegrante(integrante);
    form.reset();
});

function calcularEdad(fecha) {
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

function toggleMedicacionInput() {
    const checkbox = document.getElementById('usaMedicacion');
    const input = document.getElementById('medicacionDetalle');
    input.style.display = checkbox.checked ? 'block' : 'none';
    if (checkbox.checked) input.focus();
}

function guardarIntegrantes() {
    localStorage.setItem('integrantes', JSON.stringify(integrantes));
}

function cargarIntegrantes() {
    lista.innerHTML = '';
    integrantes.forEach(mostrarIntegrante);
}

function mostrarIntegrante(integrante) {
    const li = document.createElement('li');
    li.classList.add('integrante-item');
    li.dataset.id = integrante.id;

    const formatValue = (v, d = 'Ninguna') => v && v.trim() !== '' ? v : d;

    li.innerHTML = `
        <strong>${escapeHtml(integrante.nombre)}</strong> (${integrante.edad} años)<br>
        <span>Tipo de sangre: ${escapeHtml(integrante.sangre)}</span><br>
        <span>Enfermedades: ${escapeHtml(formatValue(integrante.enfermedades))}</span><br>
        <span>Alergias: ${escapeHtml(formatValue(integrante.alergias))}</span><br>
        <span>Medicación: ${integrante.usaMedicacion
            ? escapeHtml(formatValue(integrante.medicacionDetalle, 'Sí (sin detalles)'))
            : 'No'
        }</span><br>
        <button class="boton-editar">Editar</button>
        <button class="boton-eliminar">Eliminar</button>
    `.trim();

    li.querySelector('.boton-editar').addEventListener('click', () => editarIntegrante(integrante.id));
    li.querySelector('.boton-eliminar').addEventListener('click', () => eliminarIntegrante(integrante.id));

    lista.appendChild(li);
}

function escapeHtml(unsafe) {
    return unsafe?.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;") || '';
}

function eliminarIntegrante(id) {
    if (confirm('¿Estás seguro de eliminar este integrante?')) {
        integrantes = integrantes.filter(integ => integ.id !== id);
        guardarIntegrantes();
        cargarIntegrantes();
    }
}

function editarIntegrante(id) {
    const integrante = integrantes.find(i => i.id === id);
    if (!integrante) return;

    document.getElementById('nombre').value = integrante.nombre;
    document.getElementById('sangre').value = integrante.sangre;
    document.getElementById('fechaNacimiento').value = integrante.fechaNacimiento;
    document.getElementById('enfermedades').value = integrante.enfermedades;
    document.getElementById('alergias').value = integrante.alergias;
    document.getElementById('usaMedicacion').checked = integrante.usaMedicacion;
    document.getElementById('medicacionDetalle').style.display = integrante.usaMedicacion ? 'block' : 'none';
    document.getElementById('medicacionDetalle').value = integrante.medicacionDetalle || '';

    eliminarIntegrante(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}