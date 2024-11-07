const BASE_URL = 'http://localhost:8080/api/rutina';

function getAllRutinas() {
    fetch(`${BASE_URL}/getAllRutina`)
        .then(response => {
            if (!response.ok) {
                showAlert("No se pudo obtener la lista de rutinas", 'error');
                throw new Error('No se pudo obtener la lista de rutinas');
            }
            return response.json();
        })
        .then(rutinas => {
            displayRutinas(rutinas);
        })
        .catch(error => {
            console.error('Error al obtener la lista de rutinas:', error);
        });
}

function displayRutinas(rutinas) {
    const rutinasListElement = document.getElementById('rutinasList');
    rutinasListElement.innerHTML = '';

    rutinas.forEach(rutina => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${rutina.nombre}</td>
            <td>${rutina.descripcion}</td>
            <td>${rutina.idMaquina}</td>
            <td>${rutina.nombreMaquina}</td>
            <td>
                <button class="btn btn-success btn-sm edit" data-id="${rutina.id}">Editar</button>
            </td>
            <td>
                <button class="btn btn-danger btn-sm delete" onclick="deleteRutina(${rutina.id})">Eliminar</button>
            </td>
        `;
        rutinasListElement.appendChild(row);
    });
}

function createRutina(event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente
  
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const idMaquina = document.getElementById('idMaquina').value;
    const nombreMaquina = document.getElementById('nombreMaquina').value;
  
    const data = {
        nombre: nombre,
        descripcion: descripcion,
        idMaquina: idMaquina,
        nombreMaquina: nombreMaquina
    };
  
    console.log('Data a enviar:', data); // Registro para verificar los datos antes de enviarlos
  
    fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            showAlert("No se pudo crear la rutina", 'error');
            throw new Error('No se pudo crear la rutina');
        }
        getAllRutinas();
        document.getElementById('rutina-form').reset();
        console.log('Rutina creada exitosamente');
        showAlert("Rutina creada exitosamente", 'success');
    })
    .catch(error => {
        showAlert("No se pudo crear la rutina", 'error');
    });
}

function cargarDatosRutinaParaEditar(id) {
    fetch(`${BASE_URL}/${id}`)
        .then(response => {
            if (!response.ok) {
                showAlert('No se pudo obtener la rutina', 'error');
                throw new Error('No se pudo obtener la rutina');
            }
            return response.json();
        })
        .then(rutina => {
            document.getElementById('editNombre').value = rutina.nombre;
            document.getElementById('editDescripcion').value = rutina.descripcion;
            document.getElementById('editIdMaquina').value = rutina.idMaquina;
            document.getElementById('editNombreMaquina').value = rutina.nombreMaquina;
            document.getElementById('editRutinaId').value = id;
        })
        .catch(error => {
            console.error('Error al obtener la rutina para editar:', error);
        });
}

function guardarCambiosRutina(event) {
    event.preventDefault(); // Evitar que el formulario se envíe automáticamente

    const nombre = document.getElementById('editNombre').value;
    const descripcion = document.getElementById('editDescripcion').value;
    const idMaquina = document.getElementById('editIdMaquina').value;
    const nombreMaquina = document.getElementById('editNombreMaquina').value;
    const id = document.getElementById('editRutinaId').value;

    const data = {
        id: id,
        nombre: nombre,
        descripcion: descripcion,
        idMaquina: idMaquina,
        nombreMaquina: nombreMaquina
    };

    fetch(`${BASE_URL}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            showAlert('No se pudieron guardar los cambios en la rutina', 'error');
            throw new Error('No se pudieron guardar los cambios en la rutina');
        }
        getAllRutinas();
        const modal = document.getElementById('editRutinaModal');
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
        modalBackdrop.parentNode.removeChild(modalBackdrop);
        showAlert("Rutina actualizada exitosamente", 'success');
    })
    .catch(error => {
        showAlert('Error al guardar los cambios en la rutina', 'error');
    });
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit')) {
        const id = event.target.dataset.id;
        cargarDatosRutinaParaEditar(id);
        const modal = document.getElementById('editRutinaModal');
        modal.classList.add('show');
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
        const modalBackdrop = document.createElement('div');
        modalBackdrop.classList.add('modal-backdrop', 'fade', 'show');
        document.body.appendChild(modalBackdrop);
    }
});

document.getElementById('editRutinaForm').addEventListener('submit', guardarCambiosRutina);

function deleteRutina(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta rutina?')) {
        fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    showAlert('Error al eliminar la rutina', 'error');
                    throw new Error('Error al eliminar la rutina');
                }
                getAllRutinas();
                showAlert("Rutina eliminada exitosamente", 'success');
            })
            .catch(error => {
                showAlert('Error al eliminar la rutina', 'error');
            });
    }
}

window.onload = getAllRutinas;
