// Capturar el login

function login(correo, contrasena) {
    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, contrasena })
    })
    .then(response => response.json())
    .then(data => {
        if (data.usuario) {
            localStorage.setItem('usuario_id', data.usuario.id);
            localStorage.setItem('usuario_nombre', data.usuario.nombre_usuario);
            console.log('Usuario autenticado:', data.usuario);
        } else {
            console.error('Error al iniciar sesión:', data.error);
        }
    })
    .catch(error => {
        console.error('Error en la solicitud de login:', error);
    });
}

function capturarLogin(event) {
    event.preventDefault(); 

    const correo = document.getElementById('user-email').value;
    const contrasena = document.getElementById('user-password').value;

    login(correo, contrasena);
}



