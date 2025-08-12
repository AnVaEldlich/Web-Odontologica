const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'odontologia_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para conectar a la base de datos
async function connect() {
  try {
    const connection = await pool.getConnection();
    console.log('Conectado a la base de datos MySQL');
    return connection;
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
    throw error;
  }
}

// Función para cerrar el pool de conexiones
async function closePool() {
  try {
    await pool.end();
    console.log('Pool de conexiones cerrado');
  } catch (error) {
    console.error('Error cerrando el pool:', error);
  }
}

// Función para crear las tablas necesarias
async function initializeDatabase() {
  try {
    const connection = await connect();
    
    // Crear tabla de pacientes si no existe
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS PACIENTES (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        telefono VARCHAR(20),
        fecha_nacimiento DATE,
        direccion TEXT,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Crear tabla de citas si no existe
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS CITAS (
        id INT AUTO_INCREMENT PRIMARY KEY,
        paciente_id INT,
        fecha_cita DATETIME NOT NULL,
        tratamiento VARCHAR(200),
        estado ENUM('pendiente', 'confirmada', 'completada', 'cancelada') DEFAULT 'pendiente',
        notas TEXT,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (paciente_id) REFERENCES PACIENTES(id)
      )
    `);
    
    // Crear tabla de usuarios (para login)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS USUARIOS (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        rol ENUM('admin', 'doctor', 'recepcionista') DEFAULT 'recepcionista',
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    connection.release();
    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
  }
}

module.exports = {
  connect,
  closePool,
  initializeDatabase,
  pool
};
