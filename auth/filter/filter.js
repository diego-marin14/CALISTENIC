document.addEventListener("DOMContentLoaded", function() {
    const documentoInput = document.getElementById("documento");
    const fechaInput = document.getElementById("fecha");
    const ingresarButton = document.querySelector(".button-eliminar");

    ingresarButton.addEventListener("click", function() {
        const documento = documentoInput.value;
        const fecha = fechaInput.value;

        if (documento) {
            fetchAsistencias('documento', documento);
        } else if (fecha) {
            fetchAsistencias('fecha', fecha);
        } else {
            showToast("Por favor, ingrese un documento o una fecha.", "error");
        }
    });

    function fetchAsistencias(type, value) {
        const url = type === 'documento' 
            ? `http://localhost:8080/api/asistencia/findAsistenciaByDocument?identificacion=${value}`
            : `http://localhost:8080/api/asistencia/findAsistenciaByFecha?fechaLlegada=${value}`;

        fetch(url)
            .then(response => {
                if (response.status === 204) {
                    showToast(`No se encontraron asistencias para la ${type === 'documento' ? 'documento' : 'fecha'} ingresada.`, "info");
                    displayAsistencias([]);
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
                console.error(`Error al obtener asistencias por ${type}:`, error);
                showToast(`Error al obtener asistencias por ${type}.`, "error");
            });
    }

    function showToast(message, type) {
        Toastify({
            text: message,
            position: "top-center",
            className: type === "error" ? "error" : "info",
            duration: 4000,
            style: {
                background: type === "error" ? "#dc3545" : "#17a2b8",
            },
        }).showToast();
    }

    function displayAsistencias(asistencias) {
        const tablaAsistencias = document.getElementById("tabla-asistencias").querySelector("tbody");
        tablaAsistencias.innerHTML = "";

        asistencias.forEach(asistencia => {
            const row = document.createElement("tr");

            const fields = [
                { text: asistencia.nombreUsuario },
                { text: new Date(asistencia.fechaInicio).toLocaleDateString() },
                { text: new Date(asistencia.fechaFin).toLocaleDateString() },
                { text: asistencia.nombreSuscripcion },
                { text: new Date(asistencia.llegada).toLocaleDateString() },
                { text: "Ver Usuario" }
            ];

            fields.forEach(field => {
                const cell = document.createElement("td");
                cell.textContent = field.text;
                row.appendChild(cell);
            });

            tablaAsistencias.appendChild(row);
        });
    }
});
