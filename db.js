const express = require('express');
const connect = require('./db');

const app = express();
const PORT = 3000;

app.get('/', async (req, res) => {
  try {
    const conn = await connect();
    const result = await conn.execute(`SELECT * FROM PACIENTES`); // Asegúrate de que esa tabla exista
    await conn.close(); // Cierra la conexión

    res.json(result.rows);
  } catch (error) {
    res.status(500).send("Error al consultar la base de datos");
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
