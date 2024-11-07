const BASE_URL = 'http://localhost:8080/api/usuario';

// Función para mostrar alertas con Toastify
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

// Función para obtener todos los usuarios y mostrar la información del primer usuario
function getAllUsuarios() {
    fetch(`${BASE_URL}/getAll`)
        .then(response => {
            if (!response.ok) {
                showAlert("No se pudo obtener la lista de usuarios.");
                throw new Error('No se pudo obtener la lista de usuarios');
            }
            return response.json();
        })
        .then(usuarios => {
            const usuarioId13 = usuarios.find(usuario => usuario.id === 13);
            if (usuarioId13) {
                displayUserInfo(usuarioId13);
            } else {
                console.error('No se encontró el usuario con ID 13');
                showAlert("No se encontró el usuario con ID 13.");
            }
        })
        .catch(error => {
            showAlert("Error al obtener la lista de usuarios.");
            console.error('Error al obtener la lista de usuarios:', error);
        });
}

// Función para mostrar la información del usuario en la tarjeta
function displayUserInfo(usuario) {
    document.getElementById('porcentajeGrasoLabel').innerHTML = `<span style="color: red;">Porcentaje Graso:</span> ${usuario.porcentajeGraso}`;
    document.getElementById('objetivoLabel').innerHTML = `<span style="color: red;">Objetivo:</span> ${usuario.objetivo}`;
    document.getElementById('pesoLabel').innerHTML = `<span style="color: red;">Peso:</span> ${usuario.peso}`;
    document.getElementById('estaturaLabel').innerHTML = `<span style="color: red;">Estatura:</span> ${usuario.estatura}`;
    document.getElementById('tipoCuerpoLabel').innerHTML = `<span style="color: red;">Tipo de Cuerpo:</span> ${usuario.tipoCuerpo}`;
}

// Llamar a la función getAllUsuarios para obtener y mostrar la información del primer usuario
getAllUsuarios();

// Función para cargar los datos del usuario en el formulario de edición
function cargarDatosUsuarioParaEditar(id) {
    fetch(`${BASE_URL}/findById/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener el usuario');
            }
            return response.json();
        })
        .then(usuario => {
            document.getElementById('editPorcentajeGraso').value = usuario.porcentajeGraso;
            document.getElementById('editObjetivo').value = usuario.objetivo;
            document.getElementById('editPeso').value = usuario.peso;
            document.getElementById('editEstatura').value = usuario.estatura;
            document.getElementById('editTipoCuerpo').value = usuario.tipoCuerpo;
            document.getElementById('editIdPersona').value = usuario.idPersona;
            document.getElementById('editIdSuscripcion').value = usuario.idSuscripcion;
            document.getElementById('editUsuarioId').value = id;
        })
        .catch(error => {
            showAlert("Error al obtener el usuario para editar.");
            console.error('Error al obtener el usuario para editar:', error);
        });
}

// Función para guardar los cambios del usuario
function guardarCambiosUsuario(event) {
    event.preventDefault();

    const data = {
        id: document.getElementById('editUsuarioId').value,
        idPersona: document.getElementById('editIdPersona').value,
        idSuscripcion: document.getElementById('editIdSuscripcion').value,
        porcentajeGraso: document.getElementById('editPorcentajeGraso').value,
        objetivo: document.getElementById('editObjetivo').value,
        peso: document.getElementById('editPeso').value,
        estatura: document.getElementById('editEstatura').value,
        tipoCuerpo: document.getElementById('editTipoCuerpo').value
    };

    fetch(`${BASE_URL}/update/${data.id}`, {
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
            getAllUsuarios();
            closeModal();
        })
        .catch(error => {
            showAlert("Error al guardar los cambios en el usuario.");
            console.error('Error al guardar los cambios en el usuario:', error);
        });
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('editUsuarioModal');
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
    modalBackdrop.parentNode.removeChild(modalBackdrop);
}

// Evento para abrir el modal de edición y cargar los datos del usuario
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit')) {
        const id = event.target.dataset.id;
        cargarDatosUsuarioParaEditar(id);
        const modal = document.getElementById('editUsuarioModal');
        modal.classList.add('show');
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
        const modalBackdrop = document.createElement('div');
        modalBackdrop.classList.add('modal-backdrop', 'fade', 'show');
        document.body.appendChild(modalBackdrop);
    }
});

// Agregar el evento submit al formulario de edición
document.getElementById('editUsuarioForm').addEventListener('submit', guardarCambiosUsuario);
