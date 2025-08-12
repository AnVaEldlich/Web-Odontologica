const express = require('express');
const { connect, initializeDatabase } = require('./db');
const session = require('express-session');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'odontologia-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Cambiar a true en producción con HTTPS
}));

// Servir archivos estáticos desde la carpeta "Public"
app.use(express.static(path.join(__dirname, 'Public')));

// Habilitar recibir formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ruta raíz que sirve tu index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

// Ruta para obtener pacientes (API)
app.get('/api/pacientes', async (req, res) => {
  try {
    const connection = await connect();
    const [rows] = await connection.execute('SELECT * FROM PACIENTES');
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar pacientes' });
    console.error(error);
  }
});

// Ruta para crear una cita
app.post('/api/citas', async (req, res) => {
  const { nombre, apellido, email, telefono, fecha_cita, tratamiento } = req.body;
  
  try {
    const connection = await connect();
    
    // Primero insertar o encontrar el paciente
    let [pacientes] = await connection.execute(
      'SELECT id FROM PACIENTES WHERE email = ?',
      [email]
    );
    
    let pacienteId;
    if (pacientes.length === 0) {
      // Crear nuevo paciente
      const [result] = await connection.execute(
        'INSERT INTO PACIENTES (nombre, apellido, email, telefono) VALUES (?, ?, ?, ?)',
        [nombre, apellido, email, telefono]
      );
      pacienteId = result.insertId;
    } else {
      pacienteId = pacientes[0].id;
    }
    
    // Crear la cita
    await connection.execute(
      'INSERT INTO CITAS (paciente_id, fecha_cita, tratamiento) VALUES (?, ?, ?)',
      [pacienteId, fecha_cita, tratamiento]
    );
    
    connection.release();
    res.json({ success: true, message: 'Cita creada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la cita' });
    console.error(error);
  }
});

// Inicializar la base de datos y luego iniciar el servidor
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error iniciando el servidor:', error);
  }
}

startServer();
