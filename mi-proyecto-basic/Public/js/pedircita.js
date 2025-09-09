

// Configurar fecha mínima (hoy)
document.addEventListener('DOMContentLoaded', function() {
    const fechaCitaInput = document.getElementById('fecha_cita');
    const today = new Date().toISOString().split('T')[0];
    fechaCitaInput.setAttribute('min', today);
    
    // Configurar horas de atención (8:00 AM - 6:00 PM)
    const horaCitaInput = document.getElementById('hora_cita');
    horaCitaInput.setAttribute('min', '08:00');
    horaCitaInput.setAttribute('max', '18:00');
});

// Función para mostrar mensajes al usuario
function showMessage(message, type = 'info') {
    // Remover mensaje anterior si existe
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Crear nuevo mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Insertar mensaje antes del formulario
    const form = document.getElementById('appointment-form');
    form.parentNode.insertBefore(messageDiv, form);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (messageDiv && messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
    
    // Scroll hacia el mensaje
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Función para validar disponibilidad
async function checkAvailability(fecha, hora) {
    try {
        const response = await fetch(`/api/appointments/availability/${fecha}/${hora}`);
        const result = await response.json();
        return result.available;
    } catch (error) {
        console.error('Error checking availability:', error);
        return true; // Asumir disponible si hay error
    }
}

// Validación en tiempo real de fecha y hora
document.getElementById('fecha_cita').addEventListener('change', async function() {
    const fecha = this.value;
    const horaInput = document.getElementById('hora_cita');
    const hora = horaInput.value;
    
    if (fecha && hora) {
        const available = await checkAvailability(fecha, hora);
        if (!available) {
            showMessage('Este horario ya está ocupado. Por favor, seleccione otro.', 'error');
            horaInput.focus();
        }
    }
});

document.getElementById('hora_cita').addEventListener('change', async function() {
    const hora = this.value;
    const fechaInput = document.getElementById('fecha_cita');
    const fecha = fechaInput.value;
    
    if (fecha && hora) {
        const available = await checkAvailability(fecha, hora);
        if (!available) {
            showMessage('Este horario ya está ocupado. Por favor, seleccione otro.', 'error');
            this.focus();
        }
    }
});

// Manejo del envío del formulario - CORREGIDO
document.getElementById('appointment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = document.getElementById('submit-button');
    const originalText = submitButton.innerHTML;
    
    // Deshabilitar botón y mostrar loading
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    
    try {
        // Obtener datos del formulario
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Validaciones adicionales del frontend
        if (!data.nombre.trim()) {
            throw new Error('El nombre es obligatorio');
        }
        
        if (!data.email.trim()) {
            throw new Error('El email es obligatorio');
        }
        
        if (!data.telefono.trim()) {
            throw new Error('El teléfono es obligatorio');
        }
        
        if (!data.tratamiento) {
            throw new Error('Debe seleccionar un tratamiento');
        }
        
        if (!data.fecha_cita) {
            throw new Error('Debe seleccionar una fecha');
        }
        
        if (!data.hora_cita) {
            throw new Error('Debe seleccionar una hora');
        }
        
        // Verificar disponibilidad una vez más
        const available = await checkAvailability(data.fecha_cita, data.hora_cita);
        if (!available) {
            throw new Error('Este horario ya no está disponible. Por favor, seleccione otro.');
        }
        
        // Enviar datos al servidor
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            showMessage(`¡Cita solicitada con éxito! Su cita está programada para el ${data.fecha_cita} a las ${data.hora_cita}.`, 'success');
            
            // Limpiar formulario después del éxito
            setTimeout(() => {
                e.target.reset();
            }, 2000);
            
        } else {
            throw new Error(result.message || 'Hubo un problema al procesar su solicitud');
        }
        
    } catch (error) {
        console.error('Error enviando datos:', error);
        showMessage(error.message || 'Hubo un error al procesar su solicitud. Por favor, inténtelo nuevamente.', 'error');
    } finally {
        // Rehabilitar botón
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
});

// Validación en tiempo real para campos requeridos
const requiredFields = ['nombre', 'email', 'telefono', 'fecha_cita', 'hora_cita', 'tratamiento'];

requiredFields.forEach(fieldName => {
    const field = document.getElementById(fieldName);
    if (field) {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    }
});

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Remover clases de error previas
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    let isValid = true;
    let errorMessage = '';
    
    // Validaciones específicas
    if (!value && field.required) {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
    } else if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Formato de email inválido';
        }
    } else if (fieldName === 'telefono' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Formato de teléfono inválido';
        }
    }
    
    if (!isValid) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = errorMessage;
        field.parentNode.appendChild(errorDiv);
    }
    
    return isValid;
}