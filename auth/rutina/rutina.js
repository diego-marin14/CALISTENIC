const BASE_URL = 'http://localhost:8080/api/rutina';

function getAllRutinas() {
    fetch(`${BASE_URL}/getAllRutina`)
        .then(response => {
            if (!response.ok) {
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
            throw new Error('No se pudo crear la rutina');
        }
        // Actualizar la lista de rutinas después de crear una nueva
        getAllRutinas();
        // Limpiar el formulario después de crear la rutina
        document.getElementById('rutina-form').reset();
        console.log('Rutina creada exitosamente'); // Registro para verificar el éxito de la operación
    })
    .catch(error => {
        console.error('Error al crear la rutina:', error);
    });
}
function cargarDatosRutinaParaEditar(id) {
    // Obtener los datos de la rutina desde tu servidor (por ejemplo, mediante una solicitud GET)
    fetch(`${BASE_URL}/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener la rutina');
            }
            return response.json();
        })
        .then(rutina => {
            // Llenar el formulario con los datos de la rutina
            document.getElementById('editNombre').value = rutina.nombre;
            document.getElementById('editDescripcion').value = rutina.descripcion;
            document.getElementById('editIdMaquina').value = rutina.idMaquina;
            document.getElementById('editNombreMaquina').value = rutina.nombreMaquina;
            document.getElementById('editRutinaId').value = id; // Establecer el id de la rutina en un campo oculto
        })
        .catch(error => {
            console.error('Error al obtener la rutina para editar:', error);
        });
}

function guardarCambiosRutina(event) {
    event.preventDefault(); // Evitar que el formulario se envíe automáticamente

    // Obtener los nuevos valores del formulario de edición
    const nombre = document.getElementById('editNombre').value;
    const descripcion = document.getElementById('editDescripcion').value;
    const idMaquina = document.getElementById('editIdMaquina').value;
    const nombreMaquina = document.getElementById('editNombreMaquina').value;
    const id = document.getElementById('editRutinaId').value; // Obtener el id de la rutina que se está editando

    // Construir el objeto con los nuevos datos de la rutina
    const data = {
        id: id,
        nombre: nombre,
        descripcion: descripcion,
        idMaquina: idMaquina,
        nombreMaquina: nombreMaquina
    };

    // Enviar los datos al servidor mediante una solicitud PUT
    fetch(`${BASE_URL}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudieron guardar los cambios en la rutina');
        }
        // Actualizar la lista de rutinas después de guardar los cambios
        getAllRutinas();
        // Cerrar el modal de edición
        const modal = document.getElementById('editRutinaModal');
        modal.classList.remove('show'); // Ocultar el modal
        modal.style.display = 'none'; // Ocultar el modal
        document.body.classList.remove('modal-open'); // Eliminar la clase de body que agrega el modal
        const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
        modalBackdrop.parentNode.removeChild(modalBackdrop); // Eliminar el fondo del modal
    })
    .catch(error => {
        console.error('Error al guardar los cambios en la rutina:', error);
    });
}

// Llamar a la función cargarDatosRutinaParaEditar cuando se hace clic en el botón de editar en la tabla
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit')) {
        const id = event.target.dataset.id; // Obtener el id de la rutina desde el atributo data-id del botón
        cargarDatosRutinaParaEditar(id);
        const modal = document.getElementById('editRutinaModal');
        modal.classList.add('show'); // Mostrar el modal de edición
        modal.style.display = 'block'; // Mostrar el modal de edición
        document.body.classList.add('modal-open'); // Agregar la clase de body que agrega el modal
        const modalBackdrop = document.createElement('div');
        modalBackdrop.classList.add('modal-backdrop', 'fade', 'show');
        document.body.appendChild(modalBackdrop); // Agregar el fondo del modal
    }
});

// Agregar el evento submit al formulario de edición
document.getElementById('editRutinaForm').addEventListener('submit', guardarCambiosRutina);

function deleteRutina(id) {
    // Aquí puedes implementar la lógica para eliminar una rutina
    // Por ejemplo, podrías mostrar un mensaje de confirmación y luego hacer la solicitud DELETE al servidor
    if (confirm('¿Estás seguro de que quieres eliminar esta rutina?')) {
        fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar la rutina');
                }
                // Actualizar la lista de rutinas después de eliminar
                getAllRutinas();
            })
            .catch(error => {
                console.error('Error al eliminar la rutina:', error);
            });
    }
}
// Llamar a getAllRutinas al cargar la página
window.onload = getAllRutinas;
