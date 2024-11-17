document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('usuarios-link').addEventListener('click', cargarUsuarios);
    document.getElementById('productos-link').addEventListener('click', cargarProductos);
    cargarUsuarios(); 
});

function cargarUsuarios(event) {
    if (event) event.preventDefault();
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="content-header">Usuarios</div>
        <div class="content-body">
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="usuarios-table">
                </tbody>
            </table>
        </div>
    `;

    fetch('http://localhost:3000/api/usuarios')
        .then(response => response.json())
        .then(usuarios => {
            const usuariosTable = document.getElementById('usuarios-table');
            usuariosTable.innerHTML = '';

            usuarios.forEach(usuario => {
                const row = `
                    <tr>
                        <td>${usuario.nombre_usuario}</td>
                        <td>${usuario.correo}</td>
                        <td>
                            <button onclick="editarUsuario(${usuario.id})">Editar</button>
                            <button onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
                        </td>
                    </tr>
                `;
                usuariosTable.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error al cargar los usuarios:', error);
        });
}

function cargarProductos(event) {
    if (event) event.preventDefault();
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="content-header">Productos</div>
        <div class="content-body">
            <table>
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="productos-table">
                </tbody>
            </table>
        </div>
    `;

    fetch('http://localhost:3000/api/productos')
        .then(response => response.json())
        .then(productos => {
            const productosTable = document.getElementById('productos-table');
            productosTable.innerHTML = ''; 

            productos.forEach(producto => {
                const row = `
                    <tr>
                        <td><img src="/${producto.url_imagen}" alt="${producto.nombre}" style="width: 100px; height: auto;"></td>
                        <td>${producto.nombre}</td>
                        <td>${producto.descripcion}</td>
                        <td>${producto.precio}</td>
                        <td>${producto.stock}</td>
                        <td>
                            <button onclick="agregarProducto()">Agregar</button>
                            <button onclick="editarProducto(${producto.id})">Editar</button>
                            <button onclick="eliminarProducto(${producto.id})">Eliminar</button>

                        </td>
                    </tr>
                `;
                productosTable.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });
}

function agregarProducto() {
    
}

function editarUsuario(id) {
    const nombre_usuario = prompt('Ingrese el nuevo nombre de usuario:');
    const correo = prompt('Ingrese el nuevo correo:');

    if (nombre_usuario && correo) {
        fetch(`http://localhost:3000/api/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre_usuario, correo })
        })
        .then(response => response.json())
        .then(data => {
            alert('Usuario actualizado exitosamente');
            cargarUsuarios(); 
        })
        .catch(error => {
            console.error('Error al actualizar el usuario:', error);
        });
    }
}

function eliminarUsuario(id) {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
        fetch(`http://localhost:3000/api/usuarios/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Usuario eliminado exitosamente');
            cargarUsuarios(); 
        })
        .catch(error => {
            console.error('Error al eliminar el usuario:', error);
        });
    }
}



function agregarProducto() {
    const nombre = prompt('Ingrese el nombre del producto:');
    const descripcion = prompt('Ingrese la descripción:');
    const precio = prompt('Ingrese el precio:');
    const stock = prompt('Ingrese el stock:');

    if (nombre && descripcion && precio && stock) {
        fetch('http://localhost:3000/api/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, descripcion, precio, stock })
        })
        .then(response => response.json())
        .then(data => {
            alert('Producto agregado exitosamente');
            cargarProductos(); 
        })
        .catch(error => {
            console.error('Error al agregar el producto:', error);
        });
    }

}












function editarProducto(id) {
    const nombre = prompt('Ingrese el nuevo nombre del producto:');
    const descripcion = prompt('Ingrese la nueva descripción:');
    const precio = prompt('Ingrese el nuevo precio:');
    const stock = prompt('Ingrese el nuevo stock:');

    if (nombre && descripcion && precio && stock) {
        fetch(`http://localhost:3000/api/productos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, descripcion, precio, stock })
        })
        .then(response => response.json())
        .then(data => {
            alert('Producto actualizado exitosamente');
            cargarProductos(); 
        })
        .catch(error => {
            console.error('Error al actualizar el producto:', error);
        });
    }
}

function eliminarProducto(id) {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
        fetch(`http://localhost:3000/api/productos/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Producto eliminado exitosamente');
            cargarProductos(); 
        })
        .catch(error => {
            console.error('Error al eliminar el producto:', error);
        });
    }
}