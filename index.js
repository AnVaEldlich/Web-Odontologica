const express = require('express');
const connect = require('./db');
const env = require('dotenv').config();


const path = require('path');

const app = express();
const PORT = 3000;

// Servir archivos estáticos desde la carpeta "Public"
app.use(express.static(path.join(__dirname, 'Public')));

// Habilitar recibir formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ruta raíz que sirve tu index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
