# Sistema de Registro de Odontólogos

Este documento proporciona instrucciones para configurar y utilizar el sistema de registro de odontólogos.

## Configuración de la Base de Datos

1. Asegúrate de tener MySQL instalado y en ejecución en tu sistema.

2. Ejecuta el script de inicialización de la base de datos:

   ```bash
   mysql -u root -p < src/init_db.sql
   ```

   Este script creará la base de datos `odontologia_db` y las tablas necesarias para el sistema, incluyendo:
   - `userdoctores`: Tabla principal para almacenar la información de los odontólogos
   - `doctor_especialidad`: Tabla para almacenar las especialidades de cada doctor

## Configuración del Servidor

1. Asegúrate de tener Node.js instalado en tu sistema.

2. Instala las dependencias del proyecto:

   ```bash
   npm install
   ```

3. Inicia el servidor:

   ```bash
   node src/App.js
   ```

   El servidor se iniciará en http://localhost:3000.

## Uso del Sistema

1. Abre un navegador web y navega a http://localhost:3000/Pages/registerdoctor.html

2. Completa el formulario de registro con la información del odontólogo.

3. Haz clic en "Registrarme" para enviar el formulario.

4. Si el registro es exitoso, verás un mensaje de confirmación.

## Estructura de la Base de Datos

El sistema utiliza las siguientes tablas:

- **userdoctores**: Almacena la información principal de los odontólogos, incluyendo datos personales, profesionales y tributarios.
- **doctor_especialidad**: Tabla de relación que conecta doctores con sus especialidades seleccionadas durante el registro.

### Campos principales de userdoctores

- **id**: Identificador único del doctor (autoincremental)
- **nombre**: Nombre completo del odontólogo
- **identificacion**: Número de identificación personal
- **email**: Correo electrónico (único)
- **telefono**: Número de teléfono móvil
- **direccion**: Dirección del consultorio
- **registroProfesional**: Número de registro profesional
- **nit**: Número de Identificación Tributaria
- **regimen**: Régimen tributario (Simplificado o Común)
- **fechaRegistro**: Fecha y hora del registro (automático)

## Solución de Problemas

Si encuentras algún problema durante la configuración o el uso del sistema, verifica lo siguiente:

1. **Error de conexión a la base de datos**:
   - Asegúrate de que MySQL esté en ejecución
   - Verifica que las credenciales en `src/db.js` sean correctas
   - Confirma que la base de datos `odontologia_db` exista

2. **Error al registrar un doctor**:
   - Revisa la consola del navegador para ver errores específicos
   - Verifica que todos los campos requeridos estén completos
   - Asegúrate de que el correo electrónico no esté ya registrado

3. **Error al iniciar el servidor**:
   - Verifica que todas las dependencias estén instaladas (`npm install`)
   - Asegúrate de que el puerto 3000 no esté siendo utilizado por otra aplicación
   - Revisa los logs del servidor para identificar errores específicos



## Contacto

Si necesitas ayuda adicional, por favor contacta al administrador del sistema.