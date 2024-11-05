const express = require('express');
const app = express();
const db=require('./public/src/conectar');
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));



// Endpoint para obtener productos
app.get('/api/productos', async (req, res) => {
    try {
        // Consulta de la base de datos
        const result = await db.query('SELECT * FROM producto');
        res.json(result.rows);  // Devuelve los resultados en JSON
    } catch (err) {
        console.error('Error al consultar la base de datos:', err);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
});




// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
