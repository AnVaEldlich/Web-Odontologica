// main.js - Script principal para la funcionalidad de la aplicación

// Variables globales
let currentTab = 'patient';

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('main.js cargado correctamente');
    
    // Inicialización
    initApp();
});

// Función principal de inicialización
function initApp() {
    initTabs();
    setupEventListeners();
    setupLogoNavigation();
    setupSidebarNavigation();
    console.log('Aplicación inicializada correctamente');
}

// Función para inicializar las pestañas
function initTabs() {
    // Activar la pestaña por defecto
    switchTab('patient');
}

// Configurar todos los event listeners
function setupEventListeners() {
    // Validación en tiempo real del formulario
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput && passwordInput) {
        emailInput.addEventListener('input', validateForm);
        passwordInput.addEventListener('input', validateForm);
    }
    
    // Botón de toggle de contraseña
    const toggleBtn = document.getElementById('password-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', togglePassword);
    }
    
    // Envío del formulario
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleSubmit);
    }
    
    // Botones de cambio de pestaña
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            if (tabType) {
                switchTab(tabType);
                changeLink(tabType);
            }
        });
    });
}

// Configurar navegación del logo
function setupLogoNavigation() {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function() {
            const currentPage = window.location.pathname.split('/').pop();
            if (currentPage !== 'index.html' && currentPage !== '') {
                window.location.href = '../index.html';
            }
        });
    }
}

// Configurar navegación del sidebar
function setupSidebarNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const currentPage = window.location.pathname.split('/').pop() || 'TheHome.html';
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Navegación prevenida: ya estás en esta página');
            });
        }
    });
}

// Función para cambiar de pestaña
function switchTab(tabType) {
    // Validar tipo de pestaña
    if (!['patient', 'doctor'].includes(tabType)) {
        console.error('Tipo de pestaña inválido:', tabType);
        return;
    }
    
    const tabs = document.querySelectorAll('.tab-button');
    const activeTab = document.querySelector(`[data-tab="${tabType}"]`);
    
    // Remover clase active de todas las pestañas
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Agregar clase active a la pestaña seleccionada
    if (activeTab) {
        activeTab.classList.add('active');
        currentTab = tabType;
        
        // Actualizar UI según el tipo de usuario
        updateUIForUserType(tabType);
        
        // Resetear formulario
        resetForm();
        
        console.log(`Pestaña cambiada a: ${tabType}`);
    } else {
        console.error('No se encontró la pestaña:', tabType);
    }
}

// Función para actualizar la UI según el tipo de usuario
function updateUIForUserType(tabType) {
    // Actualizar título
    const title = document.querySelector('.form-title');
    if (title) {
        title.textContent = tabType === 'patient' ? 'Acceder a Mi Cuenta' : 'Acceso Profesional';
    }
    
    // Actualizar placeholder del email
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.placeholder = tabType === 'doctor' ? 'Email profesional' : 'Correo electrónico';
    }
}

// Función para cambiar el enlace de registro según el tipo de usuario
function changeLink(tabType) {
    const link = document.getElementById('register-link');
    const container = document.getElementById('register');
    
    if (container) {
        container.style.display = 'block';
    }
    
    if (link) {
        const href = tabType === 'patient' ? 'register.html' : 'registerdoctor.html';
        link.href = href;
        console.log(`Enlace de registro cambiado a: ${href}`);
    }
}

// Función para validar el formulario
function validateForm() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('submit-btn');
    const emailError = document.getElementById('email-error');
    
    if (!emailInput || !passwordInput || !submitBtn) {
        console.warn('Elementos del formulario no encontrados');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = email && emailRegex.test(email);
    
    // Manejar estado de error del email
    if (email && !isEmailValid) {
        emailInput.classList.add('error');
        if (emailError) emailError.classList.add('show');
    } else {
        emailInput.classList.remove('error');
        if (emailError) emailError.classList.remove('show');
    }
    
    // Validar contraseña (mínimo 6 caracteres)
    const isPasswordValid = password.length >= 6;
    
    // Habilitar/deshabilitar botón de envío
    const isFormValid = isEmailValid && isPasswordValid;
    submitBtn.disabled = !isFormValid;
    
    // Cambiar estilo del botón según validez
    if (isFormValid) {
        submitBtn.classList.add('valid');
    } else {
        submitBtn.classList.remove('valid');
    }
}

// Función para mostrar/ocultar la contraseña
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.getElementById('password-toggle');
    
    if (!passwordInput || !toggleButton) {
        console.warn('Elementos de toggle de contraseña no encontrados');
        return;
    }
    
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    toggleButton.textContent = isPassword ? '🙈' : '👁';
    toggleButton.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
}

// Función para resetear el formulario
function resetForm() {
    const form = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submit-btn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    
    if (form) form.reset();
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.remove('valid');
        submitBtn.textContent = 'Iniciar sesión';
    }
    if (emailInput) emailInput.classList.remove('error');
    if (passwordInput && passwordInput.type === 'text') {
        passwordInput.type = 'password';
        const toggleButton = document.getElementById('password-toggle');
        if (toggleButton) toggleButton.textContent = '👁';
    }
    if (emailError) emailError.classList.remove('show');
    
    console.log('Formulario reseteado');
}

// Función para manejar el envío del formulario
async function handleSubmit(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('submit-btn');
    
    if (!emailInput || !passwordInput || !submitBtn) {
        console.error('Elementos del formulario no encontrados');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const userType = currentTab;
    
    // Validación final antes del envío
    if (!email || !password) {
        showMessage('Por favor, completa todos los campos', 'error');
        return;
    }
    
    // Mostrar estado de carga
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Iniciando sesión...';
    submitBtn.disabled = true;
    
    try {
        console.log(`Intento de inicio de sesión - Tipo: ${userType}, Email: ${email}`);
        
        // Simular proceso de login (reemplazar con llamada real al servidor)
        await simulateLogin(email, password, userType);
        
        // Aquí podrías redirigir al usuario
        // window.location.href = userType === 'patient' ? 'patient-dashboard.html' : 'doctor-dashboard.html';
        
    } catch (error) {
        console.error('Error en el login:', error);
        showMessage('Error al iniciar sesión. Verifica tus credenciales.', 'error');
    } finally {
        // Restaurar botón
        submitBtn.textContent = originalText;
        validateForm(); // Esto habilitará el botón si el formulario es válido
    }
}

// Función para simular el proceso de login
function simulateLogin(email, password, userType) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simular validación simple
            if (email.includes('@') && password.length >= 6) {
                resolve({ success: true, userType, email });
            } else {
                reject(new Error('Credenciales inválidas'));
            }
        }, 1500);
    });
}

// Función para mostrar mensajes al usuario
function showMessage(message, type = 'info') {
    // Crear elemento de mensaje si no existe
    let messageContainer = document.getElementById('message-container');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'message-container';
        messageContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 300px;
        `;
        document.body.appendChild(messageContainer);
    }
    
    // Crear mensaje
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.style.cssText = `
        padding: 12px 16px;
        margin-bottom: 10px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        background-color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    `;
    messageEl.textContent = message;
    
    messageContainer.appendChild(messageEl);
    
    // Animar entrada
    setTimeout(() => {
        messageEl.style.opacity = '1';
        messageEl.style.transform = 'translateX(0)';
    }, 10);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        messageEl.style.opacity = '0';
        messageEl.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 3000);
}

// Hacer funciones disponibles globalmente si se necesitan desde el HTML
window.switchTab = switchTab;
window.changeLink = changeLink;
window.togglePassword = togglePassword;