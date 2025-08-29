// Importamos expres y bcrypt
const express = require('express');
const app = express();
const path = require('path');
/*
const { pool, closePool } = require('./db');
*/

// Definimos el puerto (puede venir de una variable de entorno o usar 3000 por defecto)
const PORT = process.env.PORT || 3000;

// Middleware para leer JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Public')));

// Ruta de prueba
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
