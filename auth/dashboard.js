

async function validarDocumento() {
    var documento = document.getElementById('documento').value;
    var mensajeError = document.getElementById('mensaje-error');
    mensajeError.style.visibility = 'visible';
    mensajeError.style.fontSize = '27px';
    mensajeError.innerText = '';
    

    if (!documento || isNaN(documento)) {

        Toastify({
            text: 'Recuerda ingresar solamente tu documento.',
            className: "info",
            duration: 4000,
            position: "top-center",
            style: {
              background: "#dc3545",
            },
          }).showToast();
        return;
    }

    try {
        let response = await fetch('http://localhost:8080/api/asistencia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ identificacion: documento })
        });

        if (response.ok) {
            // await cargarAsistencias();
            let result = await response.json();
            let diasRestantes = result.diasRestantes;

            Toastify({
                text: `Sigue, te quedan ${diasRestantes} días para seguir entrenando. 💪🏼🏋🏽`,
                className: "info",
                duration: 4000,
                position: "top-center",
                style: {
                  background: "#5560BF",
                },
              }).showToast();

            await cargarAsistencias();

        }
         
        else {
            let result = await response.json();
            Toastify({
                text: result.message || 'Error al procesar la solicitud. Por favor, inténtelo de nuevo.',
                className: "info",
                duration: 4000,
                position: "top-center",
                style: {
                  background: "#dc3545",
                },
              }).showToast();
        }
    } catch (error) {

        Toastify({
            text: 'Error en la conexión con el servidor. Por favor, inténtelo de nuevo.',
            className: "info",
            position: "top-center",
            duration: 4000,
            style: {
              background: "#dc3545",
            },
          }).showToast();
    }

}


async function cargarAsistencias() {
    try {
        let response = await fetch('http://localhost:8080/api/asistencia/getAllAsistencia');
        if (response.ok) {
            let asistencias = await response.json();
            mostrarAsistencias(asistencias);
        } else {
            console.error('Error al obtener las asistencias:', response.status);
        }
    } catch (error) {
        console.error('Error en la conexión con el servidor:', error);
    }
}

function mostrarAsistencias(asistencias) {
    var tablaBody = document.querySelector('#tabla-asistencias tbody');
    tablaBody.innerHTML = '';

    asistencias.forEach(asistencia => {
        var row = document.createElement('tr');
        row.innerHTML = `
            <td>${asistencia.nombreUsuario}</td>
            <td>${new Date(asistencia.fechaInicio).toLocaleDateString()}</td>
            <td>${new Date(asistencia.fechaFin).toLocaleDateString()}</td>
            <td>${asistencia.nombreSuscripcion}</td>
            <td>
                <button role="button" class="button-eliminar" onclick="eliminarAsistencia(${asistencia.id})">Eliminar</button>
            </td>
        `;
        // Insertar la nueva asistencia en la primera posición
        tablaBody.insertBefore(row, tablaBody.firstChild);
    });
}


async function eliminarAsistencia(idAsistencia) {
    try {
        let response = await fetch(`http://localhost:8080/api/asistencia/${idAsistencia}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            await cargarAsistencias(); // Actualizamos la tabla después de eliminar
        } else {
            console.error('Error al eliminar la asistencia:', response.status);
        }
    } catch (error) {
        console.error('Error en la conexión con el servidor:', error);
    }
}

// Cargar las asistencias al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
    await cargarAsistencias();
});
