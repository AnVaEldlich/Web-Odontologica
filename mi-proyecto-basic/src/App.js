const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db'); // Importa el pool de conexión

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, JS) desde /public
app.use(express.static(path.join(__dirname, '../Public')));

// Obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Insertar un nuevo usuario
app.post('/submit', async (req, res) => {
  try {
    const { username, apellidos, tipoID, numeroID, mes, dia, año, genero, edad, telefono, email, password } = req.body;

    const sql = `
      INSERT INTO users (username, apellidos, tipoID, numeroID, mes, dia, año, genero, edad, telefono, email, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [username, apellidos, tipoID, numeroID, mes, dia, año, genero, edad, telefono, email, password];

    await db.query(sql, values);

    res.json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
