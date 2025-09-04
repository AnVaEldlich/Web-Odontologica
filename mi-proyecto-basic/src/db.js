// db.js
// db.js


const mysql = require('mysql2/promise');

// Crear un pool de conexiones
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '3080',
  database: 'odontologia_db'
});

module.exports = pool;





// const mysql = require('mysql2/promise');

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '3080',
//     database: 'odontologia_db'
// });

// async function testConnection() {
//     try {
//         // Opción 1: Insertar un nuevo registro (descomenta para probar)
//         console.log('Insertando un nuevo registro...');
//         const [insertResult] = await (await connection).execute(
//             // Asegúrate de que los nombres de las columnas coincidan con tu tabla en Workbench
//             'INSERT INTO usuarios (nombre, email, edad, fecha_registro) VALUES (?, ?, ?, ?)',
//             ['Pedro Gómez', 'pedro.gomez@example.com', 30, '2024-05-15']
//         );
//         console.log('Registro insertado con ID:', insertResult.insertId);
//         // Opción 2: Leer todos los registros de la tabla
//         const [rows] = await (await connection).execute('SELECT * FROM usuarios');

//         console.log('Consulta exitosa. Datos de la tabla "usuarios":');
        
//         // Imprime el array de objetos, mostrando todas las filas y columnas
//         if (rows.length > 0) {
//             console.log(rows);
//         } else {
//             console.log('La tabla está vacía. Inserta un registro y vuelve a intentarlo.');
//         }

//     } catch (error) {
//         console.error('Error al ejecutar la consulta:', error);
//     } finally {
//         (await connection).end();
//     }
// }

// testConnection();
