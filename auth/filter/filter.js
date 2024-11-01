document.addEventListener("DOMContentLoaded", function() {
    const documentoInput = document.getElementById("documento");
    const fechaInput = document.getElementById("fecha");
    const ingresarButton = document.querySelector(".button-eliminar");

    ingresarButton.addEventListener("click", function() {
        const documento = documentoInput.value;
        const fecha = fechaInput.value;

        if (documento) {
            fetchAsistenciasByDocumento(documento);
        } else if (fecha) {
            fetchAsistenciasByFecha(fecha);
        } else {
            Toastify({
                text: "Por favor, ingrese un documento o una fecha.",
                position: "top-center",
                className: "info",
                duration: 4000,

                style: {
                  background: "#dc3545",
                },
              }).showToast();

            
        }
    });

    function fetchAsistenciasByDocumento(documento) {
        var mensajeError = document.getElementById('mensaje-error');
        fetch(`http://localhost:8080/api/asistencia/findAsistenciaByDocument?identificacion=${documento}`)
            .then(response => {
                if (response.status === 204) {

                    Toastify({
                        text: 'No se encontraron asistencias para el documento ingresado.',
                        className: "info",
                        duration: 4000,
                        position: "top-center",
                        style: {
                          background: "#dc3545",
                        },
                      }).showToast();

                    var data = []
                    displayAsistencias(data);
                    return [];
                    

                }
                return response.json();
            })
            .then(data => {
                if (data.length > 0) {
                    displayAsistencias(data);
                }
            })
            .catch(error => {
                console.error('Error al obtener asistencias por documento:', error);
                mostrarMensajeError('Error al obtener asistencias por documento.');
            });
    }

    function fetchAsistenciasByFecha(fecha) {
        var mensajeError = document.getElementById('mensaje-error');
        fetch(`http://localhost:8080/api/asistencia/findAsistenciaByFecha?fechaLlegada=${fecha}`)
            .then(response => {
                if (response.status === 204) {

                    Toastify({
                        text: 'No se encontraron asistencias para la fecha ingresada.',
                        className: "info",
                        position: "top-center",
                        duration: 4000,
                        style: {
                          background: "#dc3545",
                        },
                      }).showToast();

                    var data = []
                    displayAsistencias(data);
                    return [];
                }
                return response.json();
            })
            .then(data => {
                if (data.length > 0) {
                    displayAsistencias(data);
                }
            })
            .catch(error => {
                console.error('Error al obtener asistencias por fecha:', error);
                mostrarMensajeError('Error al obtener asistencias por fecha.');
            });
    }

    function displayAsistencias(asistencias) {
        const tablaAsistencias = document.getElementById("tabla-asistencias").querySelector("tbody");
        tablaAsistencias.innerHTML = "";

        asistencias.forEach(asistencia => {
            const row = document.createElement("tr");

            const nombreCell = document.createElement("td");
            nombreCell.textContent = asistencia.nombreUsuario;
            row.appendChild(nombreCell);

            const inicioCell = document.createElement("td");
            inicioCell.textContent = new Date(asistencia.fechaInicio).toLocaleDateString();
            row.appendChild(inicioCell);

            const finCell = document.createElement("td");
            finCell.textContent = new Date(asistencia.fechaFin).toLocaleDateString();
            row.appendChild(finCell);

            const suscripcionCell = document.createElement("td");
            suscripcionCell.textContent = asistencia.nombreSuscripcion;
            row.appendChild(suscripcionCell);

            const llegadaCell = document.createElement("td");
            llegadaCell.textContent = new Date(asistencia.llegada).toLocaleDateString();
            row.appendChild(llegadaCell);

            const accionesCell = document.createElement("td");
            accionesCell.textContent = "Ver Usuario"; // Aquí puedes agregar botones o enlaces para acciones
            row.appendChild(accionesCell);

            tablaAsistencias.appendChild(row);
        });
    }
});
