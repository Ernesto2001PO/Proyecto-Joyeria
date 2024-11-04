require('dotenv').config();


const express = require('express');
const app = express();
const PORT = 3000;


 

// Middleware
app.use(express.static('public/html'));

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
