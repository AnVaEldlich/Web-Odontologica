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
    const [rows] = await db.query('SELECT * FROM solicitud_citas ORDER BY fecha_registro DESC');
    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Insertar citas - CORREGIDO
app.post('/api/appointments', async (req, res) => {
  try {
    const {
      nombre,
      email,
      telefono,
      fecha_nacimiento,
      tratamiento,
      doctor,
      fecha_cita,
      hora_cita,
      comentarios,
      tipo_visita  // CORREGIDO: nombre del campo
    } = req.body;
    
    // Validación de campos obligatorios
    if (!nombre || !email || !telefono || !fecha_cita || !hora_cita || !tratamiento) {
      return res.status(400).json({ 
        success: false, 
        message: 'Los campos nombre, email, teléfono, fecha de cita, hora de cita y tratamiento son obligatorios' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'El formato del email no es válido' 
      });
    }

    // Validar que la fecha de la cita no sea en el pasado
    const fechaCita = new Date(fecha_cita);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaCita < hoy) {
      return res.status(400).json({ 
        success: false, 
        message: 'La fecha de la cita no puede ser anterior a hoy' 
      });
    }

    // Determinar si es emergencia o primera visita
    const esEmergencia = tipo_visita === 'emergencia' ? 1 : 0;
    const esPrimeraVisita = tipo_visita === 'primera_visita' ? 1 : 0;
    
    const sql = `
      INSERT INTO solicitud_citas (
        nombre, email, telefono, fecha_nacimiento,
        tratamiento, doctor, fecha_cita, hora_cita, 
        comentarios, emergencia, primer_visita
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      nombre.trim(),
      email.toLowerCase().trim(),
      telefono.trim(),
      fecha_nacimiento || null,
      tratamiento,
      doctor || null,
      fecha_cita,
      hora_cita,
      comentarios || null,
      esEmergencia,
      esPrimeraVisita
    ];
    
    const [result] = await db.query(sql, values);
    
    res.json({ 
      success: true, 
      message: 'Cita solicitada con éxito', 
      data: {
        id: result.insertId,
        nombre: nombre,
        fecha_cita: fecha_cita,
        hora_cita: hora_cita
      }
    });
    
  } catch (error) {
    console.error('Error al insertar cita:', error);
    
    // Manejo de errores específicos de MySQL
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        success: false, 
        message: 'Ya existe una cita con estos datos' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor al procesar la cita' 
    });
  }
});

// NUEVO: Endpoint para verificar disponibilidad de citas
app.get('/api/appointments/availability/:fecha/:hora', async (req, res) => {
  try {
    const { fecha, hora } = req.params;
    
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM solicitud_citas WHERE fecha_cita = ? AND hora_cita = ?',
      [fecha, hora]
    );
    
    const isAvailable = rows[0].count === 0;
    
    res.json({
      success: true,
      available: isAvailable,
      message: isAvailable ? 'Horario disponible' : 'Horario ocupado'
    });
    
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar disponibilidad'
    });
  }
});

// NUEVO: Endpoint para cancelar cita
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query(
      'DELETE FROM solicitud_citas WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Cita cancelada exitosamente'
    });
    
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cancelar la cita'
    });
  }
});
// -----------------------------------------------------------------------

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

