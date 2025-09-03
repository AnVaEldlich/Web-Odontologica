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


// Login de usuario
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length > 0) {
      // Usuario encontrado
      const user = rows[0];
      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          apellidos: user.apellidos,
          email: user.email,
          telefono: user.telefono,
          genero: user.genero,
          edad: user.edad
        }
      });
    } else {
      res.json({ success: false, message: 'Credenciales inválidas' });
    }
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
