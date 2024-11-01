const BASE_URL = 'http://localhost:8080/api/usuario';

// Función para obtener todos los usuarios y mostrar la información del primer usuario
function getAllUsuarios() {
    fetch(`${BASE_URL}/getAll`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener la lista de usuarios');
            }
            return response.json();
        })
        .then(usuarios => {
            // Buscar el usuario con ID 13
            const usuarioId13 = usuarios.find(usuario => usuario.id === 13);
            if (usuarioId13) {
                // Si se encontró el usuario con ID 13, mostrar su información
                displayUserInfo(usuarioId13);
            } else {
                console.error('No se encontró el usuario con ID 13');
            }
        })
        .catch(error => {
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

function cargarDatosUsuarioParaEditar(id) {
    // Obtener los datos del usuario desde tu servidor (por ejemplo, mediante una solicitud GET)
    fetch(`${BASE_URL}/findById/13`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener el usuario');
            }
            return response.json();
        })
        .then(usuario => {
            // Llenar el formulario con los datos del usuario
            document.getElementById('editPorcentajeGraso').value = usuario.porcentajeGraso;
            document.getElementById('editObjetivo').value = usuario.objetivo;
            document.getElementById('editPeso').value = usuario.peso;
            document.getElementById('editEstatura').value = usuario.estatura;
            document.getElementById('editTipoCuerpo').value = usuario.tipoCuerpo;
            document.getElementById('editIdPersona').value = usuario.idPersona;
            document.getElementById('editIdSuscripcion').value = usuario.idSuscripcion;
            document.getElementById('editUsuarioId').value = id; // Establecer el id del usuario en un campo oculto
        })
        .catch(error => {
            console.error('Error al obtener el usuario para editar:', error);
        });
}

function guardarCambiosUsuario(event) {
    event.preventDefault();

    const porcentajeGraso = document.getElementById('editPorcentajeGraso').value;
    const objetivo = document.getElementById('editObjetivo').value;
    const peso = document.getElementById('editPeso').value;
    const estatura = document.getElementById('editEstatura').value;
    const tipoCuerpo = document.getElementById('editTipoCuerpo').value;
    const id = document.getElementById('editUsuarioId').value;
    const idPersona = document.getElementById('editIdPersona').value;
    const idSuscripcion = document.getElementById('editIdSuscripcion').value;

    const data = {
        id: id,
        idPersona: idPersona,
        idSuscripcion: idSuscripcion,
        porcentajeGraso: porcentajeGraso,
        objetivo: objetivo,
        peso: peso,
        estatura: estatura,
        tipoCuerpo: tipoCuerpo
    };

    fetch(`${BASE_URL}/update/13`, { // Ajustamos la URL para la actualización del usuario
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
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
        modalBackdrop.parentNode.removeChild(modalBackdrop);
    })
    .catch(error => {
        console.error('Error al guardar los cambios en el usuario:', error);
    });
}


// Llamar a la función cargarDatosUsuarioParaEditar cuando se hace clic en el botón de editar en la tabla
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit')) {
        const id = event.target.dataset.id; // Obtener el ID del usuario desde el atributo data-id del botón
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

// Agregar el evento submit al formulario de edición
document.getElementById('editUsuarioForm').addEventListener('submit', guardarCambiosUsuario);
