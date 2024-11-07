const BASE_URL_USUARIO = 'http://localhost:8080/api/usuario';
const BASE_URL_PERSONA= 'http://localhost:8080/api/persona';
const BASE_URL_SUSCRIPCION= 'http://localhost:8080/api/tipoSuscripcion';

const editUsuarioModal = document.getElementById("editUsuarioModal");
const editUsuarioForm = document.getElementById("editUsuarioForm");

// Evento click para el botón de edición



document.addEventListener("DOMContentLoaded", function() {
    // Llama a la función cuando la página esté completamente cargada
    getAllUsuarios();  // Por ejemplo, cargar los usuarios
    getAllPersonas();
    getAllSuscripcion()
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
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("edit")) {
        // Obtén el ID del usuario desde el atributo `data-id`
        const usuarioId = event.target.getAttribute("data-id");
        cargarDatosUsuarioParaEditar(usuarioId);
        
        
    }
});

function showAlert(message, backgroundColor = "#dc3545") {
    Toastify({
        text: message,
        position: "top-center",
        className: "error",
        duration: 4000,
        style: {
            background: backgroundColor,
        },
    }).showToast();
}

function getAllUsuarios() {
    fetch(`${BASE_URL_USUARIO}/getAll`)
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
            showAlert('Error al obtener la lista de usuarios: ' + error.message);
            console.error('Error al obtener la lista de usuarios:', error);
        });
}

function getAllPersonas() {
    console.log("pu")
    fetch(`${BASE_URL_PERSONA}/getAll`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener la lista de personas');
            }
            return response.json();
        })
        .then(personas => {
            displayPersonas(personas);
        })
        .catch(error => {
            showAlert('Error al obtener la lista de personas: ' + error.message);
            console.error('Error al obtener la lista de personas:', error);
        });
}

function getAllSuscripcion() {
    fetch(`${BASE_URL_SUSCRIPCION}/getAll`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener la lista de suscripciones');
            }
            return response.json();
        })
        .then(suscripcion => {
            displaySuscipciones(suscripcion);
        })
        .catch(error => {
            showAlert('Error al obtener la lista de suscripciones: ' + error.message);
            console.error('Error al obtener la lista de suscripciones:', error);
        });
}
function displaySuscipciones(suscripciones){
    const selectElement = document.getElementById('idSuscripcion');
    suscripciones.forEach(suscripcion => {
        const option = document.createElement('option');
        option.value = suscripcion.id;
        option.textContent = suscripcion.nombre;
        selectElement.appendChild(option);
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
function displayPersonas(personas) {
    const selectElement = document.getElementById('idPersona');
    personas.forEach(persona => {
        const option = document.createElement('option');
        option.value = persona.id;
        option.textContent = persona.nombre;
        selectElement.appendChild(option);
    });
}

function createUsuario(event) {
    event.preventDefault();

    const idPersona = document.getElementById('idPersona').value;
    const idSuscripcion = document.getElementById('idSuscripcion').value;
    const peso = document.getElementById('peso').value;
    const estatura = document.getElementById('estatura').value;
    const tipoCuerpo = document.getElementById('tipoCuerpo').value;
    const porcentajeGraso = document.getElementById('porcentajeGraso').value;
    const objetivo = document.getElementById('objetivo').value;
    const fechaFin=document.getElementById('idEndDateSuscripcion').value
    const fechaInicio=document.getElementById('idInitDateSuscripcion').value


    const data = {
        idPersona: idPersona,
        suscripcion:{
            idTipoSuscripcion: idSuscripcion,
            fechaInicio:fechaInicio,
            fechaFin:fechaFin,
            estado:true,
        },
        peso: peso,
        estatura: estatura,
        tipoCuerpo: tipoCuerpo,
        porcentajeGraso: porcentajeGraso,
        objetivo: objetivo
    };

    fetch('http://localhost:8080/api/usuario/create', {
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
        getAllUsuarios();
        document.getElementById('usuario-form').reset();
        showAlert('Usuario creado exitosamente', "#28a745");  // Green success alert
    })
    .catch(error => {
        showAlert('Error al crear el usuario: ' + error.message);
        console.error('Error al crear el usuario:', error);
    });
}

function cargarDatosUsuarioParaEditar(id) {
    fetch(`${BASE_URL_USUARIO}/findById/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener el usuario para editar');
            }
            return response.json();
        })
        .then(usuario => {
            document.getElementById('editIdPersona').value = usuario.idPersona;
            document.getElementById('editIdSuscripcion').value = usuario.idSuscripcion;
            document.getElementById('editPeso').value = usuario.peso;
            document.getElementById('editEstatura').value = usuario.estatura;
            document.getElementById('editTipoCuerpo').value = usuario.tipoCuerpo;
            document.getElementById('editPorcentajeGraso').value = usuario.porcentajeGraso;
            document.getElementById('editObjetivo').value = usuario.objetivo;
            document.getElementById('editUsuarioId').value = id;
            editUsuarioModal.style.display = "block";
        })
        .catch(error => {
            showAlert('Error al obtener el usuario para editar: ' + error.message);
            console.error('Error al obtener el usuario para editar:', error);
        });
}

function guardarCambiosUsuario(event) {
    event.preventDefault();
    const idPersona = document.getElementById('editIdPersona').value;
    const idSuscripcion = document.getElementById('editIdSuscripcion').value;
    const peso = document.getElementById('editPeso').value;
    const estatura = document.getElementById('editEstatura').value;
    const tipoCuerpo = document.getElementById('editTipoCuerpo').value;
    const porcentajeGraso = document.getElementById('editPorcentajeGraso').value;
    const objetivo = document.getElementById('editObjetivo').value;
    const id = document.getElementById('editUsuarioId').value;

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

    fetch(`${BASE_URL_USUARIO}/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log('pureb')
        if (!response.ok) {
            throw new Error('No se pudieron guardar los cambios en el usuario');
        }
        getAllUsuarios();
        const modal = document.getElementById('editUsuarioModal');
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
        modalBackdrop.parentNode.removeChild(modalBackdrop);
        showAlert('Cambios guardados exitosamente', "#28a745");  // Green success alert
    })
    .catch(error => {
        showAlert('Error al guardar los cambios en el usuario: ' + error.message);
        console.error('Error al guardar los cambios en el usuario:', error);
    });
}

function deleteUsuario(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        fetch(`${BASE_URL_USUARIO}/delete/${id}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el usuario');
                }
                getAllUsuarios();
                showAlert('Usuario eliminado exitosamente', "#28a745");  // Green success alert
            })
            .catch(error => {
                showAlert('Error al eliminar el usuario: ' + error.message);
                console.error('Error al eliminar el usuario:', error);
            });
    }
}
window.onclick = function (event) {
    if (event.target == editUsuarioModal) {
        editUsuarioModal.style.display = "none";
    }
};