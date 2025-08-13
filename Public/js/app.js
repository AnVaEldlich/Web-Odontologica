// Función para alternar el menú lateral
function toggleMenu() {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// Cerrar menú al hacer clic fuera de él
document.addEventListener('click', function(event) {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (sidebar && menuToggle) {
        if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('App.js cargado correctamente');
    
    // Agregar eventos a formularios si existen
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Funcionalidad de login pendiente de implementar');
        });
    }
    
    // Agregar eventos a formularios de cita si existen
    const citaForm = document.querySelector('.formulario-cita form');
    if (citaForm) {
        citaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Cita enviada correctamente (funcionalidad pendiente)');
        });
    }
});