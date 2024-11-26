function login(correo, contrasena) {
    const msgErrorCorreo = document.getElementById('msg-error-email');

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
            localStorage.setItem('usuario_rol', data.usuario.rol);
            console.log('Usuario autenticado:', data.usuario);

            const session_id = localStorage.getItem('session_id');
            if (session_id) {
                fetch('http://localhost:3000/api/transferir-carrito', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ session_id, usuario_id: data.usuario.id })
                })
                .then(response => response.json())
                .then(transferData => {
                    if (transferData.error) {
                        console.error('Error al transferir el carrito:', transferData.error);
                    } else {
                        console.log('Carrito transferido exitosamente');
                        localStorage.removeItem('session_id'); 
                    }

                    if (data.usuario.rol == "admin") {
                        window.location.href = './admin.html';
                    } else {
                        window.location.href = './joyeria.html';
                    }
                })
                .catch(error => {
                    console.error('Error al transferir el carrito:', error);
                });
            } else {
                if (data.usuario.rol == "admin") {
                    window.location.href = './admin.html';
                } else {
                    window.location.href = './joyeria.html';
                }
            }
        } else {
            console.error('Error al iniciar sesión:', data.error);
            msgErrorCorreo.innerHTML = "Credenciales no válidas";
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