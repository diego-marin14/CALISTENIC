function randombg() {
    var random = Math.floor(Math.random() * 3) + 0;
    var bigSize = [
        "url('assets/rhlm_fondo.jpg')", 
        "url('assets/emma.jpg')",
        "url('assets/real_hasta_la_muerte.jpg')"
    ];
    document.getElementById("right").style.backgroundImage = bigSize[random];
  }

  
  function login() {
    const usuario = document.getElementById('usuario').value;
    const contra = document.getElementById('contra').value;

    const data = {
        usuario: usuario,
        contra: contra
    };

    fetch('http://localhost:8080/api/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error de autenticación');
        }
        return response.text();
    })
    .then(token => {
        localStorage.setItem('token', token);
        window.location.href = 'http://localhost:5500/auth/dashboard.html';
    })
    .catch(error => {
        console.error('Error de autenticación:', error);
        // Mostrar mensaje de error en el formulario
        document.getElementById('error-message').textContent = 'Error de autenticación: Usuario o contraseña incorrectos';
    });
}


