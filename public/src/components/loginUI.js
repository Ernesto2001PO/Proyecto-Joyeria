document.addEventListener('DOMContentLoaded', () => {
    const usuarioId = localStorage.getItem('usuario_id');
    const nombreUsuario = localStorage.getItem('nombre_usuario');
    if (usuarioId) {
        document.getElementById('nombre-usuario').textContent = `Hola, ${nombreUsuario}`;
    } else {
        window.location.href = 'login.html';
    }
} );