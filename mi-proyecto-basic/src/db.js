const mysql = require('mysql2/promise');

// Crear un pool de conexiones
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '3080',
  database: 'odontologia_db'
});

module.exports = pool;



