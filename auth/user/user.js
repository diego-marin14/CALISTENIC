const BASE_URL = 'http://localhost:8080/api/usuario';

function getAllUsuarios() {
    fetch(`${BASE_URL}/getAll`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener la lista de usuarios');
            }
            return response.json();
        })
        .then(usuarios => {
            displayUsuarios(usuarios);
        })
        .catch(error => {
            console.error('Error al obtener la lista de usuarios:', error);
        });
}

function displayUsuarios(usuarios) {
    const usuariosListElement = document.getElementById('usuariosList');
    usuariosListElement.innerHTML = '';

    usuarios.forEach(usuario => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.idPersona}</td>
            <td>${usuario.idSuscripcion}</td>
            <td>${usuario.peso}</td>
            <td>${usuario.estatura}</td>
            <td>${usuario.tipoCuerpo}</td>
            <td>${usuario.porcentajeGraso}</td>
            <td>${usuario.objetivo}</td>
            <td>
                <button class="btn btn-success btn-sm edit" data-id="${usuario.id}">Editar</button>
            </td>
            <td>
                <button class="btn btn-danger btn-sm delete" onclick="deleteUsuario(${usuario.id})">Eliminar</button>
            </td>
        `;
        usuariosListElement.appendChild(row);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.getElementById('formContainer');
    const btnAgregarUsuario = document.getElementById('btnAgregarUsuario');

    btnAgregarUsuario.addEventListener('click', () => {
        if (formContainer.style.display === 'none') {
            formContainer.style.display = 'block';
            btnAgregarUsuario.textContent = 'Cerrar Formulario';
        } else {
            formContainer.style.display = 'none';
            btnAgregarUsuario.textContent = 'Agregar Usuario';
        }
    });

    document.getElementById('usuario-form').addEventListener('submit', createUsuario);
});


function createUsuario(event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente
  
    const idPersona = document.getElementById('idPersona').value;
    const idSuscripcion = document.getElementById('idSuscripcion').value;
    const peso = document.getElementById('peso').value;
    const estatura = document.getElementById('estatura').value;
    const tipoCuerpo = document.getElementById('tipoCuerpo').value;
    const porcentajeGraso = document.getElementById('porcentajeGraso').value;
    const objetivo = document.getElementById('objetivo').value;
  
    const data = {
        idPersona: idPersona,
        idSuscripcion: idSuscripcion,
        peso: peso,
        estatura: estatura,
        tipoCuerpo: tipoCuerpo,
        porcentajeGraso: porcentajeGraso,
        objetivo: objetivo
    };
  
    console.log('Data a enviar:', data); // Registro para verificar los datos antes de enviarlos
  
    fetch('http://localhost:8080/api/usuario/create', { // Ajusta la URL para la creación de usuarios
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo crear el usuario');
        }
        // Actualizar la lista de usuarios después de crear uno nuevo
        getAllUsuarios();
        // Limpiar el formulario después de crear el usuario
        document.getElementById('usuario-form').reset();
        console.log('Usuario creado exitosamente'); // Registro para verificar el éxito de la operación
    })
    .catch(error => {
        console.error('Error al crear el usuario:', error);
    });
}


function cargarDatosUsuarioParaEditar(id) {
    fetch(`${BASE_URL}/findById/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener el usuario para editar');
            }
            return response.json();
        })
        .then(usuario => {
            // Llenar el formulario con los datos del usuario
            document.getElementById('editIdPersona').value = usuario.idPersona;
            document.getElementById('editIdSuscripcion').value = usuario.idSuscripcion.nm;
            document.getElementById('editPeso').value = usuario.peso;
            document.getElementById('editEstatura').value = usuario.estatura;
            document.getElementById('editTipoCuerpo').value = usuario.tipoCuerpo;
            document.getElementById('editPorcentajeGraso').value = usuario.porcentajeGraso;
            document.getElementById('editObjetivo').value = usuario.objetivo;
            document.getElementById('editUsuarioId').value = id; // Establecer el id del usuario en un campo oculto
        })
        .catch(error => {
            console.error('Error al obtener el usuario para editar:', error);
        });
}


function guardarCambiosUsuario(event) {
    event.preventDefault(); // Evitar que el formulario se envíe automáticamente

    // Obtener los nuevos valores del formulario de edición
    const idPersona = document.getElementById('editIdPersona').value;
    const idSuscripcion = document.getElementById('editIdSuscripcion').value;
    const peso = document.getElementById('editPeso').value;
    const estatura = document.getElementById('editEstatura').value;
    const tipoCuerpo = document.getElementById('editTipoCuerpo').value;
    const porcentajeGraso = document.getElementById('editPorcentajeGraso').value;
    const objetivo = document.getElementById('editObjetivo').value;
    const id = document.getElementById('editUsuarioId').value; // Obtener el id del usuario que se está editando

    // Construir el objeto con los nuevos datos del usuario
    const data = {
        id: id,
        idPersona: idPersona,
        idSuscripcion: idSuscripcion,
        peso: peso,
        estatura: estatura,
        tipoCuerpo: tipoCuerpo,
        porcentajeGraso: porcentajeGraso,
        objetivo: objetivo
    };

    // Enviar los datos al servidor mediante una solicitud PUT
    fetch(`${BASE_URL}/update/${id}`, { // Incluye el ID del usuario en la URL
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })    
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudieron guardar los cambios en el usuario');
        }
        // Actualizar la lista de usuarios después de guardar los cambios
        getAllUsuarios();
        // Cerrar el modal de edición
        const modal = document.getElementById('editUsuarioModal');
        modal.classList.remove('show'); // Ocultar el modal
        modal.style.display = 'none'; // Ocultar el modal
        document.body.classList.remove('modal-open'); // Eliminar la clase de body que agrega el modal
        const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
        modalBackdrop.parentNode.removeChild(modalBackdrop); // Eliminar el fondo del modal
    })
    .catch(error => {
        console.error('Error al guardar los cambios en el usuario:', error);
    });
}

// Llamar a la función cargarDatosUsuarioParaEditar cuando se hace clic en el botón de editar en la tabla
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit')) {
        const id = event.target.dataset.id; // Obtener el id del usuario desde el atributo data-id del botón
        cargarDatosUsuarioParaEditar(id);
        const modal = document.getElementById('editUsuarioModal');
        modal.classList.add('show'); // Mostrar el modal de edición
        modal.style.display = 'block'; // Mostrar el modal de edición
        document.body.classList.add('modal-open'); // Agregar la clase de body que agrega el modal
        const modalBackdrop = document.createElement('div');
        modalBackdrop.classList.add('modal-backdrop', 'fade', 'show');
        document.body.appendChild(modalBackdrop); // Agregar el fondo del modal
    }
});

document.getElementById('editUsuarioForm').addEventListener('submit', guardarCambiosUsuario);

function deleteUsuario(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        fetch(`${BASE_URL}/delete/${id}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el usuario');
                }
                getAllUsuarios();
            })
            .catch(error => {
                console.error('Error al eliminar el usuario:', error);
            });
    }
}

window.onload = getAllUsuarios;
