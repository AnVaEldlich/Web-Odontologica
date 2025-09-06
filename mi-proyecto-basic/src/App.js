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

// Obtener todos de pacientes
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Obtener datos de pedir citas
app.get('/api/appointments', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Solicitudes_de_citas');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// insertar citas
app.post('/api/appointments', async (req, res) => {
  try {
    const {
      nombre_completo,
      email,
      telefono,
      fecha_nacimiento,
      tratamiento_solicitado,
      fecha_cita,
      hora_cita,
      motivo_consulta,
      estado = 'pendiente',
      notas_adicionales
    } = req.body;
    
    const sql = `
      INSERT INTO Solicitudes_de_citas (
        nombre_completo, email, telefono, fecha_nacimiento,
        tratamiento_solicitado, fecha_cita, hora_cita, motivo_consulta, estado, notas_adicionales
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      nombre_completo,
      email,
      telefono,
      fecha_nacimiento,
      tratamiento_solicitado,
      fecha_cita,
      hora_cita,
      motivo_consulta,
      estado,
      notas_adicionales
    ];
    
    const [result] = await db.query(sql, values);
    
    res.json({ message: 'Cita solicitada con éxito', id: result.insertId });
  } catch (error) {
    console.error('Error inserting appointment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Obtener todos los odontólogos
app.get('/api/odontologos', async (req, res) => {
  try { 
    const [rows] = await db.query('SELECT * FROM userdoctores');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching odontólogos:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Insertar un nuevo usuario (registro general)
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

// Registrar un nuevo odontólogo
app.post('/register-dentist', async (req, res) => {
  try {
    const {
      nombre,
      identificacion,
      fechaNacimiento,
      email,
      telefono,
      direccion,
      registroProfesional,
      organismo,
      experiencia,
      especialidad, // Array de especialidades
      nit,
      razonSocial,
      regimen,
      direccionFacturacion,
      asociaciones,
      web,
      comoSeEntero
    } = req.body;

    // Convertir el array de especialidades a string
    const especialidadesStr = Array.isArray(especialidad) ? especialidad.join(', ') : '';

    const sql = `
      INSERT INTO userdoctores (
        nombre, identificacion, fecha_nacimiento, email, telefono, direccion_consultorio,
        registro_profesional, organismo_expedidor, anos_experiencia, especialidades,
        nit, razon_social, regimen_tributario, direccion_facturacion,
        asociaciones, pagina_web, como_se_entero
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      nombre,
      identificacion,
      fechaNacimiento || null,
      email,
      telefono,
      direccion,
      registroProfesional,
      organismo || null,
      experiencia || null,
      especialidadesStr,
      nit,
      razonSocial || null,
      regimen,
      direccionFacturacion || null,
      asociaciones || null,
      web || null,
      comoSeEntero || null
    ];

    const [result] = await db.query(sql, values);

    res.json({ 
      message: 'Odontólogo registrado con éxito',
      id: result.insertId
    });
  } catch (err) {
    console.error('Error al registrar odontólogo:', err);
    
    // Manejar errores específicos
    if (err.code === 'ER_DUP_ENTRY') {
      if (err.message.includes('email')) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
      if (err.message.includes('identificacion')) {
        return res.status(400).json({ error: 'La identificación ya está registrada' });
      }
      if (err.message.includes('registro_profesional')) {
        return res.status(400).json({ error: 'El número de registro profesional ya está registrado' });
      }
      if (err.message.includes('nit')) {
        return res.status(400).json({ error: 'El NIT ya está registrado' });
      }
    }
    
    res.status(500).json({ error: 'Error al registrar el odontólogo' });
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

// Login de odontólogo
app.post('/login-dentist', async (req, res) => {
  try {
    const { email, identificacion } = req.body;

    const [rows] = await db.query(
      'SELECT * FROM userdoctores WHERE email = ? AND identificacion = ?',
      [email, identificacion]
    );

    if (rows.length > 0) {
      // Odontólogo encontrado
      const doctor = rows[0];
      res.json({
        success: true,
        doctor: {
          id: doctor.id,
          nombre: doctor.nombre,
          email: doctor.email,
          telefono: doctor.telefono,
          especialidades: doctor.especialidades,
          registro_profesional: doctor.registro_profesional
        }
      });
    } else {
      res.json({ success: false, message: 'Credenciales inválidas' });
    }
  } catch (err) {
    console.error('Error en login de odontólogo:', err);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
});




// Validar si existe un email de odontólogo
app.get('/api/validate-email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const [rows] = await db.query('SELECT id FROM userdoctores WHERE email = ?', [email]);
    
    res.json({ exists: rows.length > 0 });
  } catch (err) {
    console.error('Error validating email:', err);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
});

// Validar si existe una identificación de odontólogo
app.get('/api/validate-identification/:identificacion', async (req, res) => {
  try {
    const { identificacion } = req.params;
    const [rows] = await db.query('SELECT id FROM userdoctores WHERE identificacion = ?', [identificacion]);
    
    res.json({ exists: rows.length > 0 });
  } catch (err) {
    console.error('Error validating identification:', err);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
});

// Validar si existe un registro profesional
app.get('/api/validate-professional-registration/:registro', async (req, res) => {
  try {
    const { registro } = req.params;
    const [rows] = await db.query('SELECT id FROM userdoctores WHERE registro_profesional = ?', [registro]);
    
    res.json({ exists: rows.length > 0 });
  } catch (err) {
    console.error('Error validating professional registration:', err);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
});

// Manejar errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


