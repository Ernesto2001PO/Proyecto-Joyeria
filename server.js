const express = require('express');
const app = express();
const db = require('./public/src/conectar');
const PORT = process.env.PORT || 3000;

// Middlewares 
app.use(express.json());


// Middleware para permitir archivos estáticos
app.use(express.static('public'));



//===========RUTAS===================
// localhost:3000/api/productos
app.get('/api/productos', async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM producto');
        res.json(resultado.rows);
    } catch (err) {
        console.error('Error al consultar la base de datos:', err);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
});

// localhost:3000/api/usuarios
app.get('/api/usuarios', async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM categoria');
        res.json(resultado.rows);

    } catch (err) {
        console.error('Error al consultar la base de datos:', err);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
});


app.get('/api/categorias', async (req, res) => {
    try {
        const resultado = await db.query(
            'SELECT id, name, descripcion, categoria_padre_id FROM categoria'
        );

        // Crear un diccionario para las categorías principales
        const categorias = {};

        // Primero, inicializamos todas las categorías principales con un array de subcategorías vacío
        resultado.rows.forEach(categoria => {
            if (!categoria.categoria_padre_id) {
                // Es una categoría principal, la agregamos al diccionario
                categorias[categoria.id] = {
                    id: categoria.id,
                    name: categoria.name,
                    descripcion: categoria.descripcion,
                    subcategorias: []
                };
            }
        });

        // Luego, iteramos nuevamente para asignar las subcategorías a su categoría principal
        resultado.rows.forEach(categoria => {
            if (categoria.categoria_padre_id) {
                // Es una subcategoría, agregamos a la categoría principal correspondiente
                const categoriaPadre = categorias[categoria.categoria_padre_id];
                if (categoriaPadre) {
                    categoriaPadre.subcategorias.push({
                        id: categoria.id,
                        name: categoria.name,
                        descripcion: categoria.descripcion
                    });
                }
            }
        });
        // Convertir el diccionario en un array para la respuesta final
        const categoriasArray = Object.values(categorias);

        res.json(categoriasArray);
    } catch (err) {
        console.error('Error al obtener categorías:', err);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
});


// localhost:3000/api/carrito/:id
app.get('/api/item_carrito/:id', async (req, res) => {
    try {
        const  id  = parseInt(req.params.id,10);
        const resultado = await db.query('SELECT * FROM itemcarrito WHERE id = $1', [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Item no encontrado' });
        }

        res.json(resultado.rows[0]);

    } catch (err) {
        console.error('Error al obtener item del carrito:', err);
        res.status(500).json({ error: 'Error al obtener item del carrito' });
    }


});





















// POST localhost:3000/api/usuarios
app.post('/api/usuarios', async (req, res) => {
    try {
        const { nombre_usuario, correo, contrasena } = req.body;
        const resultado = await db.query(
            'INSERT INTO usuario (nombre_usuario,correo,contrasena,rol,creado_en) VALUES ($1,$2,$3,$4,NOW()) RETURNING *',
            [nombre_usuario, correo, contrasena, 'cliente']
        );
        res.status(201).json({ mensaje: 'Usuario creado', usuario: resultado.rows[0] });
    } catch (err) {
        console.error('Error al insertar en la base de datos:', err);
        res.status(500).json({ error: 'Error al insertar en la base de datos' });
    }
});



app.post('/api/productos', async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, categoria_id } = req.body;
        const resultado = await db.query(
            'INSERT INTO producto (nombre,descripcion,precio,stock,categoria_id,creado_en) VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING *',
            [nombre, descripcion, precio, stock, categoria_id]
        );
        res.status(201).json({ mensaje: 'Producto creado', producto: resultado.rows[0] });
    } catch (err) {
        console.error('Error al insertar en la base de datos:', err);
        res.status(500).json({ error: 'Error al insertar en la base de datos' });
    }
});


app.post('/api/carrito', async (req, res) => {
    try {
        const { usuario_id, producto_id, cantidad } = req.body;

        // Primero, verifica si el carrito ya existe para el usuario
        let carrito = await db.query('SELECT id FROM carrito WHERE usuario_id = $1', [usuario_id]);

        if (carrito.rows.length === 0) {
            // Si no existe, crea un nuevo carrito para el usuario
            const nuevoCarrito = await db.query(
                'INSERT INTO carrito (usuario_id, creado_en) VALUES ($1, NOW()) RETURNING *',
                [usuario_id]
            );
            carrito = nuevoCarrito;
        }

        const carrito_id = carrito.rows[0].id;

        // Inserta el producto en el carrito
        const resultado = await db.query(
            'INSERT INTO itemcarrito (carrito_id, producto_id, cantidad, agregado_en) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [carrito_id, producto_id, cantidad]
        );

        res.status(201).json({
            mensaje: 'Producto agregado al carrito',
            item: resultado.rows[0]
        });
    } catch (err) {
        console.error('Error al agregar producto al carrito:', err);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});


app.post('/api/carrito-anonimo', async (req, res) => {
    try {
        const { session_id, producto_id, cantidad } = req.body;

        if (!session_id) {
            return res.status(400).json({ error: 'session_id es requerido para carritos anónimos.' });
        }

        // Busca el carrito anónimo asociado a este `session_id`
        let carrito = await db.query('SELECT id FROM carrito WHERE usuario_id IS NULL AND session_id = $1', [session_id]);

        if (carrito.rows.length === 0) {
            // Si no existe un carrito anónimo para este `session_id`, crea uno nuevo
            const nuevoCarrito = await db.query(
                'INSERT INTO carrito (usuario_id, session_id, creado_en) VALUES (NULL, $1, NOW()) RETURNING *',
                [session_id]
            );
            carrito = nuevoCarrito;
        }

        const carrito_id = carrito.rows[0].id;

        // Inserta el producto en el carrito anónimo
        const resultado = await db.query(
            'INSERT INTO itemcarrito (carrito_id, producto_id, cantidad, agregado_en) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [carrito_id, producto_id, cantidad]
        );

        res.status(201).json({
            mensaje: 'Producto agregado al carrito anónimo',
            item: resultado.rows[0]
        });
    } catch (err) {
        console.error('Error al agregar producto al carrito anónimo:', err);
        res.status(500).json({ error: 'Error al agregar producto al carrito anónimo' });
    }
});







// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
