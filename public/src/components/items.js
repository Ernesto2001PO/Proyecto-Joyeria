document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('items.html')) {
        const params = new URLSearchParams(window.location.search);
        const productoId = params.get('id');

        if (productoId) {
            fetch(`http://localhost:3000/api/productos/${productoId}`)
                .then(response => response.json())
                .then(producto => {
                    const detallesContainer = document.querySelector('.detalles-producto');
                    const productoHTML = `
                        <h1>${producto.nombre}</h1>
                        <div class="producto-detalle">
                            <div class="image-container-items">
                                <img src="/${producto.url_imagen}" alt="${producto.nombre}">
                            </div>
                            <div class="producto-info">
                                <h2>Precio: ${producto.precio} Bs</h2>
                                <p>Descripción: ${producto.descripcion}</p>
                                <form id="form-agregar-carrito">
                                    <label for="cantidad">Cantidad:</label>
                                    <input type="number" id="cantidad" name="cantidad" min="1" value="1">
                                    <button type="submit">Agregar al carrito</button>
                                </form>
                            </div>
                        </div>
                    `;
                    detallesContainer.innerHTML = productoHTML;

                    const form = document.getElementById('form-agregar-carrito');
                    form.onsubmit = event => {
                        event.preventDefault();
                        const cantidad = parseInt(document.getElementById('cantidad').value);
                        agregaralCarrito(productoId, cantidad);  
                    };
                })
                .catch(error => {
                    console.error('Error al cargar el producto:', error);
                });
        } else {
            console.error('No se proporcionó un id de producto en la URL');
        }
    }
});

function agregaralcarritoAnonimo(producto_id, cantidad) {
    const session_id = localStorage.getItem('session_id'); 
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

function agregaralcarritoAutenticado(producto_id, cantidad) {
    const usuario_id = localStorage.getItem('usuario_id');

    if (!usuario_id) {
        console.error('No hay usuario autenticado. No se puede agregar al carrito.');
        return;
    }

    fetch('http://localhost:3000/api/carrito', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario_id, producto_id, cantidad })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Producto agregado al carrito:', data);
    })
    .catch(error => {
        console.error('Error al agregar al carrito:', error);
    });
}

function agregaralCarrito(producto_id, cantidad) {
    const usuario_id = localStorage.getItem('usuario_id');
    
    if (usuario_id) {
        agregaralcarritoAutenticado(producto_id, cantidad);
    } else {
        agregaralcarritoAnonimo(producto_id, cantidad);
    }
}

