// main.js - Script principal para la funcionalidad de la aplicación

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('main.js cargado correctamente');
    
    // Variables globales
    let currentTab = 'patient';
    
    // Inicialización
    initTabs();
    setupEventListeners();
    
    // Función para inicializar las pestañas
    function initTabs() {
        // Activar la pestaña por defecto
        switchTab('patient');
    }
    
    // Configurar event listeners
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
                switchTab(tabType);
                changelink(tabType);
            });
        });
    }
    
    // Función para cambiar de pestaña
    function switchTab(tabType) {
        const tabs = document.querySelectorAll('.tab-button');
        const activeTab = document.querySelector(`[data-tab="${tabType}"]`);
        
        // Remover clase active de todas las pestañas
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // Agregar clase active a la pestaña seleccionada
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // Actualizar variable global
        currentTab = tabType;
        
        // Actualizar título según el tipo de usuario
        const title = document.querySelector('.form-title');
        if (title) {
            title.textContent = tabType === 'patient' ? 'Acceder a Mi Cuenta' : 'Acceso Profesional';
        }
        
        // Actualizar placeholder del email si es necesario
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.placeholder = tabType === 'doctor' ? 'Email profesional' : 'Correo electrónico';
        }
        
        // Resetear formulario
        resetForm();
    }
    
    // Función para cambiar el enlace de registro según el tipo de usuario
    function changelink(tabType) {
        const link = document.getElementById('register-link');
        const container = document.getElementById('register');
        
        if (container) {
            container.style.display = 'block';
        }
        
        if (link) {
            link.href = tabType === 'patient' ? 'register.html' : 'registerdoctor.html';
        }
    }
    
    // Función para validar el formulario
    function validateForm() {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const submitBtn = document.getElementById('submit-btn');
        const emailError = document.getElementById('email-error');
        
        if (!emailInput || !passwordInput || !submitBtn || !emailError) return;
        
        const email = emailInput.value;
        const password = passwordInput.value;
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = email && emailRegex.test(email);
        
        // Mostrar/ocultar mensaje de error de email
        if (email && !isEmailValid) {
            emailInput.classList.add('error');
            if (emailError) emailError.classList.add('show');
        } else {
            emailInput.classList.remove('error');
            if (emailError) emailError.classList.remove('show');
        }
        
        // Habilitar/deshabilitar botón de envío
        submitBtn.disabled = !(isEmailValid && password.length > 0);
    }
    
    // Función para mostrar/ocultar la contraseña
    function togglePassword() {
        const passwordInput = document.getElementById('password');
        const toggleButton = document.getElementById('password-toggle');
        
        if (!passwordInput || !toggleButton) return;
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleButton.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            toggleButton.textContent = '👁';
        }
    }
    
    // Función para resetear el formulario
    function resetForm() {
        const form = document.getElementById('loginForm');
        const submitBtn = document.getElementById('submit-btn');
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        
        if (form) form.reset();
        if (submitBtn) submitBtn.disabled = true;
        if (emailInput) emailInput.classList.remove('error');
        if (emailError) emailError.classList.remove('show');
    }
    
    // Función para manejar el envío del formulario
    function handleSubmit(event) {
        event.preventDefault();
        
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const submitBtn = document.getElementById('submit-btn');
        
        if (!emailInput || !passwordInput || !submitBtn) return;
        
        const email = emailInput.value;
        const password = passwordInput.value;
        const userType = currentTab;
        
        // Mostrar estado de carga
        submitBtn.textContent = 'Iniciando sesión...';
        submitBtn.disabled = true;
        
        // Simular proceso de login (reemplazar con llamada real al servidor)
        console.log(`Intento de inicio de sesión - Tipo: ${userType}, Email: ${email}`);
        
        // Aquí iría la lógica de autenticación real
        setTimeout(() => {
            // Simular respuesta del servidor
            submitBtn.textContent = 'Iniciar sesión';
            validateForm();
            
            // Mostrar mensaje de éxito/error
            alert(`Inicio de sesión simulado para ${userType === 'patient' ? 'paciente' : 'doctor'}: ${email}`);
        }, 1500);
    }
    
    // Hacer que las funciones estén disponibles globalmente si se necesitan desde el HTML
    window.switchTab = switchTab;
    window.changelink = changelink;
    window.togglePassword = togglePassword;
    
    console.log('Aplicación inicializada correctamente');
});



// Función para redirigir al hacer clic en el elemento con la clase "logo"
document.querySelector('.logo').addEventListener('click', function() {
    const currentPag = window.location.pathname.split('/').pop();
    if(currentPag !== 'index.html' && currentPag !== '') {
        window.location.href = '../index.html';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const currentPage = window.location.pathname.split('/').pop() || 'TheHome.html';
    
    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref === currentPage) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
        });
      }
    });
  });