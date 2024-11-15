document.getElementById('registroForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombre_usuario = document.getElementById('nombre_usuario').value;
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;

    const response = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre_usuario, correo, contrasena })
    });

    if (response.ok) {
        const data = await response.json();
        alert('Usuario registrado exitosamente');
        window.location.href = '../html/login.html';
    } else {
        const errorData = await response.json();
        alert('Error al registrar el usuario: ' + errorData.error);
    }
});



function validacionNombreUsuario(){
    var nombre_usuario = document.getElementById('nombre_usuario').value;

     




    if(nombre_usuario.length < 5){
        alert('El nombre de usuario debe tener al menos 5 caracteres');
        return false;
    }
    return true;

}