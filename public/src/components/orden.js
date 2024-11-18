document.getElementById('registrar-orden-btn').addEventListener('click', () => {
    const usuario_id = localStorage.getItem('usuario_id');
    if (usuario_id) {
        registrarOrden(usuario_id);
    } else {
        alert('Debe iniciar sesión para registrar una orden');
    }
});

function registrarOrden(usuario_id) {
    fetch('http://localhost:3000/api/orden', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario_id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error al registrar la orden: ' + data.error);
        } else {
            alert('Orden registrada exitosamente');
            const carritoContainer = document.getElementById('carrito-container');
            const carritoVacio = document.getElementById('carrito-vacio');
            carritoContainer.innerHTML = '';
            carritoVacio.style.display = 'block';
        
        }
    })
    .catch(error => {
        console.error('Error al registrar la orden:', error);
    });
}

function misOrdenes() {
    const usuario_id = localStorage.getItem('usuario_id');
    const ordenesContainer = document.getElementById('ordenes-container');
    ordenesContainer.innerHTML = ''; 
    if (usuario_id) {
        fetch(`http://localhost:3000/api/ordenes/${usuario_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Error al cargar las órdenes: ' + data.error);
            } else {
                console.log('Órdenes:', data);
                const ordenesMap = new Map();
                data.forEach(item => {
                    if (!ordenesMap.has(item.id)) {
                        ordenesMap.set(item.id, {
                            id: item.id,
                            total: item.total,
                            estado: item.estado,
                            creado_en: item.creado_en,
                            productos: []
                        });
                    }
                    ordenesMap.get(item.id).productos.push({
                        nombre: item.nombre,
                        cantidad: item.cantidad,
                        precio: item.precio
                    });
                });

                ordenesMap.forEach(orden => {
                    const ordenHTML = `
                        <div class="orden">
                            <h3>Orden ID: ${orden.id}</h3>
                            <p>Total: ${orden.total}</p>
                            <p>Estado: ${orden.estado}</p>
                            <p>Fecha: ${new Date(orden.creado_en).toLocaleString()}</p>
                            <h4>Productos:</h4>
                            <ul>
                                ${orden.productos.map(producto => `
                                    <li>${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: ${producto.precio}</li>
                                `).join('')}
                            </ul>
                        </div>
                    `;
                    ordenesContainer.innerHTML += ordenHTML;
                });
            }
        })
        .catch(error => {
            console.error('Error al cargar las órdenes:', error);
        });
    } else {
        alert('Debe iniciar sesión para ver sus órdenes');
    }
}


