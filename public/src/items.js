document.addEventListener('DOMContentLoaded', () => {
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
                            <form>
                                <label for="cantidad">Cantidad:</label>
                                <input type="number" id="cantidad" name="cantidad" min="1" value="1">
                                <button type="submit">Agregar al carrito</button>
                            </form>
                        </div>
                    </div>
                `;
                detallesContainer.innerHTML = productoHTML;
            })
            .catch(error => {
                console.error('Error al cargar el producto:', error);
            });
    } else {
        console.error('No se proporcionó un id de producto en la URL');
    }
});

