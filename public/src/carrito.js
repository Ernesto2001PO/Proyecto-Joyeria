// Función para generar un identificador único
function generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9);
}

// Obtener o crear el session_id
let session_id = localStorage.getItem('session_id');
if (!session_id) {
    session_id = generateSessionId();
    localStorage.setItem('session_id', session_id);
    console.log('Se ha creado un nuevo session_id:', session_id);
} else {
    console.log('Se ha recuperado el session_id existente:', session_id);
}

// Usar session_id para agregar productos al carrito
function addToCart(producto_id, cantidad) {
    fetch('http://localhost:3000/api/carrito-anonimo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ session_id, producto_id, cantidad })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Producto agregado al carrito anónimo:', data);
    })
    .catch(error => {
        console.error('Error al agregar al carrito:', error);
    });
}
